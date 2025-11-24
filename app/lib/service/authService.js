import api from "../axios";

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
