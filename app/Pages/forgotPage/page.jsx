"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import api from "../../lib/axios";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [messageCorrect, setMessageCorrect] = useState("");

  const goLogin = () => router.push("/Pages/login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessageAlert("Ingresa tu correo electrónico");
      return;
    }
    try {
      if (auth) {
        const url = `${window.location.origin}/Pages/resetPage`;
        await sendPasswordResetEmail(auth, email, { url, handleCodeInApp: true });
        setMessageCorrect("Te enviamos un correo para restablecer la contraseña");
        return;
      }
      const origin = window.location.origin;
      const res = await api.post("/auth/forgot", { email, origin });
      if (res?.url) {
        window.location.replace(res.url);
      } else {
        setMessageCorrect("Generamos un enlace de restablecimiento");
      }
    } catch (err) {
      try {
        const origin = window.location.origin;
        const res = await api.post("/auth/forgot", { email, origin });
        if (res?.url) {
          window.location.replace(res.url);
          return;
        }
      } catch {}
      const code = err?.code || "";
      if (code === "auth/user-not-found") {
        setMessageAlert("Este correo no está registrado en Firebase");
      } else {
        setMessageAlert(err?.message || "No se pudo enviar el correo");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Recuperar contraseña</h2>
          <p className="text-gray-600">Ingresa tu correo y te enviaremos instrucciones</p>
        </div>
        {messageAlert && (
          <div className="bg-red-500 text-white p-2 rounded-md text-center">{messageAlert}</div>
        )}
        {messageCorrect && (
          <div className="bg-green-500 text-white p-2 rounded-md text-center">{messageCorrect}</div>
        )}

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

        <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition">
          Enviar instrucciones
        </button>

        <div className="text-center text-gray-600 text-sm pt-4 border-t">
          <button type="button" onClick={goLogin} className="text-blue-600 hover:text-blue-700 font-medium ml-1">
            Volver al inicio de sesión
          </button>
        </div>
      </form>
    </div>
  );
}
