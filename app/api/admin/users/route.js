import { connectDB } from "../../../lib/db";
import Users from "../../../../models/Users";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

async function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  let token = null;
  if (auth && auth.startsWith("Bearer ")) {
    token = auth.slice(7);
  } else {
    token = cookies().get("token")?.value || null;
  }
  if (!token) {
    const err = new Error("No autorizado");
    err.status = 401;
    throw err;
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
  const { payload } = await jwtVerify(token, secret);
  if (payload?.rol !== "admin") {
    const err = new Error("Prohibido");
    err.status = 403;
    throw err;
  }
  return payload;
}

export async function GET(req) {
  try {
    await connectDB();
    await verifyAdmin(req);
    const users = await Users.find()
      .select("nombre email identificacion fechaNacimiento rol createdAt updatedAt")
      .lean();
    return new Response(JSON.stringify({ users }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    const status = err?.status || 500;
    const message = err?.message || "Error en el servidor";
    return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const payload = await verifyAdmin(req);
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Id requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const body = await req.json();
    const allowed = ["nombre", "email", "identificacion", "fechaNacimiento", "rol", "password"];
    const update = {};
    for (const k of allowed) {
      if (body[k] !== undefined) update[k] = body[k];
    }
    const user = await Users.findById(id);
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    if (update.password) {
      user.password = await bcrypt.hash(String(update.password), 10);
      delete update.password;
    }
    for (const [k, v] of Object.entries(update)) {
      user[k] = v;
    }
    await user.save();
    const resp = {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      identificacion: user.identificacion,
      fechaNacimiento: user.fechaNacimiento,
      rol: user.rol,
      updatedAt: user.updatedAt,
    };
    return new Response(JSON.stringify({ message: "Usuario actualizado", user: resp }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    const status = err?.status || 500;
    const message = err?.message || "Error en el servidor";
    return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const payload = await verifyAdmin(req);
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Id requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (String(payload.userId) === String(id)) {
      return new Response(JSON.stringify({ error: "No puedes eliminar tu propio usuario" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const deleted = await Users.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ message: "Usuario eliminado" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    const status = err?.status || 500;
    const message = err?.message || "Error en el servidor";
    return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

export async function filter(req) {
    try {
        await connectDB();
        await verifyAdmin(req);
        const url = new URL(req.url);
        const query = url.searchParams.get("query");
        if (!query) {
            return new Response(JSON.stringify({ error: "Query requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        const users = await Users.find({
            $or: [
                { nombre: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { identificacion: { $regex: query, $options: "i" } },
            ],
        })
            .select("nombre email identificacion fechaNacimiento rol createdAt updatedAt")
            .lean();
        return new Response(JSON.stringify({ users }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        const status = err?.status || 500;
        const message = err?.message || "Error en el servidor";
        return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
    }
}
