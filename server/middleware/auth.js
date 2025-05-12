const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para verificar token
exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Acceso denegado. Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user; // Guardamos al usuario autenticado en la request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido", error: error.message });
  }
};

// Middleware para verificar roles
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No autorizado para esta acción" });
    }

    next();
  };
};
