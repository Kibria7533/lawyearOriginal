const express = require("express");
const passport = require("passport");
const categoryController = require("../controllers/category");
const router = express.Router();

// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/create")
  .post(
    passport.authenticate("jwt", { session: false }),
    categoryController.CreateCategory
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/update")
  .post(
    passport.authenticate("jwt", { session: false }),
    categoryController.updateCategory
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/add-question")
  .post(
    passport.authenticate("jwt", { session: false }),
    categoryController.addQuestopn
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/update-question")
  .post(
    passport.authenticate("jwt", { session: false }),
    categoryController.updateQuestopn
  );
// @Route: 'category/question-suggetions'
// @Description: getting question suggetion for user
// @Access: need to authenticate
router
  .route("/update-question-sequence")
  .put(
    passport.authenticate("jwt", { session: false }),
    categoryController.updateQuestionPosition
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/delete-question")
  .delete(
    passport.authenticate("jwt", { session: false }),
    categoryController.deleteQuestopn
  );
// @Route: 'category/delete'
// @Description: delete a category
// @Access: need to authenticate
router
  .route("/delete")
  .delete(
    passport.authenticate("jwt", { session: false }),
    categoryController.DeleteCategory
  );
// @Route: 'category/list'
// @Description: getting all category for user
// @Access: need to authenticate
router
  .route("/list")
  .get(
    passport.authenticate("jwt", { session: false }),
    categoryController.GetCategory
  );

// @Route: 'category/question-suggetions'
// @Description: getting question suggetion for user
// @Access: need to authenticate
router
  .route("/question-suggetions")
  .get(
    passport.authenticate("jwt", { session: false }),
    categoryController.GetQustionsSuggetion
  );

module.exports = router;
