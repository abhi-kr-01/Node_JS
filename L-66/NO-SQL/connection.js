import mongoose from 'mongoose';

export const connectMOngoDB = async(connectionURL)=>{
    const connect = await mongoose.connect(connectionURL);
    return connect;
}
