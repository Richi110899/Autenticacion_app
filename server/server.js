const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error de conexión MongoDB:", err));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
