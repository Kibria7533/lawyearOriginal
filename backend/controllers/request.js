const {
  RequestModel,
  UserModel,
  RequestDocumentModel,
  RequestQuestionModel,
  RequestQuestionAnswerModel,
  RequestDocumentAnswerModel,
  DraftModel,
  SubcategoryModel,
  AlertModel,
  db,
  CommentModel,
  QuestionModel,
  DocumentModel,
} = require("../db");
const mailSender = require("../utitls/sendGrid");
const passGenerator = require("generate-password");
const genUsername = require("unique-username-generator");
const invitationEmailTemplate = require("../emailTemplates/invitationEmail");
const { Op, Sequelize, where } = require("sequelize");
const QuestionOrDocumentAlertTemplate = require("../emailTemplates/QuestionOrDocumentAlert");
const bcrypt = require("bcryptjs");
const FileCompletionAlertTemplate = require("../emailTemplates/FileCompletionAlertTemplate");
// const chalk = require("chalk");

module.exports = {
  AddComment: async (req, res) => {
    try {
      const coment = await CommentModel.create(req.body);
      console.log(req.body, coment);
      return res.status(200).json({
        coment,
        success: true,
        message: "Coment has been created.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  UpdateComment: async (req, res) => {
    try {
      const { desc, id } = req.body;
      const data = await CommentModel.update({ desc }, { where: { id } });
      console.log(data, { desc, id });
      return res.status(200).json({
        success: true,
        message: "Coment has been updated.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  DeleteComment: async (req, res) => {
    try {
      const { id } = req.body;
      const data = await CommentModel.destroy({ where: { id } });
      console.log(data);
      return res.status(200).json({
        success: true,
        message: "Coment has been deleted.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  UpdateRemainder: async (req, res) => {
    try {
      const { remainder, id } = req.body;
      await RequestModel.update(remainder, { where: { id } });
      return res.status(200).json({
        success: true,
        message: "Reminder setup has been done.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  CreateRequest: async (req, res) => {
    // heveco7576298
    // frNX5rasau
    try {
      const {
        questions = [],
        documents = [],
        categoryAsnwer,
        email,
        first_name,
        last_name,
        categoryId,
      } = req.body;
      const currentUser = await UserModel.findOne({
        where: { id: req.user.id },
      });
      let requestForUser = await UserModel.findOne({
        where: { email, role: "client" },
      });
      let password, user_id;
      if (!requestForUser) {
        password = passGenerator.generate({
          length: 10,
          numbers: true,
        });
        // ENCYPTING PASSWORD
        const salt = bcrypt.genSaltSync(8);
        pass = await bcrypt.hash(password, salt);
        user_id = genUsername.generateFromEmail(email, 3);
        console.log(password, user_id);
        requestForUser = await UserModel.create({
          user_id,
          pass,
          email,
          first_name,
          last_name,
          role: "client",
        });
      }
      const request = await RequestModel.create({
        email,
        status: "accepted",
        categoryId,
      });
      const questionData = questions.map((item) => {
        item.requestId = request.dataValues.id;
        return item;
      });
      const documentData = documents.map((item) => {
        item.requestId = request.dataValues.id;
        return item;
      });

      // creating questions and docuemts
      const createdQuestion = await RequestQuestionModel.bulkCreate(
        questionData
      );
      await RequestDocumentModel.bulkCreate(documentData);
      // creating category answer
      const answer = [];
      createdQuestion.map((item) => {
        const dataValues = item?.dataValues;
        categoryAsnwer.map(({ name, ans }) => {
          if (dataValues.ques === name && ans) {
            answer.push({ requestQuestionId: dataValues.id, ans });
          }
        });
      });
      // console.log(answer);

      await RequestQuestionAnswerModel.bulkCreate(answer);
      // console.log(answer);
      currentUser.addRequest(request);
      requestForUser.addRequest(request);
      const mailData = {
        from: "noreply@dossierdirect.com",
        to: email,
        subject: "You have receive an invitation from Dossier Direct",
        html: invitationEmailTemplate({
          invitationId: request.id,
          user_id,
          password,
        }),
      };
      mailSender(mailData);

      return res.status(201).json({
        request,
        success: true,
        message: "Invitation has been sent to the client.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  AcceptRequest: async (req, res) => {
    try {
      const {
        request_id,
        questions,
        documents,
        docFillupCount,
        quesFillupCount,
        status,
      } = req.body;

      // const list = await UserModel.findOne({
      //   where: { id: req.user.id },
      //   include: {
      //     model: RequestModel,
      //     as: "request",
      const request = await RequestModel.findOne({
        where: { id: request_id },
        include: { model: UserModel, as: "user" },
      });
      // console.log(request.dataValues.user);
      // return;
      if (!request) {
        return res.status(404).json({ err: "Request not fournd!" });
      }
      // if (request.status !== "pending") {
      //   return res.status(404).json({ err: "Invitation already accepted!" });
      // }
      const updatAbleData = {
        quesFillupCount: quesFillupCount,
        docFillupCount: docFillupCount,
      };
      await RequestModel.update(updatAbleData, {
        where: { id: request_id },
      });

      await RequestQuestionAnswerModel.bulkCreate(questions);
      await RequestDocumentAnswerModel.bulkCreate(documents);
      // const currentUser = await UserModel.findOne({
      //   where: { id: req.user.id },
      // });
      // currentUser.addRequest(request);
      // console.log(req.user);
      return res.status(201).json({
        success: true,
        message: "Information submitted.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  addQuestopn: async (req, res) => {
    try {
      const { requestId, clientEmail } = req.body;
      const position = await RequestQuestionModel.count({
        where: { requestId },
      });
      const question = await RequestQuestionModel.create({
        ...req.body,
        position: position + 1,
      });
      const mailData = {
        from: "noreply@dossierdirect.com",
        to: clientEmail,
        subject: "Lawyer has added a new question",
        html: FileCompletionAlertTemplate({
          from: "question",
          queryString: `?requestId=${requestId}`,
        }),
      };
      mailSender(mailData);
      console.log(clientEmail);
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
  addDocument: async (req, res) => {
    try {
      const { requestId, clientEmail } = req.body;
      const position = await RequestDocumentModel.count({
        where: { requestId },
      });
      const document = await RequestDocumentModel.create({
        ...req.body,
        position: position + 1,
      });
      const mailData = {
        from: "noreply@dossierdirect.com",
        to: clientEmail,
        subject: "Lawyer has added a new document",
        html: FileCompletionAlertTemplate({
          queryString: `?requestId=${requestId}`,
          from: "document",
        }),
      };
      mailSender(mailData);
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
  QuestionOrDocumentReminder: async (req, res) => {
    const { requestId, questionId, documentId } = req.body;
    try {
      const request = await RequestModel.findOne({
        where: { id: requestId },
        include: [
          {
            model: RequestQuestionModel,
            include: {
              model: RequestQuestionAnswerModel,
              separate: true,
              order: [["createdAt", "DESC"]],
            },
          },
          { model: RequestDocumentModel, include: RequestDocumentAnswerModel },
          { model: UserModel, as: "user" },
        ],
      });
      // console.log(request.user.length);

      if (!request) {
        return res.status(400).json({ message: "Request not found" });
      }
      const user = request?.user;
      if (user?.length !== 2) {
        return res.status(400).json({
          message:
            "Reminder can't be sent as client has not accepted the invitation yet",
        });
      }
      const userId = user[0].id === req.user.id ? user[1].id : user[0].id;
      // console.log(userId, user[0].id, user[1].id, req.user.id);
      const { request_questions, request_documents } = request;

      let queryString = `?requestId=${requestId}`;
      // checking question asnwered or not
      if (questionId) {
        await RequestQuestionModel.update(
          {
            high_priority: true,
          },
          { where: { id: questionId } }
        );

        const data = request_questions.find(
          ({ id }) => String(id) === String(questionId)
        );
        if (!data || data.request_question_answer) {
          // return res
          //   .status(400)
          //   .json({ message: "Question not found or already answered." });
        }
        queryString += `&questionId=${questionId}`;
      }

      // checking documents asnwered or not
      else if (documentId) {
        await RequestDocumentModel.update(
          {
            high_priority: true,
          },
          { where: { id: documentId } }
        );
        const data = request_documents.find(
          ({ id }) => String(id) === String(documentId)
        );
        if (!data || data.request_document_answer) {
          return res
            .status(400)
            .json({ message: "Docuemnt not found or already given." });
        }
        queryString += `&documentId=${documentId}`;
      }

      const data = request?.dataValues?.request_questions?.find(
        (item) => item.dataValues.ques === "Email"
      );

      const data1 = await AlertModel.create({
        requestId,
        questionId,
        documentId,
        userId,
      });
      // console.log(data1);
      const mailData = {
        from: "noreply@dossierdirect.com",
        to: data?.request_question_answers[0]?.dataValues?.ans,
        subject: "Reminder from your lawyer",
        html: QuestionOrDocumentAlertTemplate({ queryString }),
      };

      const dat = await mailSender(mailData);
      return res.status(200).json({
        success: true,
        message: "Reminder has been sent to client.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error?.response?.body?.errors[0]?.message || error?.message,
      });
    }
  },
  AddQustionAnswer: async (req, res) => {
    try {
      const { request_id, ans, requestQuestionId, reAsign } = req.body;
      const request = await RequestModel.findOne({
        where: { id: request_id },
        include: [
          {
            model: RequestQuestionModel,
            include: RequestQuestionAnswerModel,
          },
          {
            model: RequestDocumentModel,
          },
        ],
      });
      if (!request) {
        return res.status(400).json({
          message: "Request not found.",
        });
      }
      // caculating question count
      const request_questions = request.request_questions;
      let totalQues = 0;
      let isCategoryQues = false;
      request_questions.map((item) => {
        console.log(item.id, item.type, requestQuestionId);
        if (item.type !== "category") {
          totalQues++;
        } else if (item.type === "category" && item.id === requestQuestionId) {
          isCategoryQues = true;
        }
      });

      const updateData = {};

      updateData.lastQuesSubmittedDate = new Date();

      if (!reAsign && !isCategoryQues) {
        updateData.quesFillupCount = request.dataValues?.quesFillupCount + 1;
      }
      if (updateData.quesFillupCount === totalQues) {
        updateData.statusQues = "completed";
      }

      if (
        request.dataValues?.docFillupCount ===
        request.dataValues?.request_documents?.length
      ) {
        updateData.statusDoc = "completed";
      }

      if (
        updateData.quesFillupCount === totalQues &&
        request.dataValues?.docFillupCount ===
          request.dataValues?.request_documents?.length
      ) {
        updateData.status = "completed";
        updateData.requestCompletedDate = new Date();
      }
      await RequestQuestionAnswerModel.create({
        ans: ans.trim(),
        requestQuestionId,
        // where: { ans: ans.trim(), requestQuestionId },
        // defaults: {
        //   ans: ans.trim(),
        //   requestQuestionId,
        // },
      });
      await RequestModel.update(updateData, {
        where: { id: request_id },
      });

      // console.log(request.dataValues);
      // console.log(updateData);
      await AlertModel.destroy({ where: { questionId: requestQuestionId } });
      console.log(updateData, isCategoryQues);
      return res.status(201).json({
        success: true,
        message: "Information has been submitted.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  AddDocumentAswer: async (req, res) => {
    try {
      const { request_id, link, requestDocumentId, reAsign } = req.body;
      const request = await RequestModel.findOne({
        where: { id: request_id },
        include: [
          {
            model: RequestQuestionModel,
          },
          {
            model: RequestDocumentModel,
          },
        ],
      });
      if (!request) {
        return res.status(400).json({
          message: "Request not found.",
        });
      }

      // caculating question count
      const request_questions = request.request_questions;
      let totalQues = 0;
      request_questions.map((item) => {
        if (item.type !== "category") {
          totalQues++;
        }
      });

      const updateData = {}; //quesFillupCount

      updateData.lastDocumentSubmittedDate = new Date();

      if (!reAsign) {
        updateData.docFillupCount = request.dataValues?.docFillupCount + 1;
      }

      if (request.dataValues?.quesFillupCount === totalQues) {
        updateData.statusQues = "completed";
      }

      if (
        updateData.docFillupCount ===
        request.dataValues?.request_documents?.length
      ) {
        updateData.statusDoc = "completed";
      }

      if (
        updateData.docFillupCount ===
          request.dataValues?.request_documents?.length &&
        request.dataValues?.quesFillupCount === totalQues
      ) {
        updateData.status = "completed";
        updateData.requestCompletedDate = new Date();
      }
      // console.log(request.dataValues?.quesFillupCount, totalQues);
      await RequestDocumentAnswerModel.create({
        link,
        requestDocumentId,
        // where: { link, requestDocumentId },
        // defaults: {
        //   link,
        //   requestDocumentId,
        // },
      });
      await RequestModel.update(updateData, {
        where: { id: request_id },
      });
      // console.log(updateData);
      await AlertModel.destroy({ where: { documentId: requestDocumentId } });
      return res.status(201).json({
        success: true,
        message: "Document has been submitted.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  UpdateRequestQuestions: async (req, res) => {
    try {
      const { questions } = req.body;
      questions.map(async ({ requestQuestionId, ans }) => {
        if (ans) {
          await RequestQuestionAnswerModel.findOrCreate({
            where: { ans: ans.trim(), requestQuestionId },
            defaults: {
              ans: ans.trim(),
              requestQuestionId,
            },
          });
        }
      });
      return res.status(200).json({
        success: true,
        message: "Questions has been updated",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  UpdateStatus: async (req, res) => {
    try {
      const {
        status = "completed",
        statusQues = "completed",
        statusDoc = "completed",
        updated_by = "",
        id,
      } = req.body;
      console.log(req.body);
      await RequestModel.update(
        {
          statusQues,
          statusDoc,
          status,
          updated_by,
          requestCompletedDate: new Date(),
        },
        { where: { id } }
      );
      return res.status(200).json({
        success: true,
        message: "Status has been updated.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  DeleteRequest: async (req, res) => {
    try {
      await RequestModel.destroy({ where: { id: req.body.id } });
      return res.status(200).json({
        success: true,
        message: "File has been deleted.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  AddDraftRequest: async (req, res) => {
    try {
      const { request_id: requestId, value } = req.body;
      // console.log(req.body)
      if (!value) {
        res.status(400).json({ message: "data isn't valid" });
      }
      const prevDraft = await DraftModel.findOne({
        // where: { requestId: requestId },
        where: {
          [Op.and]: [
            { requestId: { [Op.eq]: requestId } }, // [Op.eq] is added
            { requestId: { [Op.ne]: null } },
          ],
        },
      });

      if (prevDraft) {
        await DraftModel.update(
          { value: JSON.stringify(value) },
          { where: { requestId } }
        );
      } else {
        await DraftModel.create({
          value: JSON.stringify(value),
          requestId,
          userId: req.user.id,
        });
      }
      return res.status(200).json({
        // draft,
        success: true,
        message: "File has been saved as draft.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  DeleteDraftRequest: async (req, res) => {
    try {
      await DraftModel.destroy({ where: { id: req.body.id } });
      return res.status(200).json({
        success: true,
        message: "File has been deleted.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  GetDraftRequest: async (req, res) => {
    try {
      const list = await DraftModel.findAll({ where: { userId: req.user.id } });

      return res.status(200).json({
        list,
        success: true,
        message: "Files.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  GetRequests: async (req, res) => {
    // console.log(req.query);
    const { sortBy } = req.query;
    let sortFor = "created_at";
    if (sortBy === "missing_questions") {
      sortFor = "quesFillupCount";
    } else if (sortBy === "missing_documents") {
      sortFor = "docFillupCount";
    }

    try {
      // const data = RequestModel.find({where: ""})
      const list = await UserModel.findOne({
        where: { id: req.user.id },
        include: {
          model: RequestModel,
          as: "request",
          order: [["createdAt", "ASC"]],
          include: [
            {
              as: "request_questions",
              model: RequestQuestionModel,
              separate: true,
              order: [["createdAt", "ASC"]],
              include: {
                model: RequestQuestionAnswerModel,
                separate: true,
                order: [["createdAt", "DESC"]],
              },
            },
            {
              as: "request_documents",
              model: RequestDocumentModel,
              separate: true,
              order: [["createdAt", "ASC"]],
            },
          ],
        },
        order: [
          [Sequelize.literal(`"request->user_request"."created_at"`), "DESC"],
        ],
      });
      const compare = (a, b) => {
        if (sortBy === "lawer_completion" && a.dataValues.updated_by) {
          return -1;
        }
        if (
          a.dataValues[sortFor] < b.dataValues[sortFor] &&
          !a.dataValues.updated_by
        ) {
          return 1;
        }
        if (
          a.dataValues[sortFor] > b.dataValues[sortFor] &&
          !a.dataValues.updated_by
        ) {
          return -1;
        }
        return 0;
      };
      list.request.sort(compare);
      return res.status(200).json({
        list: list.request,
        success: true,
        message: "Clients.",
      });
    } catch (error) {
      // console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  GetSingleRequests: async function (req, res) {
    try {
      const { id } = req.params;
      const request = await RequestModel.findOne({
        where: { id },
        include: [
          { model: UserModel, as: "user" },
          {
            model: RequestQuestionModel,
            separate: true,
            order: [["position", "ASC"]],
            include: [
              {
                model: RequestQuestionAnswerModel,
                separate: true,
                order: [["createdAt", "DESC"]],
              },
              {
                model: CommentModel,
                separate: true,
                order: [["createdAt", "ASC"]],
              },
              { model: SubcategoryModel },
            ],
          },
          {
            model: RequestDocumentModel,
            separate: true,
            order: [["position", "ASC"]],
            include: [
              {
                model: RequestDocumentAnswerModel,
                separate: true,
                order: [["createdAt", "DESC"]],
              },
              {
                model: CommentModel,
                separate: true,
                order: [["createdAt", "ASC"]],
              },
              { model: SubcategoryModel },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.json({
        request,
        success: true,
        message: "single request",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err?.message || err);
    }
  },
  ServeFile: async (req, res) => {
    try {
      return res.status(200).json({
        fileName: req.file.key,
        success: true,
        message: "File has been marked as completed.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
  GetAlerts: async (req, res) => {
    try {
      const list = await AlertModel.findAll({
        where: { userId: req.user.id },
        include: {
          model: RequestModel,
          include: [
            {
              model: RequestQuestionModel,
              separate: true,
              order: [["createdAt", "ASC"]],
              include: {
                model: RequestQuestionAnswerModel,
                separate: true,
                order: [["createdAt", "DESC"]],
              },
            },
            {
              model: RequestDocumentModel,
              separate: true,
              order: [["position", "ASC"]],
              include: [
                {
                  model: RequestDocumentAnswerModel,
                  separate: true,
                  order: [["createdAt", "DESC"]],
                },
                { model: SubcategoryModel },
              ],
            },
          ],
        },
      });
      return res.status(200).json({
        list: list,
        success: true,
        message: "alerts.",
      });
    } catch (error) {
      // console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
};
