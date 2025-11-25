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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Acceso restringido</h2>
        <p className="text-gray-600">
          {role === "admin" ? "Tienes permisos de administrador" : "No tienes permisos para ingresar"}
        </p>
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

