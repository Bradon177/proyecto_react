"use client"
import React, { useState, useEffect } from 'react'
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { resetPasswordWithToken, resetPasswordWithEmail } from '../../lib/service/authService';

export default function page() {
    const router = useRouter();
    const params = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState(false)
    const [messageAlert, setMessageAlert] = useState("");
    const [messageCorrect, setMessageCorrect] = useState("");
    const [email, setEmail] = useState("");
    const [oobCodeState, setOobCodeState] = useState("");
    const [tokenState, setTokenState] = useState("");

  useEffect(() => {
    const href = typeof window !== "undefined" ? window.location.href : "";
    const url = href ? new URL(href) : null;
    const sp = new URLSearchParams(url?.search || "");
    const hp = new URLSearchParams((url?.hash || "").replace("#", ""));
    const oobCode = params.get("oobCode") || sp.get("oobCode") || hp.get("oobCode") || "";
    const token = params.get("token") || sp.get("token") || hp.get("token") || "";
    const mode = params.get("mode") || sp.get("mode") || hp.get("mode") || "";
    if (oobCode) setOobCodeState(oobCode);
    if (token) setTokenState(token);
    if (oobCode && auth) {
      verifyPasswordResetCode(auth, oobCode)
        .then((mail) => setEmail(mail))
        .catch(() => setMessageAlert("Código inválido o expirado"));
    }
    if (!oobCode && mode === "resetPassword") {
      setMessageAlert("No se detectó el código de restablecimiento en el enlace");
    }
  }, [params]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirm) {
            setMessageAlert("Ingresa y confirma tu nueva contraseña");
            return;
        }
        if (password !== confirm) {
            setMessageAlert("Las contraseñas no coinciden");
            return;
        }
        try {
            const oobCode = oobCodeState || params.get("oobCode");
            const token = tokenState || params.get("token");
            if (oobCode && auth) {
                await confirmPasswordReset(auth, oobCode, password);
                const mail = email || params.get("email") || "";
                if (mail) {
                    await resetPasswordWithEmail(mail, password);
                }
            } else if (token) {
                await resetPasswordWithToken(token, password);
            } else {
                setMessageAlert("Falta código o token de restablecimiento");
                return;
            }
            setMessageCorrect("Contraseña restablecida correctamente");
            setTimeout(() => router.replace("/Pages/login"), 1200);
        } catch (err) {
            setMessageAlert(err?.message || "No se pudo restablecer la contraseña");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">Restablecer contraseña</h2>
                    <p className="text-gray-600">Ingresa tu nueva contraseña</p>
                </div>
                {messageAlert && (
                    <div className="bg-red-500 text-white p-2 rounded-md text-center">{messageAlert}</div>
                )}
                {messageCorrect && (
                    <div className="bg-green-500 text-white p-2 rounded-md text-center">{messageCorrect}</div>
                )}
                {email && (
                    <div className="text-sm text-gray-700">Cuenta: {email}</div>
                )}

                <div className="space-y-2">
                    <label className="text-gray-700 font-medium">Nueva contraseña</label>
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

                <button type="submit"
                
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition">
                    Guardar contraseña
                </button>

                <div className="text-center text-gray-600 text-sm pt-4 border-t">
                    <button type="button"
                    onClick={()=>router.replace("/Pages/login")}
                    className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                        Volver al inicio de sesión
                    </button>
                </div>
            </form>
        </div>
    )
}
