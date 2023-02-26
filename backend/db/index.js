const pg = require("pg");
const cron = require("node-cron");
const moment = require("moment");
pg.defaults.ssl = { rejectUnauthorized: false };
const { Sequelize, DataTypes } = require("sequelize");
const { connectionString } = require("../config");

const User = require("../model/User");
const Category = require("../model/Category");
const Subcategory = require("../model/Subcategory");
const Question = require("../model/Question");
const Document = require("../model/Document");
const Draft = require("../model/Draft");
// models for request
const Request = require("../model/Request");
const Alert = require("../model/Alert");
const RequestDocument = require("../model/RequestDocument");
const RequestQuestion = require("../model/RequestQuestion");
const RequestQuestionAnswer = require("../model/RequestQuestionAnswer");
const RequestDocumentAnswer = require("../model/RequestDocumentAnswer");
const FileCompletionAlertTemplate = require("../emailTemplates/FileCompletionAlertTemplate");
const mailSender = require("../utitls/sendGrid");
const Comment = require("../model/Comments");
const Option = require("../model/Option");
const CategorySubCategory = require("../model/categorySubCategories");
console.log(connectionString, "connectionString");

const db = new Sequelize(connectionString, {
  ssl: { rejectUnauthorized: false },
});

const UserModel = User(db, DataTypes);
const CategoryModel = Category(db, DataTypes);
const SubcategoryModel = Subcategory(db, DataTypes);
const QuestionModel = Question(db, DataTypes);
const DocumentModel = Document(db, DataTypes);
const RequestModel = Request(db, DataTypes);
const AlertModel = Alert(db, DataTypes);
const DraftModel = Draft(db, DataTypes);
const RequestDocumentModel = RequestDocument(db, DataTypes);
const RequestQuestionModel = RequestQuestion(db, DataTypes);
const RequestQuestionAnswerModel = RequestQuestionAnswer(db, DataTypes);
const RequestDocumentAnswerModel = RequestDocumentAnswer(db, DataTypes);
const CommentModel = Comment(db, DataTypes);
const OptionModel = Option(db, DataTypes);

const CategorySubCategoryModel = CategorySubCategory(db, DataTypes);

CategorySubCategoryModel.removeAttribute("id");
// user -> draft
UserModel.hasMany(DraftModel);
DraftModel.belongsTo(UserModel);
// user -> Requests
UserModel.belongsToMany(RequestModel, {
  as: "request",
  foreignKey: "userId",
  through: "user_request",
});
RequestModel.belongsToMany(UserModel, {
  as: "user",
  foreignKey: "requestId",
  through: "user_request",
});
// Request -> request questions + Request documents
RequestModel.hasMany(AlertModel);
AlertModel.belongsTo(RequestModel);
RequestModel.hasMany(RequestDocumentModel);
RequestDocumentModel.belongsTo(RequestModel);
RequestModel.hasMany(RequestQuestionModel);
RequestQuestionModel.belongsTo(RequestModel);
// request question -> requst question answer
SubcategoryModel.hasMany(RequestQuestionModel);
RequestQuestionModel.belongsTo(SubcategoryModel);
RequestQuestionModel.hasMany(CommentModel);
CommentModel.belongsTo(RequestQuestionModel);
RequestQuestionModel.hasMany(RequestQuestionAnswerModel);
RequestQuestionAnswerModel.belongsTo(RequestQuestionModel);
// request document -> requst document answer
SubcategoryModel.hasMany(RequestDocumentModel);
RequestDocumentModel.belongsTo(SubcategoryModel);
RequestDocumentModel.hasMany(CommentModel);
CommentModel.belongsTo(RequestDocumentModel);
RequestDocumentModel.hasMany(RequestDocumentAnswerModel);
RequestDocumentAnswerModel.belongsTo(RequestDocumentModel);
// user -> categories + subcategies
UserModel.hasMany(CategoryModel);
UserModel.hasMany(SubcategoryModel);
CategoryModel.belongsTo(UserModel);
SubcategoryModel.belongsTo(UserModel);
// category -> questions + subcategries
SubcategoryModel.belongsToMany(CategoryModel, {
  as: "categories",
  through: "category_sub_categories",
});
CategoryModel.belongsToMany(SubcategoryModel, {
  as: "subcategories",
  through: "category_sub_categories",
});
CategoryModel.hasMany(QuestionModel);

QuestionModel.belongsTo(CategoryModel);
// subcategory -> questions + documents
SubcategoryModel.hasMany(QuestionModel);
SubcategoryModel.hasMany(DocumentModel);
DocumentModel.belongsTo(SubcategoryModel);
QuestionModel.belongsTo(SubcategoryModel);
//Options
QuestionModel.hasMany(OptionModel);

db.authenticate()
  .then(() => console.log("Database connected."))
  .catch((err) => console.log("ON DATABASE CONNECTION", err));

db.sync(/* { alter: true } */)
  .then(() => console.log("all tables are check successfully."))
  .catch((err) => console.log("ON TABLE SYNC", err));

module.exports = {
  db,
  UserModel,
  CategoryModel,
  SubcategoryModel,
  QuestionModel,
  OptionModel,
  DocumentModel,
  RequestModel,
  DraftModel,
  RequestDocumentModel,
  RequestQuestionModel,
  RequestQuestionAnswerModel,
  RequestDocumentAnswerModel,
  AlertModel,
  CommentModel,
  CategorySubCategoryModel,
};

cron.schedule("5 0 * * *", async () => {
  try {
    const requests = await RequestModel.findAll({
      where: { status: "accepted" },
      include: [
        {
          model: RequestQuestionModel,
          include: {
            model: RequestQuestionAnswerModel,
            separate: true,
            order: [["createdAt", "DESC"]],
          },
        },
      ],
    });
    // console.log(requests.length);
    requests.map((request) => {
      const {
        createdAt,
        threeRemainder,
        tenRemainder,
        weeklyRemainder,
        remainderDate,
        request_questions,
        id,
      } = request.dataValues;

      const data = request_questions?.find(
        (item) => item.dataValues.ques === "Email"
      );

      let comDays = moment(new Date()).diff(moment(createdAt), "days");

      // fix date
      if (remainderDate) {
        let diff = moment(new Date()).diff(moment(remainderDate), "days");
        if (diff === 0) {
          sendMain(data, id);
        }
      }
      // three
      if (threeRemainder) {
        const modResult = comDays % 3;
        if (modResult === 0) {
          sendMain(data, id);
        }
      }
      // ten
      if (tenRemainder) {
        const modResult = comDays % 10;
        if (modResult === 0) {
          sendMain(data, id);
        }
      }
      // week
      if (weeklyRemainder) {
        const day = new Date().getDay();
        if (day === 7) {
          sendMain(data, id);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

const sendMain = async (data, requestId) => {
  // console.log(data?.request_question_answer?.dataValues?.ans);
  const mailData = {
    from: "noreply@dossierdirect.com",
    to: data?.request_question_answers[0]?.dataValues?.ans,
    subject: "Reminder from your lawyer",
    html: FileCompletionAlertTemplate({
      queryString: `?requestId=${requestId}`,
    }),
  };
  mailSender(mailData);
};
