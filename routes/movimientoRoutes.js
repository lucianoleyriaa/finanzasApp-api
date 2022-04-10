const Router = require("express").Router;

const movimientoControllers = require("../controllers/movimientoControllers");
const authControllers = require("../controllers/authControllers");

const router = Router({ mergeParams: true });

router
    .route("/")
    .get(authControllers.protect, movimientoControllers.getMovimientos)
    .post(authControllers.protect, movimientoControllers.createMovimiento);

// Refactorizar - Ver que rutas se usan y cuales no
router
    .route("/v2")
    .get(authControllers.protect, movimientoControllers.getMovements)

router
    .route("/:id")
    .patch(authControllers.protect, movimientoControllers.updateMovimiento)
    .delete(authControllers.protect, movimientoControllers.deleteMovimiento);

module.exports = router;
