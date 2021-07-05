const Router = require("express").Router;
const categoriaControllers = require("../controllers/categoriaControllers");

const router = Router();

router
   .route("/")
   .get(categoriaControllers.getCategorias)
   .post(categoriaControllers.createCategoria);

router
   .route("/:id")
   .patch(categoriaControllers.updateCategoria)
   .delete(categoriaControllers.deleteCategoria);

module.exports = router;
