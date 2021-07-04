const Router = require("express").Router;
const categoriaControllers = require("../controllers/categoriaControllers");

const router = new Router();

router
   .route("/")
   .get(categoriaControllers.getCategoria)
   .post(categoriaControllers.createCategoria);

router
   .route("/:id")
   .patch(categoriaControllers.updateCategoria)
   .delete(categoriaControllers.deleteCategoria);

module.exports = router;
