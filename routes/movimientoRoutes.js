const Router = require("express").Router;
const movimientoControllers = require("../controllers/movimientoControllers");

const router = Router({ mergeParams: true });

router
   .route("/")
   .get(movimientoControllers.getMovimientos)
   .post(movimientoControllers.createMovimiento);

module.exports = router;
