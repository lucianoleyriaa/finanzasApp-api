const Router = require("express").Router;

const categoriaControllers = require("../controllers/categoriaControllers");
const authControllers = require("../controllers/authControllers");

const router = Router();

router
   .route("/")
   .get(authControllers.protect, categoriaControllers.getCategorias)
   .post(authControllers.protect, categoriaControllers.createCategoria);

router
   .route("/:id")
   .patch(authControllers.protect, categoriaControllers.updateCategoria)
   .delete(authControllers.protect, categoriaControllers.deleteCategoria);

module.exports = router;
