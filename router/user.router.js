import express from 'express';
import {db} from '../db/index.js';
import { usersTable } from '../models/index.js';
import { eq } from 'drizzle-orm';
import { signupPostRequestBodySchema,loginPostRequestBodySchema } from '../validation/request.validation.js';
import { hashPasswordWithSalt } from '../utils/hash.js'
import { getUserByEmail } from '../services/user.service.js';
import jwt from 'jsonwebtoken';
import { createUserToken } from '../utils/token.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  // Handle user signup
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

  if(validationResult.error){
    return res.status(400).json({ message: 'Invalid request data', errors: validationResult.error.format() });
  }

  const { firstname, lastname, email, password } = validationResult.data;

  const existingUser =  await getUserByEmail(email);

  if(existingUser) return res.status(400).json({ message: `User with this email ${email} already exists` });


  const {salt, password: hasPassword } = hashPasswordWithSalt(password);
  
  const [user] = await db.insert(usersTable).values({
    firstname,
    lastname,
    email,
    salt,
    password: hasPassword
  }).returning({id:usersTable.id});

  return res.status(201).json({ message: 'User created successfully', data:{userId:user.id} });
});

router.post('/login', async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

  if(validationResult.error){
    return res.status(400).json({ message: 'Invalid request data', errors: validationResult.error });
  }

  const { email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser) return res.status(400).json({ message: `User with this email ${email} does not exist` });
  const { password: hashedPassword } = hashPasswordWithSalt(password, existingUser.salt);
 if(existingUser.password !== hashedPassword) {
  return res.status(401).json({ message: 'Invalid email or password' });
 }

const token = await createUserToken({ id: existingUser.id });
 return res.status(200).json({ message: 'Login successful', data: { userId: existingUser.id, token } });
})

export default router;