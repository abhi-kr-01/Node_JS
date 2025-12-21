import { Schema, model } from'mongoose';
import { type } from 'os';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        require: true,
    }
},{ timestamps:true });
// here we add timestamp:true -> it show data created at and updated at or deleted at time show

export const User = model('user', userSchema);
// we create a model which name is user and it's structure is userSchema
// and that model stores in User Object;

export default User;

//Now we will do all operation using User object 
//e.g: User.add()




//mongo db has no rule to make which type of db or it's structure 
// but we have to tell mongoose so we create schema
//there is no need if giving id for particular data bcz mongoose
//automatically generate a id