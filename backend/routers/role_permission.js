const express = require("express");
const passport = require("passport");
const router = express.Router();

const  rolePermissionControllers = require("../controllers/role_permission");
const middleware = require("../middleware/routeHelper");

// @Route: 'users/register'
// @Description: Creating a user
// @Access: Public


router.route("/").post(rolePermissionControllers.postRolePermission);
router.route("/").get(rolePermissionControllers.getRolePermission);
router.route("/:id").get(rolePermissionControllers.getSingleRolePermission);
router.route("/update/:id").put(rolePermissionControllers.updateSingleRolePermission);
router.route("/delete/:id").delete(rolePermissionControllers.deleteRolePermission);
module.exports = router;
