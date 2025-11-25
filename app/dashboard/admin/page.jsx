"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      setRole(u?.rol || null);
    } catch {}
  }, []);

  if (role && role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Acceso restringido</h2>
          <p className="text-gray-600">No tienes permisos para ingresar</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.replace("/dashboard/inicio")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6">Panel de Administración</h1>
        <p className="text-gray-600">Bienvenido</p>
      </div>
    </section>
  );
}

