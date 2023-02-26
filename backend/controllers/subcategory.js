const {
  QuestionModel,
  CategoryModel: Category,
  SubcategoryModel: Subcategory,
  DocumentModel,
  OptionModel,
  CategorySubCategoryModel,
} = require("../db");

module.exports = {
  CreateSubcategory: async (req, res) => {
    try {
      // console.log(req.body);
      let { name, categoryId, questions, documents } = req.body;

      const subCategory = await Subcategory.create({
        name,
        userId: req.user.id,
      });

      //Questions
      let idx = 0;
      for (let question of questions) {
        const createdQuestion = await QuestionModel.create({
          ...question,
          subcategoryId: subCategory.dataValues.id,
          position: idx + 1,
        });

        for (let option of question.options) {
          await OptionModel.create({
            value: option,
            questionId: createdQuestion.id,
          });
        }

        idx = idx + 1;
      }

      //Documents
      for (let document of documents) {
        await DocumentModel.create({
          ...document,
          subcategoryId: subCategory.dataValues.id,
        });
      }

      //Categories
      for (let id of categoryId) {
        console.log(id);
        const res = await CategorySubCategoryModel.create({
          subcategory_id: subCategory.dataValues.id,
          category_id: id,
        });
        console.log(res);
      }

      return res.status(201).json({
        subcategories: subCategory,
        success: true,
        message: "Subcategory has been created.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  updateSubcategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const subcategory = await Subcategory.update({ name }, { where: { id } });
      return res.json({
        subcategory,
        success: true,
        message: "Subcategory has been updated.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  DeleteSubcategory: async (req, res) => {
    try {
      let { subcategoryId } = req.body;
      // console.log(req.body, req.params, req.query);
      const data = await Subcategory.destroy({
        where: { id: subcategoryId },
      });
      // console.log(data);
      if (data === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Subcategory not found." });
      }
      return res
        .status(200)
        .json({ success: true, message: "Subcategory has been deleted." });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  DeleteDocument: async (req, res) => {
    try {
      let { id } = req.body;
      // console.log(req.body, req.params, req.query);
      const data = await DocumentModel.destroy({
        where: { id },
      });
      // console.log(data);
      if (data === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Document not found." });
      }
      return res
        .status(200)
        .json({ success: true, message: "Document has been deleted." });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  UpdateDocument: async (req, res) => {
    try {
      const { id, name } = req.body;
      console.log(req.body);
      await DocumentModel.update({ name }, { where: { id } });
      return res.status(200).json({
        success: true,
        message: "Document has been updated.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  addDocument: async (req, res) => {
    try {
      const document = await DocumentModel.create(req.body);
      return res.status(201).json({
        document,
        success: true,
        message: "Document has been added.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  GetSubcategory: async (req, res) => {
    try {
      // console.log(req.user);
      const subcategory = await Subcategory.findAll({
        where: {
          userId: req.user.id,
        },
        include: {
          model: QuestionModel,
          as: "questions",
          // order: [["position", "ASC"]],
        },
        include: {
          model: DocumentModel,
          as: "documents",
        },
        order: [["createdAt", "ASC"]],
      });
      return res.status(200).json({ subcategory, success: true });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  GetSubcategoryWithCategory: async (req, res) => {
    try {
      const category = await Category.findAll({
        where: {
          userId: req.user.id,
        },
        include: [
          {
            model: QuestionModel,
            as: "questions",
            include: { model: OptionModel, as: "options" },
          },
          {
            model: Subcategory,
            as: "subcategories",
            include: [
              {
                model: QuestionModel,
                as: "questions",
                include: { model: OptionModel, as: "options" },
              },
              {
                model: DocumentModel,
                as: "documents",
                separate: true,
                order: [["created_at", "ASC"]],
              },
            ],
          },
        ],
        order: [
          ["createdAt", "ASC"],
          [{ model: Subcategory, as: "subcategories" }, "createdAt", "ASC"],
          [{ model: QuestionModel, as: "questions" }, "position", "ASC"],
          [
            { model: QuestionModel },
            { model: OptionModel, as: "options" },
            "id",
            "ASC",
          ],
          [
            { model: Subcategory, as: "subcategories" },
            { model: QuestionModel, as: "questions" },
            { model: OptionModel, as: "options" },
            "createdAt",
            "ASC",
          ],
          [
            { model: Subcategory, as: "subcategories" },
            { model: QuestionModel, as: "questions" },
            "position",
            "ASC",
          ],
        ],
      });
      return res.status(200).json({ category, success: true });
    } catch (error) {
      console.log(error.message);
      res.status(400).json(error?.message || error);
    }
  },

  updateRelationCategorySubCategory: async (req, res) => {
    try {
      const { subcategory_id, category_ids } = req.body;

      await CategorySubCategoryModel.destroy({
        where: { subcategory_id },
      });

      for (let id of category_ids) {
        await CategorySubCategoryModel.create({
          subcategory_id: subcategory_id,
          category_id: id,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Updated",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },

  addQuestopn: async (req, res) => {
    const { subcategoryId, ques, options, type } = req.body;

    try {
      const position = await QuestionModel.count({
        where: { subcategoryId: subcategoryId },
      });
      const question = await QuestionModel.create({
        ques,
        type,
        subcategoryId: subcategoryId,
        position: position + 1,
      });

      for (let option of options) {
        await OptionModel.create({
          value: option,
          questionId: question.id,
        });
      }

      return res.status(201).json({
        question,
        success: true,
        message: "Question has been added.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },

  updateQuestionSubCategory: async (req, res) => {
    const { questionId, ques, options, type } = req.body;

    try {
      const question = await QuestionModel.update(
        {
          ques,
          type,
        },
        {
          where: {
            id: questionId,
          },
        }
      );

      await OptionModel.destroy({
        where: { question_id: questionId },
      });

      for (let option of options) {
        await OptionModel.create({
          value: option,
          questionId: questionId,
        });
      }

      return res.status(201).json({
        question,
        success: true,
        message: "Question has been added.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },

  deleteQuestionSubCategory: async (req, res) => {
    const { id } = req.params;

    try {
      await QuestionModel.destroy({
        where: {
          id,
        },
      });
      a;
      return res.status(201).json({
        success: true,
        message: "Question has been added.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  // updateQuestopnOnSubcateg: async (req, res) => {
  //   try {
  //     const { id, ques } = req.body;
  //     const question = await QuestionModel.update({ ques }, { where: { id } });
  //     return res.json({
  //       question,
  //       success: true,
  //       message: "Question has been updated.",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json(error?.message || error);
  //   }
  // },
  // deleteQuestopn: async (req, res) => {
  //   try {
  //     const question = await QuestionModel.destroy({
  //       where: { id: req.body.id },
  //     });
  //     return res.json({
  //       question,
  //       success: true,
  //       message: "Question has been deleted.",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json(error?.message || error);
  //   }
  // },
  // GetQustionsSuggetion: async (req, res) => {
  //   try {
  //     // console.log(req.body, req.params, req.query);
  //     const questions = await QuestionModel.findAll({
  //       where: {
  //         ques: sequelize.where(
  //           sequelize.fn("LOWER", sequelize.col("ques")),
  //           "LIKE",
  //           "%" + req.query.name + "%"
  //         ),
  //       },
  //     });
  //     return res.status(200).json({ questions, success: true });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json(error?.message || error);
  //   }
  // },
};
