// Todo lo que habla con la tabla "cazadores"
const { pool } = require("../db/conexion");

async function buscarPorEmail(email) {
    const consulta = "SELECT id, nombre, email, password_hash FROM cazadores WHERE email = $1";
    const resultado = await pool.query(consulta, [email]);
    return resultado.rows[0] || null;
}

async function crearCazador(nombre, email, passwordHash) {
    const consulta = `
        INSERT INTO cazadores (nombre, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, nombre, email
    `;
    const resultado = await pool.query(consulta, [nombre, email, passwordHash]);
    return resultado.rows[0];
}

module.exports = { buscarPorEmail, crearCazador };
