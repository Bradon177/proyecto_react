"use client";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { useRouter } from "next/navigation";
import { logoutUser } from "../lib/service/authService";
import { setAuthToken } from "../lib/axios";


export default function Layout({ children }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // Manejo de autenticación
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
      setIsAdmin(user.rol === "admin");
    }
  }, []);
// Manejo de cierre de sesión
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
    } finally {
      try { localStorage.removeItem("user"); } catch {}
      setAuthToken(null);
      setUser(null);
      router.replace("/Pages/login");
    }
  };



  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* aqui le tengo que agregar mi logo */}
              <span className="text-xl">Nektra</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
              onClick={()=>router.replace("inicio")} 
              className="text-gray-600 hover:text-cyan-600 transition-colors">Inicio</a>
              <a  onClick={()=>router.replace("servicios")} className="text-gray-600 hover:text-cyan-600 transition-colors">Servicios</a>
              <a onClick={()=>router.replace("contacto")} className="text-gray-600 hover:text-cyan-600 transition-colors">Contacto</a>
              {isAdmin && (
                <a onClick={()=>router.replace("admin")} className="text-gray-600 hover:text-cyan-600 transition-colors">Admin</a>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <button
                  onClick={() => router.replace("/Pages/login")}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-4">
                <a onClick={()=>router.replace("inicio")} className="text-gray-600 hover:text-cyan-600 transition-colors">Inicio</a>
                <a onClick={()=>router.replace("servicios")} className="text-gray-600 hover:text-cyan-600 transition-colors">Servicios</a>
                <a onClick={()=>router.replace("contacto")} className="text-gray-600 hover:text-cyan-600 transition-colors">Contacto</a>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                    Cerrar Sesión
                  </button>
                ) : (
                  <button
                    onClick={()=>router.replace("/Pages/login")}
                    className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                    Iniciar Sesión
                  </button>
                )}

              
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>{children}
        <Footer/>
      </main>
    </>
  );
}
