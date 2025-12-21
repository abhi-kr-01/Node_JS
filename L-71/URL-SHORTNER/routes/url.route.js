import express from 'express';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js'
import { nanoid } from 'nanoid';
import { ensureAuthenticated } from '../middleware/auth.middleware.js'
import { insertURL } from '../services/url.service.js';
import { insertURL } from '../services/url.service.js'
import { urlsTable } from '../models/url.model.js';
import { db } from '../db/index.js';
import { urlsTable } from '../models/index.js';
import { and, eq } from 'drizzle-orm';
import { error } from 'console';


const router = express.Router();

//to use this this user must be authenticated 
router.post('/shorten',ensureAuthenticated,async (req,res) => {
    //const userID = req.user?.id ;  // ? -> to prevent from server creash
//it things work in middleware
    

    const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({ error: validationResult.error});
    }

    const { url, code } = validationResult.data;

    const shortCode = code ?? nanoid(6)

    const result = await insertURL(shortCode,url);

    return res.status(201).json({
        id: result.id,
        shotCode: result.shortCode,
        tragetURL: result.targetURL, 
    });

});

router.get('/:shortcode', async (req,res) => {
    const code = req.params.shortcode;
    const result = await db.select({targetURL}).from(urlsTable).where(eq(code,urlsTable.shortCode));

    if(!result){
        return res.status(404).json({ error : "Invalid URL"});
    }

    return res.redirect(result.targetURL);
})

router.get('/codes', ensureAuthenticated, async (req,res) => {
    const [codes] = await db.select().from(urlsTable).where(eq(urlsTable.userId,req.user.id));

    return res.json({ codes });
})

router.delete('/:id', ensureAuthenticated , async (req,res) => {

    const id = req.params.id;

    await db.delete(urlsTable).where(and(eq(urlsTable.id,id),eq(urlsTable.userId,req.user.id)));

    return res.status(200).json({ delete : true })
})

export default router;

//to shorten url we will use npm package "nanoid" -> it will short url acording to 
//your prefrence length