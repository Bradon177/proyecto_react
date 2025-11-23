import { connectDB } from "../../lib/db";


export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "Conexión exitosa a MongoDB" });
  } catch (error) {
    return Response.json({ error: "Error al conectar a MongoDB", details: error.message }, { status: 500 });
  }
}
