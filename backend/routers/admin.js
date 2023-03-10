const express = require("express");
const passport = require("passport");
const router = express.Router();

const  adminControllers = require("../controllers/admin");
const middleware = require("../middleware/routeHelper");

// @Route: 'users/register'
// @Description: Creating a user
// @Access: Public
router.route("/service-providers").get(adminControllers.getServiceProviders);
router.route("/service-providers/:id").get(adminControllers.getServiceProvidersSingleUser);
router.route("/service-providers/update/:id").put(adminControllers.updateServiceProvidersSingleUser);

router.route("/service-providers/delete/:id").delete(adminControllers.deleteServiceProviders)


module.exports = router;
