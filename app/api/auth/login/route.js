import { connectDB } from "../../../lib/db";
import Users from "../../../../models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    // Validar entrada
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email y password son requeridos" }),
        { status: 400 }
      );
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET no configurado");
      return new Response(
        JSON.stringify({ error: "Error en el servidor" }),
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const maxAge = 7 * 24 * 60 * 60;
    const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookie = `token=${token}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Strict${secureFlag}`;

    return new Response(
      JSON.stringify({
        message: "Login exitoso",
        token,
        user: {
          _id: user._id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
      }),
      { status: 200, headers: { "Set-Cookie": cookie, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.log("Error en login", err);
    return new Response(
      JSON.stringify({ error: "Error en el servidor" }),
      { status: 500 }
    );
  }
}
