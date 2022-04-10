const Router = require("express").Router;

const cuentasControllers = require("../controllers/cuentaControllers");
const authControllers = require("../controllers/authControllers");
const movimientoRoutes = require("./movimientoRoutes");

const router = Router();

router.use("/:id_cuenta/movimientos", movimientoRoutes);
router.use("/:account_id/movements", movimientoRoutes)

router
    .route("/")
    .get(authControllers.protect, cuentasControllers.getCuentas)
    .post(authControllers.protect, cuentasControllers.createCuenta);

router
    .route("/:id")
    .patch(authControllers.protect, cuentasControllers.updateCuenta)
    .delete(authControllers.protect, cuentasControllers.deleteCuenta);

module.exports = router;
