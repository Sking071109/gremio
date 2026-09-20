// ============================================================
//  Capa que pinta la pantalla.
//  Este archivo esta completo, no hay que tocarlo.
// ============================================================

const pantallaLogin = document.getElementById("pantallaLogin");
const pantallaApp = document.getElementById("pantallaApp");
const listaEncargos = document.getElementById("listaEncargos");
const estadoLista = document.getElementById("estadoLista");
const nombreCazador = document.getElementById("nombreCazador");
const btnSalir = document.getElementById("btnSalir");

function mostrarLogin() {
    pantallaLogin.classList.remove("oculto");
    pantallaApp.classList.add("oculto");
    btnSalir.classList.add("oculto");
    nombreCazador.textContent = "";
}

function mostrarApp() {
    pantallaLogin.classList.add("oculto");
    pantallaApp.classList.remove("oculto");
    btnSalir.classList.remove("oculto");
    nombreCazador.textContent = localStorage.getItem("nombre") || "";
    cargarEncargos();
}

function renderizarEncargos(encargos) {
    listaEncargos.innerHTML = "";

    if (encargos.length === 0) {
        estadoLista.textContent = "Todavia no tienes encargos. Publica el primero.";
        return;
    }

    estadoLista.textContent = "";

    encargos.forEach(function (encargo) {
        const item = document.createElement("li");
        if (encargo.completado) item.classList.add("hecho");

        const titulo = document.createElement("span");
        titulo.className = "titulo";
        // textContent y no innerHTML: el titulo lo escribio un usuario
        titulo.textContent = encargo.titulo;

        const oro = document.createElement("span");
        oro.className = "oro";
        oro.textContent = encargo.recompensa + " oro";

        const btnHecho = document.createElement("button");
        btnHecho.className = "btn-texto";
        btnHecho.textContent = encargo.completado ? "hecho" : "completar";
        btnHecho.disabled = encargo.completado;
        btnHecho.addEventListener("click", function () {
            completar(encargo.id);
        });

        const btnBorrar = document.createElement("button");
        btnBorrar.className = "btn-texto";
        btnBorrar.textContent = "borrar";
        btnBorrar.addEventListener("click", function () {
            borrar(encargo.id);
        });

        item.appendChild(titulo);
        item.appendChild(oro);
        item.appendChild(btnHecho);
        item.appendChild(btnBorrar);
        listaEncargos.appendChild(item);
    });
}

async function cargarEncargos() {
    estadoLista.textContent = "Cargando...";
    try {
        const datos = await apiListarEncargos();
        renderizarEncargos(datos.encargos);
    } catch (error) {
        estadoLista.textContent = "No se pudieron cargar los encargos: " + error.message;
    }
}

async function completar(id) {
    try {
        await apiCompletarEncargo(id);
        cargarEncargos();
    } catch (error) {
        estadoLista.textContent = error.message;
    }
}

async function borrar(id) {
    try {
        await apiEliminarEncargo(id);
        cargarEncargos();
    } catch (error) {
        estadoLista.textContent = error.message;
    }
}

document.getElementById("btnEntrar").addEventListener("click", async function () {
    const errorLogin = document.getElementById("errorLogin");
    errorLogin.textContent = "";

    const email = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;

    try {
        const datos = await apiLogin(email, password);
        localStorage.setItem("token", datos.token);
        localStorage.setItem("nombre", datos.cazador.nombre);
        mostrarApp();
    } catch (error) {
        errorLogin.textContent = error.message;
    }
});

document.getElementById("btnPublicar").addEventListener("click", async function () {
    const errorEncargo = document.getElementById("errorEncargo");
    errorEncargo.textContent = "";

    const inputTitulo = document.getElementById("inputTitulo");
    const inputRecompensa = document.getElementById("inputRecompensa");

    try {
        await apiCrearEncargo(inputTitulo.value, inputRecompensa.value);
        inputTitulo.value = "";
        inputRecompensa.value = "";
        cargarEncargos();
    } catch (error) {
        errorEncargo.textContent = error.message;
    }
});

btnSalir.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    mostrarLogin();
});

// Al abrir la pagina: si ya hay token guardado, entra directo
if (localStorage.getItem("token")) {
    mostrarApp();
} else {
    mostrarLogin();
}
