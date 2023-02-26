const { Sequelize, Op } = require("sequelize");
const { QuestionModel, OptionModel, CategoryModel } = require("../db");

module.exports = {
  CreateCategory: async (req, res) => {
    try {
      // console.log(req.user);
      let { name, questions } = req.body;
      const category = await CategoryModel.create({
        name,
        userId: req.user.id,
      });
      // const questionCount = await QuestionModel.findAndCountAll({
      //   where: { categoryId: { [Op.not]: null } },
      // });
      // const questionCount = await QuestionModel.count({
      //   where: { categoryId: { [Op.not]: null } },
      // });
      // console.log(questionCount.count, questionCount.rows);
      // console.log({ questionCount1 });
      console.log(questions);

      questions = questions.map((item, idx) => {
        item.categoryId = category.dataValues.id;
        item.position = idx + 1;
        return item;
      });

      /*  const question = await QuestionModel.bulkCreate(questions); */

      for (let question of questions) {
        const createdQuestion = await QuestionModel.create(question);

        for (let option of question.options) {
          await OptionModel.create({
            value: option,
            questionId: createdQuestion.id,
          });
        }
      }

      return res.status(201).json({
        category: { ...category.dataValues },
        success: true,
        message: "Category has been created.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await CategoryModel.update({ name }, { where: { id } });
      return res.json({
        category,
        success: true,
        message: "Category has been updated.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  updateQuestionPosition: async (req, res) => {
    try {
      const { ids } = req.body;
      for (let i = 1; i <= ids.length; i++) {
        await QuestionModel.update(
          { position: i },
          { where: { id: ids[i - 1] } }
        );
      }
      return res.json({
        success: true,
        message: "Question sequence has been updated.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  DeleteCategory: async (req, res) => {
    try {
      let { categoryId } = req.body;
      // console.log(req.body, req.params, req.query);
      const data = await CategoryModel.destroy({
        where: { id: categoryId },
      });
      // console.log(data);
      if (data === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Category not found." });
      }
      return res
        .status(200)
        .json({ success: true, message: "Category has been deleted." });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  GetCategory: async (req, res) => {
    try {
      // console.log(req.user);
      const category = await CategoryModel.findAll({
        where: {
          userId: req.user.id,
        },
        include: {
          model: QuestionModel,
          as: "questions",

          include: {
            model: OptionModel,
            as: "options",
          },

        },
        order: [
          ["createdAt", "ASC"],
          [{ model: QuestionModel }, "position", "ASC"],
          [
            { model: QuestionModel },
            { model: OptionModel, as: "options" },
            "id",
            "ASC",
          ],
        ],
      });
      return res.status(200).json({ category, success: true });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  addQuestopn: async (req, res) => {
    const { ques, type, options, categoryId } = req.body;

    try {
      const position = await QuestionModel.count({
        where: { categoryId: req.body.categoryId },
      });
      const question = await QuestionModel.create({
        ques,
        type,
        options,
        categoryId,
        position: position + 1,
      });
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
  updateQuestopn: async (req, res) => {
    try {
      const { id, ques, type, options } = req.body;
      const question = await QuestionModel.update(
        { ques, type },
        { where: { id } }
      );

      //Delete previous options
      await OptionModel.destroy({
        where: { questionId: id },
      });

      //Create new options
      for (let option of options) {
        await OptionModel.create({
          value: option,
          questionId: id,
        });
      }

      return res.json({
        question,
        success: true,
        message: "Question has been updated.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  deleteQuestopn: async (req, res) => {
    try {
      const question = await QuestionModel.destroy({
        where: { id: req.body.id },
      });
      return res.json({
        question,
        success: true,
        message: "Question has been deleted.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  GetQustionsSuggetion: async (req, res) => {
    try {
      console.log(req.body, req.params, req.query);
      const questions = await QuestionModel.findAll({
        where: {
          ques: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("ques")),
            "LIKE",
            "%" + req.body.name + "%"
          ),
        },
      });
      return res.status(200).json({ questions, success: true });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
};
