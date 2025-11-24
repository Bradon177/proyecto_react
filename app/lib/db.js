import mongoose from "mongoose";

export async function connectDB() {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) return;
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI no configurado");
        }
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("Conectado exitosamente");
    } catch (err) {
        console.log("Se presento un error", err);
        throw err;
    }
}
