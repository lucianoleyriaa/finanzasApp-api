const Router = require("express").Router;

const authControllers = require("../controllers/authControllers");

const router = Router();

router.route("/login").post(authControllers.login);
router.route("/signup").post(authControllers.signup);

module.exports = router;
