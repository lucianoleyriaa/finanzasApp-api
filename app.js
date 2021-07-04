const express = require("express");
const cuentasRoutes = require("./routes/cuentaRoutes");

const app = express();

app.use(express.json());

app.use("/finanzas/api/cuentas", cuentasRoutes);

app.listen(3000, () => {
   console.log("Servidor corriendo en puerto 3000!");
});
