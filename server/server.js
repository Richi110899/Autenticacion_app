const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Cargar variables de entorno
dotenv.config();

// Comprobar si MONGO_URI está definida
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI no está definida en el archivo .env");
  process.exit(1); // Detenemos la aplicación si no encontramos MONGO_URI
}

// Importar rutas
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 5000; // Asignar puerto por defecto si no está definido en el .env

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => {
    console.error("Error de conexión MongoDB:", err);
    process.exit(1); // Detener la aplicación si la conexión a la base de datos falla
  });

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, "../client/build")));

// Ruta fallback: cualquier ruta no encontrada por el backend va a React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
