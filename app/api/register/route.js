// app/api/register/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      email,
      cedula,
      fecha,
      telefono,
      genero,
      password,
      repetir,
    } = data;

    // 1) Campos vacíos
    if (!email || !cedula || !fecha || !telefono || !genero || !password || !repetir) {
      return NextResponse.json(
        { status: "error", message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // 2) Validar email
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      return NextResponse.json(
        { status: "error", message: "El correo electrónico no es válido" },
        { status: 400 }
      );
    }

    // 3) Cédula solo números
    if (!/^\d+$/.test(cedula)) {
      return NextResponse.json(
        { status: "error", message: "La cédula solo debe contener números" },
        { status: 400 }
      );
    }

    // 4) Teléfono numérico 7–10 dígitos
    if (!/^\d{7,10}$/.test(telefono)) {
      return NextResponse.json(
        { status: "error", message: "El teléfono debe ser numérico (7 a 10 dígitos)" },
        { status: 400 }
      );
    }

    // 5) Contraseña mínimo 6 caracteres
    if (password.length < 6) {
      return NextResponse.json(
        { status: "error", message: "La contraseña debe tener mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    // 6) Contraseñas coinciden
    if (password !== repetir) {
      return NextResponse.json(
        { status: "error", message: "Las contraseñas no coinciden" },
        { status: 400 }
      );
    }

    // 7) Género válido
    const generosValidos = ["m", "f", "o"];
    if (!generosValidos.includes(genero.toLowerCase())) {
      return NextResponse.json(
        { status: "error", message: "El género seleccionado no es válido" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Usuario registrado correctamente ✔️",
    });

  } catch (error) {
    console.error("Error en /api/register:", error);
    return NextResponse.json(
      { status: "error", message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Endpoint /api/register funcionando",
  });
}
