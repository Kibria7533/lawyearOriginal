const express = require("express");
const passport = require("passport");
const requestController = require("../controllers/request");
const middleware = require("../middleware/routeHelper");
const router = express.Router();

// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/create")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.CreateRequest
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/update-reminder")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.UpdateRemainder
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/send-doc-reminder")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.QuestionOrDocumentReminder
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/accpet")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.AcceptRequest
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/add-question")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.addQuestopn
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/add-question-answer")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.AddQustionAnswer
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/add-document")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.addDocument
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/add-document-answer")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.AddDocumentAswer
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/update-status")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.UpdateStatus
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/update-questions")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.UpdateRequestQuestions
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/delete")
  .delete(
    passport.authenticate("jwt", { session: false }),
    requestController.DeleteRequest
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/add-draft")
  .post(
    passport.authenticate("jwt", { session: false }),
    requestController.AddDraftRequest
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/delete-draft")
  .delete(
    passport.authenticate("jwt", { session: false }),
    requestController.DeleteDraftRequest
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/draft-list")
  .get(
    passport.authenticate("jwt", { session: false }),
    requestController.GetDraftRequest
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/list")
  .get(
    passport.authenticate("jwt", { session: false }),
    requestController.GetRequests
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/alert-list")
  .get(
    passport.authenticate("jwt", { session: false }),
    requestController.GetAlerts
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/single/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    requestController.GetSingleRequests
  );

// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/upload")
  .post(
    middleware.uploadImage.single("singleFile"),
    requestController.ServeFile
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router.route("/add-comment").post(requestController.AddComment);
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router.route("/edit-comment").put(requestController.UpdateComment);
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router.route("/delete-comment").delete(requestController.DeleteComment);

module.exports = router;
