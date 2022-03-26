const Router = require("express").Router;

const categoriaControllers = require("../controllers/categoriaControllers");
const authControllers = require("../controllers/authControllers");

const router = Router();

router
   .route("/:id")
   .get(authControllers.protect, categoriaControllers.getCategories)

router
   .route('/')
   .get(authControllers.protect, categoriaControllers.getCategories)
   .post(authControllers.protect, categoriaControllers.createCategoria);


// router
// .route("actualizar/:id")
// .patch(authControllers.protect, categoriaControllers.updateCategoria)
// .delete(authControllers.protect, categoriaControllers.deleteCategoria);

module.exports = router;
