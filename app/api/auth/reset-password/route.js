import { connectDB } from "../../../lib/db";
import Users from "../../../../models/Users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const password = String(body?.password || "");
    const token = body?.token;
    const emailBody = body?.email;
    if (!password || password.length < 6) {
      return new Response(JSON.stringify({ error: "Contraseña inválida" }), { status: 400 });
    }
    let email = null;
    if (token) {
      if (!process.env.JWT_SECRET) {
        return new Response(JSON.stringify({ error: "JWT_SECRET no configurado" }), { status: 500 });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        email = decoded?.email;
      } catch (e) {
        return new Response(JSON.stringify({ error: "Token inválido o expirado" }), { status: 400 });
      }
    } else if (emailBody) {
      email = String(emailBody).trim().toLowerCase();
    }
    if (!email) {
      return new Response(JSON.stringify({ error: "Email requerido" }), { status: 400 });
    }
    const user = await Users.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }
    user.password = await bcrypt.hash(password, 10);
    user.provider = user.provider || "local";
    await user.save();
    return new Response(JSON.stringify({ message: "Contraseña actualizada" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error en el servidor" }), { status: 500 });
  }
}
