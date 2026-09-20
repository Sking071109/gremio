// Todo lo que habla con la tabla "encargos"
const { pool } = require("../db/conexion");

async function listarEncargos(usuarioId) {
    const consulta = `
        SELECT id, titulo, recompensa, completado
        FROM encargos
        WHERE user_id = $1
        ORDER BY id DESC
    `;
    const resultado = await pool.query(consulta, [usuarioId]);
    return resultado.rows;
}

async function crearEncargo(titulo, recompensa, usuarioId) {
    const consulta = `
        INSERT INTO encargos (titulo, recompensa, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, titulo, recompensa, completado
    `;
    const resultado = await pool.query(consulta, [titulo, recompensa, usuarioId]);
    return resultado.rows[0];
}

async function completarEncargo(id, usuarioId) {
    const consulta = `
        UPDATE encargos
        SET completado = true
        WHERE id = $1 AND user_id = $2
        RETURNING id, titulo, recompensa, completado
    `;
    const resultado = await pool.query(consulta, [id, usuarioId]);
    return resultado.rows[0] || null;
}

async function eliminarEncargo(id, usuarioId) {
    const consulta = "DELETE FROM encargos WHERE id = $1 AND user_id = $2 RETURNING id";
    const resultado = await pool.query(consulta, [id, usuarioId]);
    return resultado.rows[0] || null;
}

module.exports = {
    listarEncargos,
    crearEncargo,
    completarEncargo,
    eliminarEncargo
};
