const express = require("express");
const passport = require("passport");
const router = express.Router();

const  userRoleControllers = require("../controllers/user_role");
const middleware = require("../middleware/routeHelper");

// @Route: 'users/register'
// @Description: Creating a user
// @Access: Public

router.route("/").post(userRoleControllers.postUserRole);
router.route("/").get(userRoleControllers.getAllUserRole);
router.route("/:id").get(userRoleControllers.getSingleUserRole);
router.route("/update/:id").put(userRoleControllers.updateSingleUserRole);
router.route("/delete/:id").delete(userRoleControllers.deleteUserRole);
module.exports = router;
