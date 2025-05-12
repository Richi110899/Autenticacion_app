const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { auth, checkRole } = require("../middleware/auth");

// Rutas protegidas solo para administradores
router.get("/", auth, checkRole(["admin"]), usersController.getAllUsers); // Obtener todos los usuarios
router.put(
  "/:id/role",
  auth,
  checkRole(["admin"]),
  usersController.changeUserRole,
); // Cambiar rol de usuario
router.delete("/:id", auth, checkRole(["admin"]), usersController.deleteUser); // Eliminar usuario

module.exports = router;
