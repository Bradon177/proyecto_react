import mongoose from "mongoose";

export async function connectDB() {
    if(mongoose.connection.readystate===1) return;

    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado exitosamente");

    }catch(err){
        console.log("Se presento un error",err);

    }
    
}