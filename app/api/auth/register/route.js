import { connectDB } from "../../../lib/db";
import Users from "../../../../models/Users";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try{
        await connectDB ();
        const body= await req.json()
        const {nombre, email, identificacion, fechaNacimiento, password}= body;

        // Validaciones de entrada
        if(!nombre || !email || !identificacion || !fechaNacimiento || !password){
            return new Response(JSON.stringify({ error: "Todos los campos son obligatorios" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const emailTrim = String(email).trim();
        const identificacionTrim = String(identificacion).trim();
        const fechaTrim = String(fechaNacimiento).trim();
        const passwordStr = String(password);

        // Formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(emailTrim)){
            return new Response(JSON.stringify({ error: "Formato de email inválido" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Identificación: solo dígitos y longitud razonable (ej. 6-12)
        const idDigits = identificacionTrim.replace(/\D/g, "");
        if(idDigits.length < 6 || idDigits.length > 12){
            return new Response(JSON.stringify({ error: "Identificación inválida" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Fecha de nacimiento válida y no en el futuro, edad mínima 18
        const dob = new Date(fechaTrim);
        if(Number.isNaN(dob.getTime())){
            return new Response(JSON.stringify({ error: "Fecha de nacimiento inválida" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        const today = new Date();
        if(dob > today){
            return new Response(JSON.stringify({ error: "Fecha de nacimiento no puede ser futura" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        // calcular edad
        const ageDiffMs = today - dob;
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if(age < 18){
            return new Response(JSON.stringify({ error: "Debes tener al menos 18 años" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Contraseña: mínimo 6 caracteres, al menos una letra y un número
        if(passwordStr.length < 6 || !/[A-Za-z]/.test(passwordStr) || !/\d/.test(passwordStr)){
            return new Response(JSON.stringify({ error: "La contraseña debe tener al menos 6 caracteres, incluir letras y números" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const exist = await Users.findOne({email: emailTrim});
        if(exist){
          return new Response(JSON.stringify({ error: "El email ya está registrado" }), { status: 400, headers: { "Content-Type": "application/json" } });  
        }

        const idExist= await Users.findOne({identificacion: identificacionTrim})
        if(idExist){
            return new Response(JSON.stringify({ error: "La identificación ya existe" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const hashed = await bcrypt.hash(passwordStr, 10);

        const user= await Users.create({
            nombre,
            email: emailTrim,
            identificacion: identificacionTrim,
            fechaNacimiento: dob,
            password: hashed,
        });

        // No devolver password en la respuesta
        const userResp = {
            _id: user._id,
            nombre: user.nombre,
            email: user.email,
            identificacion: user.identificacion,
            fechaNacimiento: user.fechaNacimiento,
        };

        return new Response(JSON.stringify({ message: "Usuario creado correctamente", user: userResp }), { status: 201, headers: { "Content-Type": "application/json" } });

    }catch(err){
        console.error("Error en register route:", err);
        const message = err?.message || "Error en el servidor";
        return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    
}
