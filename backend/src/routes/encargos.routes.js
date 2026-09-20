const express = require("express");
const { auth } = require("../middlewares/auth");
const {
    listar,
    crear,
    completar,
    eliminar
} = require("../controllers/encargos.controller");

const router = express.Router();

// Todas las rutas de encargos exigen token
router.get("/", auth, listar);
router.post("/", auth, crear);
router.patch("/:id/completar", auth, completar);
router.delete("/:id", auth, eliminar);

module.exports = router;
