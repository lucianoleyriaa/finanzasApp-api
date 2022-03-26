const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const cuentaRoutes = require("./routes/cuentaRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");

const { getMovementType } = require('./controllers/movimientoControllers')

const app = express();

app.use(cors());

app.use(express.json());

app.use("/finanzas/api/auth", authRoutes);
app.use("/finanzas/api/cuentas", cuentaRoutes);
app.use("/finanzas/api/categorias", categoriaRoutes);
app.use('/finanzas/api/movementTypes', getMovementType);

app.listen(3000, () => {
   console.log("Servidor corriendo en puerto 3000!");
});
