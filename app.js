const express = require("express");

const authRoutes = require("./routes/authRoutes");
const cuentaRoutes = require("./routes/cuentaRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");

const app = express();

app.use(express.json());

app.use("/finanzas/api/auth", authRoutes);
app.use("/finanzas/api/cuentas", cuentaRoutes);
app.use("/finanzas/api/categorias", categoriaRoutes);

app.listen(3000, () => {
   console.log("Servidor corriendo en puerto 3000!");
});
