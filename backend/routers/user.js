const express = require("express");
const passport = require("passport");
const router = express.Router();

const userControllers = require("../controllers/user");
const middleware = require("../middleware/routeHelper");

// @Route: 'users/register'
// @Description: Creating a user
// @Access: Public
router.route("/register").post(userControllers.register);

// @Route: 'users/login'
// @Description: login a user
// @Access: Public
router.route("/login").post(userControllers.logIn);

// @Route: 'users/isUserId-abailable'
// @Description: check the ablailability of username
// @Access: Public
router.route("/isUserId-abailable").post(userControllers.isUserIdAvailable);

// @Route: 'users/recover-password-req'
// @Description: recover password request
// @Access: Public
router.route("/recover-password-req").post(userControllers.recoverPasswordReq);

// @Route: 'users/signin'
// @Description: login a user
// @Access: Public
router.route("/password-reset/:id").put(userControllers.resetPassword);

// @Route: 'user/me'
// @Description: modification of profile
// @Access: need to authenticate
router
  .route("/me/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    userControllers.getUser
  );

router
  .route("/my-details")
  .get(
    passport.authenticate("jwt", { session: false }),
    userControllers.getMyUserDetails
  );

router
  .route("/update-user")
  .patch(
    passport.authenticate("jwt", { session: false }),
    userControllers.updateMyDetails
  );

router
  .route("/update-password")
  .patch(
    passport.authenticate("jwt", { session: false }),
    userControllers.updateMyPassword
  );

router
  .route("/upload")
  .post(middleware.uploadImage.single("singleFile"), userControllers.ServeFile);

module.exports = router;
