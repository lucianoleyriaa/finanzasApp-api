const express = require("express");
const cuentaRoutes = require("./routes/cuentaRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const movimientoRoutes = require("./routes/movimientoRoutes");

const app = express();

app.use(express.json());

app.use("/finanzas/api/cuentas", cuentaRoutes);
app.use("/finanzas/api/categorias", categoriaRoutes);

app.listen(3000, () => {
   console.log("Servidor corriendo en puerto 3000!");
});
