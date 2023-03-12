const express = require("express");
const passport = require("passport");
const router = express.Router();

const  roleControllers = require("../controllers/role");
const middleware = require("../middleware/routeHelper");

// @Route: 'users/register'
// @Description: Creating a user
// @Access: Public

router.route("/").get(roleControllers.getRole);
router.route("/").post(roleControllers.postRole);
router.route("/update/:id").put(roleControllers.updateRole);
router.route("/:id").get(roleControllers.getSingleRole);
router.route("/delete/:id").delete(roleControllers.deleteRole);

module.exports = router;
