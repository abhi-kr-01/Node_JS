const db = require("./DB");
const { userTable } = require('./DRIZZLE/schema');

async function getAllUser(){
    const users = await db.select().from(userTable);
    console.log(`use in DB`,users);
    return users;
}

async function createUser({id,name,email}){
    await db.insert(userTable).values({
        id,
        name,
        email,
    });
}

createUser({id:1,name:'Abhishek',email:'abhi@example.com'});
createUser({id:2,name:'Asmit',email:'asmit@example.com'});


getAllUser();