const express = require("express");
const { registrar, iniciarSesion } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/registro", registrar);
router.post("/login", iniciarSesion);

module.exports = router;
