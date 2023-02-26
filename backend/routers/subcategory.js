const express = require("express");
const passport = require("passport");
const subcategoryController = require("../controllers/subcategory");
const router = express.Router();

// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/create")
  .post(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.CreateSubcategory
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/update")
  .post(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.updateSubcategory
  );
// @Route: 'category/create-category'
// @Description: creating a category for user
// @Access: need to authenticate
router
  .route("/add-question")
  .post(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.addQuestopn
  );

router
  .route("/update-question")
  .patch(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.updateQuestionSubCategory
  );
router
  .route("/delete-question/:id")
  .delete(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.deleteQuestionSubCategory
  );

// @Route: 'category/delete'
// @Description: delete a category
// @Access: need to authenticate
router
  .route("/delete")
  .delete(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.DeleteSubcategory
  );
// @Route: 'category/delete'
// @Description: delete a category
// @Access: need to authenticate
router
  .route("/add-document")
  .post(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.addDocument
  );
// @Route: 'category/delete'
// @Description: delete a category
// @Access: need to authenticate
router
  .route("/update-document")
  .put(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.UpdateDocument
  );
// @Route: 'category/delete'
// @Description: delete a category
// @Access: need to authenticate
router
  .route("/delete-document")
  .delete(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.DeleteDocument
  );
// @Route: 'category/list'
// @Description: getting all category for user
// @Access: need to authenticate
router
  .route("/list")
  .get(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.GetSubcategory
  );
// @Route: 'category/list'
// @Description: getting all category for user
// @Access: need to authenticate
router
  .route("/list-with-category")
  .get(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.GetSubcategoryWithCategory
  );
router
  .route("/update-relation-category-subcategory")
  .post(
    passport.authenticate("jwt", { session: false }),
    subcategoryController.updateRelationCategorySubCategory
  );
module.exports = router;
