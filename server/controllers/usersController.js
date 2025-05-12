const User = require("../models/User");

// Obtener todos los usuarios (solo admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Excluir la contraseña en la respuesta
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// Cambiar rol de usuario (solo admin)
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Verificar que el rol sea válido
    if (!["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    // Verificar si el usuario que intenta cambiar el rol tiene permisos para hacerlo
    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Asegurar que un `admin` no pueda cambiar el rol de un `superadmin` si es necesario
    if (userToUpdate.role === "superadmin" && req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "No puedes cambiar el rol de un superadmin" });
    }

    // Si el usuario es un superadmin, solo puede ser actualizado por otro superadmin
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }, // Retorna el usuario actualizado
    ).select("-password");

    res.json({ message: "Rol actualizado correctamente", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// Eliminar usuario (solo admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevenir que un admin elimine su propia cuenta
    if (req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "No puedes eliminar tu propia cuenta" });
    }

    // Prevenir que un admin elimine un superadmin
    const userToDelete = await User.findById(id);
    if (
      userToDelete &&
      userToDelete.role === "superadmin" &&
      req.user.role !== "superadmin"
    ) {
      return res
        .status(403)
        .json({ message: "No puedes eliminar a un superadmin" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
