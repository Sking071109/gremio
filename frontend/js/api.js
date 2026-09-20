// ============================================================
//  Capa que habla con el backend.
//  Ninguna funcion de este archivo toca el HTML.
// ============================================================

// Envoltura de fetch: agrega el token a cada peticion protegida
async function apiFetch(ruta, opciones) {
    if (!opciones) opciones = {};

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };

    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    const respuesta = await fetch(API_URL + ruta, {
        method: opciones.method || "GET",
        headers: headers,
        body: opciones.body
    });

    if (respuesta.status === 401 && token) {
        localStorage.removeItem("token");
        localStorage.removeItem("nombre");
        mostrarLogin();
        throw new Error("Sesion vencida");
    }


    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || "Algo salio mal");
    }

    return datos;
}

function apiLogin(email, password) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password })
    });
}

function apiListarEncargos() {
    return apiFetch("/encargos");
}

function apiCrearEncargo(titulo, recompensa) {
    return apiFetch("/encargos", {
        method: "POST",
        body: JSON.stringify({ titulo: titulo, recompensa: Number(recompensa) })
    });
}

function apiCompletarEncargo(id) {
    return apiFetch("/encargos/" + id + "/completar", { method: "PATCH" });
}

function apiEliminarEncargo(id) {
    return apiFetch("/encargos/" + id, { method: "DELETE" });
}
