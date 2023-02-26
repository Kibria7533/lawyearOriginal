const express = require("express");
const passport = require("passport");
const subscriptionController = require("../controllers/subscription");
const router = express.Router();

router
    .route("/:id")
    .get(
        passport.authenticate("jwt", {session: false}),
        subscriptionController.GetSubscription
    );

router
    .route("/payment-method/create")
    .post(
        passport.authenticate("jwt", {session: false}),
        subscriptionController.createPaymentMethod
    );

router
    .route("/payment-method/list")
    .get(
        passport.authenticate("jwt", {session: false}),
        subscriptionController.getAllPaymentMethods
    );

router
    .route("/invoice/list")
    .get(
        passport.authenticate("jwt", {session: false}),
        subscriptionController.getAllInvoices
    );

router
    .route("/payment-method")
    .delete(
        passport.authenticate("jwt", {session: false}),
        subscriptionController.detachPaymentMethod
    );

router
    .route("/checkout-session")
    .post(
        passport.authenticate("jwt", {session: false}),
        subscriptionController.createCheckoutSession
    );

router
    .route("/web-hook/checkout-session-completed")
    .post(
        subscriptionController.checkoutSessionCompletedWebHook
    );

module.exports = router;
