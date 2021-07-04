const Router = require("express").Router;

const cuentasControllers = require("../controllers/cuentaControllers");

const router = Router();

router
   .route("/")
   .get(cuentasControllers.getCuentas)
   .post(cuentasControllers.createCuenta);

router
   .route("/:id")
   .delete(cuentasControllers.deleteCuenta)
   .patch(cuentasControllers.updateCuenta);

module.exports = router;
