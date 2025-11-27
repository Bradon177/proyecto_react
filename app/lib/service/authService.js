import api from "../axios";
import { setAuthToken } from "../axios";

export async function registerUser(data) {
    try {
        const response = await api.post("/auth/register", data);
        console.log("Registro exitoso:", response);
        return response;
    } catch (error) {
        const message = error?.message || error?.data?.error || "Error en el registro";
        const wrapped = new Error(message);
        if (error?.status) wrapped.status = error.status;
        wrapped.data = error?.data;
        throw wrapped;
    }
}


export async function loginUser(data) {
    try {
        const response = await api.post("/auth/login", data);
        console.log("Inicio de sesión exitoso:", response);
        return response;
    } catch (error) {
        const message = error?.message || error?.data?.error || "Error en el inicio de sesión";
        const wrapped = new Error(message);
        if (error?.status) wrapped.status = error.status;
        wrapped.data = error?.data;
        throw wrapped;
    }
}

export async function logoutUser() {
    try {
        const response = await api.post("/auth/logout");
        setAuthToken(null);
        return response;
    } catch (error) {
        const message = error?.message || error?.data?.error || "Error al cerrar sesión";
        const wrapped = new Error(message);
        if (error?.status) wrapped.status = error.status;
        wrapped.data = error?.data;
        throw wrapped;
    }
}

export async function loginWithGoogle(idToken) {
    try {
        const response = await api.post("/auth/google", { id_token: idToken });
        return response;
    } catch (error) {
        const message = error?.message || error?.data?.error || "Error al iniciar con Google";
        const wrapped = new Error(message);
        if (error?.status) wrapped.status = error.status;
        wrapped.data = error?.data;
        throw wrapped;
    }
}

export async function requestPasswordReset(email, origin) {
    try {
        const response = await api.post("/auth/forgot", { email, origin });
        return response;
    } catch (error) {
        const message = error?.message || error?.data?.error || "No se pudo generar el enlace";
        const wrapped = new Error(message);
        if (error?.status) wrapped.status = error.status;
        wrapped.data = error?.data;
        throw wrapped;
    }
}

export async function resetPasswordWithToken(token, password) {
    try {
        const response = await api.post("/auth/reset-password", { token, password });
        return response;
    } catch (error) {
        const message = error?.message || error?.data?.error || "No se pudo restablecer la contraseña";
        const wrapped = new Error(message);
        if (error?.status) wrapped.status = error.status;
        wrapped.data = error?.data;
        throw wrapped;
    }
}

export async function resetPasswordWithEmail(email, password) {
    try {
        const response = await api.post("/auth/reset-password", { email, password });
        return response;
    } catch (error) {
        const message = error?.message || error?.data?.error || "No se pudo restablecer la contraseña";
        const wrapped = new Error(message);
        if (error?.status) wrapped.status = error.status;
        wrapped.data = error?.data;
        throw wrapped;
    }
}
