const {
    listarEncargos,
    crearEncargo,
    completarEncargo,
    eliminarEncargo
} = require("../services/encargos.service");

// req.usuario lo pone el middleware auth a partir del token
async function listar(req, res) {
    try {
        const encargos = await listarEncargos(req.usuario.id);
        res.json({ encargos: encargos });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    }
}

async function crear(req, res) {
    const { titulo, recompensa } = req.body;

    if (typeof titulo !== "string" || titulo.trim().length < 3) {
        return res.status(400).json({ error: "El titulo debe tener al menos 3 caracteres" });
    }

    if (!Number.isFinite(recompensa) || !Number.isInteger(recompensa) || recompensa < 0) {
        return res.status(400).json({ error: "La recompensa debe ser un numero entero mayor o igual a 0" });
    }


    try {
        const nuevo = await crearEncargo(titulo, recompensa, req.usuario.id);
        res.status(201).json({ encargo: nuevo });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    }
}

async function completar(req, res) {
    try {
        const actualizado = await completarEncargo(req.params.id, req.usuario.id);

        if (!actualizado) {
            return res.status(404).json({ error: "Encargo no encontrado" });
        }

        res.json({ encargo: actualizado });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    }
}

async function eliminar(req, res) {
    try {
        const borrado = await eliminarEncargo(req.params.id, req.usuario.id);

        if (!borrado) {
            return res.status(404).json({ error: "Encargo no encontrado" });
        }

        res.json({ mensaje: "Encargo eliminado", id: borrado.id });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    }
}

module.exports = { listar, crear, completar, eliminar };
