const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const appConfig = require("../config");
const mailSender = require("../utitls/sendGrid");
const validator = require("../utitls/validator");
const ressetPasswordByUidTemplate = require("../emailTemplates/ressetPasswordByUid");
const ressetPasswordByEmailTemplate = require("../emailTemplates/ressetPasswordByEmail");
const { UserModel } = require("../db");
const stripeUtil = require("../utitls/stripeUtil");

module.exports = {
  register: async (req, res) => {
    try {
      let { user_id, email, pass, role = "lawyer" } = req.body;
      if ((!user_id || !email, !pass)) {
        return res.status(404).json({ err: "Some data have problem!" });
      }
      user_id = user_id.toLowerCase();
      const validatorMsg = validator({ email, pass });
      if (validatorMsg) {
        return res.status(404).json({ err: validatorMsg });
      }
      // ENCYPTING PASSWORD
      const salt = bcrypt.genSaltSync(8);
      pass = await bcrypt.hash(pass, salt);
      let where = { user_id, role };
      if (role === "client") {
        where = { email, role };
      }
      // Find user and create new one
      const response = await UserModel.findOrCreate({
        where,
        defaults: {
          user_id,
          email,
          pass,
          role,
        },
      });

      // Return true or false -> false means record exists. If exist return duplicate
      if (!response[1]) {
        let err = "User Id alredy exist.";
        if (role === "client") {
          err = "The email is alredy used as client.";
        }
        return res.status(404).json({ err });
      }
      const user = { ...response[0].dataValues };
      delete user.pass;

      // Create customer on Stripe
      // let customer = await stripeUtil.createCustomer(user_id, email);
      // // Create subscription on Stripe
      // //let subscription = await stripeUtil.createSubscription(customer, "individual_monthly",30)
      // let subscription = await stripeUtil.createSubscription(
      //   customer,
      //   "individual_daily",
      //   0
      // );
      // // Update User object
      // await UserModel.update(
      //   {
      //     stripe_customer_id: customer.id,
      //     stripe_subscription_id: subscription.id,
      //   },
      //   {
      //     where: {
      //       id: user.id,
      //     },
      //   }
      // );

      // RETURNING JSON
      res.status(201).json({ success: true, user });
    } catch (err) {
      console.log(err);
      res.status(400).json(err?.message || err);
    }
  },
  logIn: async (req, res) => {
    try {
      let { user_id, pass } = req.body;
      const user = await UserModel.findOne({
        where: { user_id: user_id.toLowerCase() },
      });
      // console.log(user, user_id);
      if (!user) {
        return res.status(404).json({ err: "User Does Not Exist." });
      }
      const isMatch = await bcrypt.compare(pass, user.pass);
      if (!isMatch) {
        return res.status(400).json({ err: "Password mismatch!" });
      }
      // CREATING JWT TOKEN
      const palyload = {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
      };
      const token = jwt.sign(palyload, appConfig.secretOrKey, {
        expiresIn: "7 days",
      });

      // RETURNING JSON
      const returnData = {
        ...user.dataValues,
        success: true,
        token: "Bearer " + token,
      };
      delete returnData.pass;
      res.json(returnData);
    } catch (e) {
      console.log(e);
      res.status(400).json(e?.message || e);
    }
  },
  isUserIdAvailable: async (req, res) => {
    try {
      const { user_id } = req.body;
      const user = await UserModel.findOne({
        where: { user_id },
      });
      if (user || !user_id) {
        return res.json({
          isAbailable: false,
          message: "User id not available",
        });
      }
      // RETURNING JSON
      return res.json({ isAbailable: true, message: "User id available" });
    } catch (e) {
      res.status(400).json(e?.message || e);
    }
  },
  recoverPasswordReq: async (req, res) => {
    try {
      let tokensWithUserId = [],
        token = "",
        userEmail = "";
      const { user_id, email } = req.body;
      if (user_id) {
        const user = await UserModel.findOne({
          where: { user_id },
        });
        if (!user) {
          return res.status(404).json({ err: "User not exist." });
        }
        userEmail = user.email;
        // CREATING JWT TOKEN
        const palyload = {
          id: user.id,
          user_id: user.user_id,
          email: user.email,
        };
        token = jwt.sign(palyload, appConfig.secretOrKey, {
          expiresIn: "1h",
        });
      } else {
        const users = await UserModel.findAll({
          where: { email },
        });
        if (!users.length) {
          return res.status(404).json({ err: "User not exist." });
        }
        userEmail = email;
        users.map((user) => {
          const palyload = {
            id: user.id,
            user_id: user.user_id,
            email: user.email,
          };
          const token = jwt.sign(palyload, appConfig.secretOrKey, {
            expiresIn: "1h",
          });
          tokensWithUserId.push({
            token,
            user_id: user.user_id,
            role: user.role,
          });
        });
      }

      const mailData = {
        from: "noreply@dossierdirect.com",
        to: userEmail,
        subject: "Password Reset Request for Dossier Direct",
        html: user_id
          ? ressetPasswordByUidTemplate({ token })
          : ressetPasswordByEmailTemplate({ tokens: tokensWithUserId }),
      };
      await mailSender(mailData);
      res
        .status(200)
        .json({ success: true, message: "Please check your email." });
    } catch (e) {
      res.status(400).json(e?.message || e);
    }
  },
  resetPassword: (req, res) => {
    try {
      const { id } = req.params;
      let { pass } = req.body;
      jwt.verify(id, appConfig.secretOrKey, async function (err, decoded) {
        console.log(decoded);
        if (!decoded) {
          return res.status(404).json({ err: "Security code isn't valid!" });
        }
        const user = await UserModel.findOne({
          where: { user_id: decoded.user_id },
        });
        if (!user) {
          return res.status(404).json({ err: "User not exist." });
        }
        const validatorMsg = validator({ pass });
        if (validatorMsg) {
          return res.status(404).json({ err: validatorMsg });
        }
        // ENCYPTING PASSWORD
        const salt = bcrypt.genSaltSync(8);
        pass = await bcrypt.hash(pass, salt);
        await UserModel.update({ pass }, { where: { id: user.id } });
        res.json({ success: true, message: "Password has been updated." });
      });
    } catch (e) {
      res.status(400).json(err?.message || err);
    }
  },
  getUser: async function (req, res) {
    try {
      const user = {};
      res.json({});
    } catch (e) {
      res.status(400).json(err?.message || err);
    }
  },

  getMyUserDetails: async function (req, res) {
    try {
      const { id } = req.user;
      const user = await UserModel.findByPk(id, {
        attributes: [
          "id",
          "user_id",
          "email",
          "first_name",
          "last_name",
          "lawyer_categories",
          "profile_pic",
          "role",
        ],
      });

      res.json(user);
    } catch (e) {
      res.status(400).json(err?.message || err);
    }
  },

  updateMyDetails: async function (req, res) {
    try {
      const { id } = req.user;
      const {
        user_id,
        first_name,
        last_name,
        email,
        lawyer_categories,
        profile_pic,
      } = req.body;

      await UserModel.update(
        {
          user_id,
          first_name,
          last_name,
          email,
          lawyer_categories,
          profile_pic,
        },
        {
          where: { id },
        }
      );

      res.status(200).json("successfully updated");
    } catch (e) {
      res.status(400).json(err?.message || err);
    }
  },

  updateMyPassword: async function (req, res) {
    try {
      const { id } = req.user;
      const { pass } = req.body;

      const salt = bcrypt.genSaltSync(8);
      let passCrypted = await bcrypt.hash(pass, salt);

      await UserModel.update(
        {
          pass: passCrypted,
        },
        {
          where: { id },
        }
      );

      res.status(200).json("successfully updated");
    } catch (e) {
      res.status(400).json(err?.message || err);
    }
  },

  ServeFile: async (req, res) => {
    try {
      return res.status(200).json({
        fileName: req.file.location,
        success: true,
        message: "File has been marked as completed.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error?.message || error);
    }
  },
};
