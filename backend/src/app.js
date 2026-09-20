// ============================================================
//  Gremio de Cazadores - API
//  Punto de entrada del servidor
// ============================================================
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const encargosRoutes = require("./routes/encargos.routes");

const app = express();
const port = process.env.PORT || 3000;
const origenesPermitidos = ["http://localhost:5500", "http://127.0.0.1:5500"];

if (process.env.FRONTEND_URL) {
    origenesPermitidos.push(process.env.FRONTEND_URL);
}

// Solo los origenes de esta lista pueden llamar a la API desde un navegador
app.use(cors({
    origin: origenesPermitidos
}));

app.use(express.json());

// Ruta de salud: sirve para confirmar que el servidor esta vivo
app.get("/salud", function (req, res) {
    res.json({ ok: true, servicio: "gremio-api" });
});

app.use("/auth", authRoutes);
app.use("/encargos", encargosRoutes);

app.listen(port, function () {
    console.log("Gremio API escuchando en el puerto " + port);
});
