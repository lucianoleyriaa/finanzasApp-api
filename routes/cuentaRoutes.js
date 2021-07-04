const Router = require("express").Router;

const cuentasControllers = require("../controllers/cuentaControllers");
const movimientoRoutes = require("./movimientoRoutes");

const router = Router();

router.use("/:id_cuenta/movimientos", movimientoRoutes);

router
   .route("/")
   .get(cuentasControllers.getCuentas)
   .post(cuentasControllers.createCuenta);

router
   .route("/:id")
   .patch(cuentasControllers.updateCuenta)
   .delete(cuentasControllers.deleteCuenta);

module.exports = router;
