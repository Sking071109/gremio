const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { buscarPorEmail, crearCazador } = require("../services/auth.service");

// ── REGISTRO ────────────────────────────────────────────────
// Esta funcion esta correcta. Usala como referencia cuando
// revises el login: compara linea por linea que hace cada una.
async function registrar(req, res) {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: "Faltan datos: nombre, email y password son obligatorios" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "La contrasena debe tener al menos 6 caracteres" });
    }

    try {
        const existente = await buscarPorEmail(email);
        if (existente) {
            return res.status(400).json({ error: "Ese email ya esta registrado" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const nuevo = await crearCazador(nombre, email, passwordHash);

        res.status(201).json({ cazador: nuevo });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    }
}

// ── LOGIN ───────────────────────────────────────────────────
async function iniciarSesion(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y password son obligatorios" });
    }

    try {
        const cazador = await buscarPorEmail(email);

        if (!cazador) {
            return res.status(401).json({ error: "Email o contrasena incorrectos" });
        }

        const coincide = await bcrypt.compare(password, cazador.password_hash);

        if (!coincide) {
            return res.status(401).json({ error: "Email o contrasena incorrectos" });
        }

        const token = jwt.sign(
            { id: cazador.id, nombre: cazador.nombre },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            token: token,
            cazador: { id: cazador.id, nombre: cazador.nombre, email: cazador.email }
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    }
}

module.exports = { registrar, iniciarSesion };
