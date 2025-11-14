"use client";
import React, { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* Título */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Recuperar contraseña</h2>
          <p className="text-gray-600">Ingresa tu correo y te enviaremos instrucciones</p>
        </div>

        {/* Campo de correo */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Correo electrónico</label>
          <input
            type="email"
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 
            focus:ring-2 focus:ring-blue-600 focus:outline-none 
            placeholder-gray-400 text-black"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition"
        >
          Enviar instrucciones
        </button>

        {/* Volver */}
        <p className="text-center text-gray-600 text-sm pt-4 border-t">
          <a href="./dashboard/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
            Volver al inicio de sesión
          </a>
        </p>

        

      </form>
    </div>
  );
}
