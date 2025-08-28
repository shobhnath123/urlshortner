import express from 'express';
import { urlPostRequestBodySchema } from '../validation/request.validation.js';
import { urlsTable } from '../models/url.model.js';
import { db } from '../models/index.js';
import { nanoid } from 'nanoid';
const router = express.Router();

router.post('/shorten', async (req, res) => {
   
       const userID = req.user.id;
       if(!userID){
           return res.status(401).json({ message: 'you must be logged in to shorten a URL' });
       }
       const validationResult  = await urlPostRequestBodySchema.safeParseAsync(req.body);

       if (!validationResult.success) {
           return res.status(400).json({ message: 'Invalid request', error: validationResult.error.errors });
       }
       const { url, code } = validationResult.data;
       const shortCode = code ?? nanoid(6);

       await db.insert(urlsTable).values({
           shortCode: shortCode,
           targetURL: url,
           userId: userID
       }).returning({
        id: urlsTable.id,
        shortCode: urlsTable.shortCode,
        targetURL: urlsTable.targetURL
       });

       return res.status(201).json({id: Result.id, shortCode:Result.shortCode, targetURL:Result.targetURL });
     
  
});

export default router;