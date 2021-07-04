const Router = require("express").Router;

const cuentasControllers = require("../controllers/cuentaControllers");

const router = Router();

router
   .route("/")
   .get(cuentasControllers.getCuentas)
   .post(cuentasControllers.createCuenta);

router
   .route("/:id")
   .patch(cuentasControllers.updateCuenta)
   .delete(cuentasControllers.deleteCuenta);

module.exports = router;
