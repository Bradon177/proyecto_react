"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../lib/service/authService";




export default function Page() {

  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false)

  const handleClick = () => {
    router.push("/Pages/login")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const data = {
        nombre: name,
        email,
        identificacion,
        fechaNacimiento,
        password,
      };
      const response = await registerUser(data);
      console.log("Registro exitoso:", response);
      router.push("/Pages/login");
    } catch (error) {
      console.error("Error en el registro:", error);
      const message = error?.message || error?.data?.error || "Error en el registro. Por favor, intenta de nuevo.";
      alert(message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
       className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Crear cuenta</h2>
          <p className="text-gray-600">Completa tus datos para registrarte</p>
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Nombre completo</label>
          <input
            type="text"
            placeholder="Nombre y Apellido"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-gray-400 text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Correo electrónico</label>
          <input
            type="email"
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-gray-400 text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Identificación</label>
          <input
            type="text"
            placeholder="Documento o ID"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-gray-400 text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Fecha de nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Contraseña</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-gray-400 text-black"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
            >
              {show ? <Eye size={22} /> : <EyeOff size={22} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Confirmar contraseña</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full h-11 px-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-gray-400 text-black"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
            >
              {show ? <Eye size={22} /> : <EyeOff size={22} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition"
        >
          Crear cuenta
        </button>

        <p className="text-center text-gray-600 text-sm pt-4 border-t">
          <button
            type="button"
            onClick={handleClick}
            className="text-blue-600 hover:text-blue-700 font-medium ml-1"
          >
            Volver al inicio de sesión
          </button>
        </p>

      </form>
    </div>
  );
}
