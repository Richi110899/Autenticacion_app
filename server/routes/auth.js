const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");

// Rutas públicas
router.post("/register", authController.register); // Registro de usuario
router.post("/login", authController.login); // Inicio de sesión

// Rutas protegidas
router.get("/profile", auth, authController.getProfile); // Obtener perfil de usuario autenticado

module.exports = router;
