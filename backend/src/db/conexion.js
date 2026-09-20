// Conexion a Supabase (Postgres) usando el driver pg.
// Este archivo ya esta correcto, no hay que tocarlo.
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Supabase exige conexion cifrada
    ssl: { rejectUnauthorized: false }
});

module.exports = { pool };
