"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, loginWithGoogle } from "../../lib/service/authService";
import { setAuthToken } from "../../lib/axios";
import { auth, googleProvider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false)
  const [messageAlert, setMessageAlert] = useState("");
  const [messageCorrect, setMessageCorrect] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
// Manejo de mensajes de error y éxito
  useEffect(() => {
    if (messageCorrect) {
      setTimeout(() => {
        setMessageCorrect("");
      }, 3000);
    }
  }, [messageCorrect]);

  useEffect(() => {
    if (messageAlert) {
      setTimeout(() => {
        setMessageAlert("");
      }, 3000);
    }
  }, [messageAlert]);
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u) {
        router.replace("/dashboard/inicio");
      }
    } catch {}
  }, [router]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);
    return () => {
      try { document.body.removeChild(script); } catch {}
    };
  }, []);
  

// Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessageAlert("Por favor, ingresa tu correo electrónico y contraseña");
      return;
    }
    try {
      const data = {
        email,
        password,
      };
      const response = await loginUser(data);
      if (response?.token) {
        setAuthToken(response.token);
        try {
          localStorage.setItem("user", JSON.stringify(response.user));
        } catch (e) {}
      }
      setMessageCorrect(response?.message || "Inicio de sesión exitoso");
      router.replace("/dashboard/inicio");
    } catch (error) {
      setMessageAlert(error?.message || "Error en el inicio de sesión. Por favor, verifica tus credenciales.");
    }
  };


  const handleGoogle = () => {
    try {
      const hasFirebase = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
      if (hasFirebase && auth && googleProvider) {
        signInWithPopup(auth, googleProvider)
          .then(async (result) => {
            const user = result.user;
            const idToken = await user.getIdToken();
            try {
              const res = await loginWithGoogle(idToken);
              if (res?.token) {
                setAuthToken(res.token);
                try { localStorage.setItem("user", JSON.stringify(res.user)); } catch {}
                setMessageCorrect(res?.message || "Inicio de sesión exitoso");
                router.replace("/dashboard/inicio");
              } else {
                setMessageAlert("No se pudo iniciar sesión con Google");
              }
            } catch (e) {
              setMessageAlert(e?.message || "Error al iniciar con Google");
            }
          })
          .catch(() => {
            setMessageAlert("No se pudo autenticar con Firebase");
          });
        return;
      }
      if (!googleReady || !window.google) {
        setMessageAlert("Google aún no está listo, intenta de nuevo");
        return;
      }
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setMessageAlert("Falta configurar NEXT_PUBLIC_GOOGLE_CLIENT_ID");
        return;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        context: "signin",
        use_fedcm_for_prompt: false,
        callback: async (response) => {
          const idToken = response?.credential;
          if (!idToken) {
            setMessageAlert("No se obtuvo el token de Google");
            return;
          }
          try {
            const res = await loginWithGoogle(idToken);
            if (res?.token) {
              setAuthToken(res.token);
              try { localStorage.setItem("user", JSON.stringify(res.user)); } catch {}
              setMessageCorrect(res?.message || "Inicio de sesión exitoso");
              router.replace("/dashboard/inicio");
            } else {
              setMessageAlert("No se pudo iniciar sesión con Google");
            }
          } catch (e) {
            setMessageAlert(e?.message || "Error al iniciar con Google");
          }
        },
      });
      window.google.accounts.id.prompt();
    } catch (e) {
      setMessageAlert("Error al inicializar Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form 
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {messageAlert && (
          <div className="bg-red-500 text-white p-2 rounded-md text-center">
            {messageAlert}
          </div>
        )}
        {messageCorrect && (
          <div className="bg-green-500 text-white p-2 rounded-md text-center">
            {messageCorrect}
          </div>
        )}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Iniciar sesión</h2>
          <p className="text-gray-600">Ingresa tus datos para continuar</p>
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

        <button type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition">
          Entrar
        </button>
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full h-11 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#FFC107" d="M43.6 20.5H42v-.1H24v7.2h11.3C33.7 31.6 29.2 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 6 .9 8.3 3l5.1-5.1C33.9 6 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.7 0 19.6-7.7 19.6-20 0-1.2-.1-2.3-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3C13.4 16.3 18.3 13 24 13c3.1 0 6 .9 8.3 3l5.1-5.1C33.9 6 29.2 4 24 4 15.5 4 8.4 8.5 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.1 0 9.8-1.9 13.3-5.1l-6.1-5c-2 1.4-4.7 2.3-7.2 2.3-5.2 0-9.6-3.3-11.2-7.9l-6 4.6C8.8 39.5 15.9 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42v-.1H24v7.2h11.3c-1.3 4-5.2 7.4-11.3 7.4-5.2 0-9.6-3.3-11.2-7.9l-6 4.6C8.8 39.5 15.9 44 24 44c10.7 0 19.6-7.7 19.6-20 0-1.2-.1-2.3-.4-3.5z" />
          </svg>
          <span className="text-gray-800 font-medium">Iniciar con Google</span>
        </button>

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => router.replace("/Pages/register")} className="text-sm text-gray-700 hover:text-gray-900">
            No tienes cuenta  registrate
          </button>
          <button type="button" onClick={() => router.replace("/Pages/forgotPage")} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  );
}
