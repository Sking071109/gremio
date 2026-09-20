// Middleware que protege rutas: sin un token valido, no se pasa.
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const cabecera = req.headers.authorization;

    if (!cabecera) {
        return res.status(401).json({ error: "Falta el token" });
    }

    // La cabecera llega como "Bearer <token>": nos quedamos con la segunda palabra
    const token = cabecera.split(" ")[1];

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ error: "Token invalido o vencido" });
    }
}

module.exports = { auth };
