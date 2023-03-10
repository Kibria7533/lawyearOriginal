const express = require("express");
const passport = require("passport");
const router = express.Router();

const  permissionControllers = require("../controllers/permission");
const middleware = require("../middleware/routeHelper");

// @Route: 'users/register'
// @Description: Creating a user
// @Access: Public

router.route("/").get(permissionControllers.getPermission);
router.route("/").post(permissionControllers.postPermission);
router.route("/:id").put(permissionControllers.updatePermission);
router.route("/:id").get(permissionControllers.getOnePermission);
router.route("/:id").delete(permissionControllers.deletePermission);

module.exports = router;
