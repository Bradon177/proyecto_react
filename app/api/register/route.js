// app/api/register/route.js

export async function POST(req) {
  const data = await req.json(); // datos que envías desde el formulario o Thunder Client

  console.log("Datos recibidos en /api/register:", data);

  // Aquí podrías validar datos, pero por ahora es demo
  return Response.json({
    status: "success",
    message: "Usuario registrado (demo sin base de datos)"
  });
}

// Esto es opcional, pero sirve para probar rápido en el navegador
export async function GET() {
  return Response.json({
    status: "ok",
    message: "Endpoint /api/register funcionando"
  });
}
