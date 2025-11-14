"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    cedula: "",
    fecha: "",
    telefono: "",
    genero: "",
    password: "",
    repetir: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.repetir) {
      setMsg("⚠️ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message);

      if (data.status === "ok") {
        // Redirigir al login si el registro es exitoso
        setTimeout(() => {
          router.push("/Dashboard/login");
        }, 1500);
      }

    } catch (error) {
      setMsg("⚠️ Error enviando datos al servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">Crear cuenta</h2>
          <p className="text-gray-600">Regístrate para continuar</p>
        </div>


        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Correo electrónico</label>
          <input
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            onChange={handleChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Cédula</label>
          <input
            name="cedula"
            type="text"
            placeholder="Tu número de cédula"
            onChange={handleChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Fecha de nacimiento</label>
          <input
            name="fecha"
            type="date"
            onChange={handleChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Teléfono</label>
          <input
            name="telefono"
            type="text"
            placeholder="Tu número de teléfono"
            onChange={handleChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Género</label>
          <select
            name="genero"
            onChange={handleChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="">Seleccione una opción</option>
            <option value="m">Masculino</option>
            <option value="f">Femenino</option>
            <option value="o">Otro</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            onChange={handleChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Repetir contraseña</label>
          <input
            name="repetir"
            type="password"
            placeholder="Repite tu contraseña"
            onChange={handleChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition">
          Registrarse
        </button>

        <button
          type="button"
          onClick={() => router.push("/Dashboard/login")}
          className="w-full h-11 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Volver al login
        </button>

        {msg && <p className="text-center text-red-600">{msg}</p>}
      </form>
    </div>
  );
}
