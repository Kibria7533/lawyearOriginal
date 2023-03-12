const express = require("express");
const passport = require("passport");
const router = express.Router();

const  userPermissionControllers = require("../controllers/user_permission");
const middleware = require("../middleware/routeHelper");

// @Route: 'users/register'
// @Description: Creating a user
// @Access: Public

router.route("/").post(userPermissionControllers.postUserPermission);
router.route("/").get(userPermissionControllers.getAllUserPermission);
router.route("/:id").get(userPermissionControllers.getSingleUserPermission);
router.route("/update/:id").put(userPermissionControllers.updateSingleUserPermission);
router.route("/delete/:id").delete(userPermissionControllers.deleteUserPermission);

module.exports = router;
