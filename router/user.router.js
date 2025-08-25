import express from 'express';
import {db} from '../db/index.js';
import { usersTable } from '../models/index.js';
import { eq } from 'drizzle-orm';
import { randomBytes, createHmac } from 'crypto';

const router = express.Router();

router.post('/signup', (req, res) => {
  // Handle user signup
  const { firstname, lastname, email, password } = req.body;

  const existingUser = db.select({id:usersTable.id}).from(usersTable).where(eq(usersTable.email, email));

  if(existingUser) return res.status(400).json({ message: `User with this email ${email} already exists` });

  const salt =  randomBytes(256).toString('hex');
  const hasPassword = createHmac('sha256', salt).update(password).digest('hex');
  const {user} = db.insert(usersTable).values({
    firstname,
    lastname,
    email,
    salt,
    password: hasPassword
  }).returning({id:usersTable.id});

  return res.status(201).json({ message: 'User created successfully', data:{userId:user.id} });
});

export default router;