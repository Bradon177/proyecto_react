import { connectDB } from "../../../lib/db";
import Users from "../../../../models/Users";
import jwt from "jsonwebtoken";
import { createRemoteJWKSet, jwtVerify, decodeJwt } from "jose";

const GOOGLE_ISSUER = "https://accounts.google.com";
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const FIREBASE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const idToken = body?.id_token;

    if (!idToken) {
      return new Response(JSON.stringify({ error: "id_token es requerido" }), { status: 400 });
    }

    const decoded = decodeJwt(idToken);
    let payload;
    if (typeof decoded?.iss === "string" && decoded.iss.startsWith("https://securetoken.google.com/")) {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
      if (!projectId) {
        return new Response(JSON.stringify({ error: "FIREBASE_PROJECT_ID no configurado" }), { status: 500 });
      }
      const issuer = `https://securetoken.google.com/${projectId}`;
      try {
        const verified = await jwtVerify(idToken, FIREBASE_JWKS, { issuer, audience: projectId });
        payload = verified.payload;
      } catch (e) {
        return new Response(JSON.stringify({ error: "Token de Firebase inválido" }), { status: 401 });
      }
    } else {
      const audience = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
      if (!audience) {
        return new Response(JSON.stringify({ error: "GOOGLE_CLIENT_ID no configurado" }), { status: 500 });
      }
      try {
        const verified = await jwtVerify(idToken, GOOGLE_JWKS, { issuer: GOOGLE_ISSUER, audience });
        payload = verified.payload;
      } catch (e) {
        return new Response(JSON.stringify({ error: "Token de Google inválido" }), { status: 401 });
      }
    }

    const email = payload?.email;
    const name = payload?.name;
    if (!email) {
      return new Response(JSON.stringify({ error: "Email no disponible en el token" }), { status: 400 });
    }

    let user = await Users.findOne({ email });
    if (!user) {
      const googleId = payload?.sub || undefined;
      user = await Users.create({
        nombre: name || "",
        email,
        provider: "google",
        googleId,
        rol: "user",
      });
    }

    if (!process.env.JWT_SECRET) {
      return new Response(JSON.stringify({ error: "JWT_SECRET no configurado" }), { status: 500 });
    }

    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const maxAge = 7 * 24 * 60 * 60;
    const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookie = `token=${token}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Strict${secureFlag}`;

    return new Response(
      JSON.stringify({
        message: "Login con Google exitoso",
        token,
        user: {
          _id: user._id,
          nombre: user.nombre || name || "",
          email: user.email,
          rol: user.rol,
        },
      }),
      { status: 200, headers: { "Set-Cookie": cookie, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error en el servidor" }), { status: 500 });
  }
}

