import api from "../axios";

export async function getUsers() {
    try {
        const res = await api.get("/admin/users");
        return res?.users || [];
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function deleteUser(id) {
    try {
        const res = await api.delete(`/admin/users?id=${id}`);
        return res;
    } catch (err) {
        console.log("error al eliminar usuario:", err);
        console.error(err);
        throw err;
    }
}

export async function updateUser(id, data) {
    try {
        const res = await api.patch(`/admin/users?id=${id}`, data);
        return res;
    } catch (err) {
        console.log("error al actualizar usuario:", err);
        console.error(err);
        throw err;
    }
}
