import { db } from '../db/index.js';
import { urlsTable } from '../models/index.js';

export async function insertURL(shortCode,url){

    const [result] = await db.insert(urlsTable).values({
        shortCode,
        targetURL: url,
        userId: req.user.id,
    }).returning({ 
        id: urlsTable.id,
        shortCode: urlsTable.shortCode,
        targetURL: urlsTable.targetURL,
    });

    return result;
}