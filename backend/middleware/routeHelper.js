const multer = require("multer");
const uuid = require("uuid/v4"); //added
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const { OAuth2Client } = require("google-auth-library");
const appConfig = require("../config");
const client = new OAuth2Client();

const DO_SPACES_ENDPOINT = "nyc3.digitaloceanspaces.com";
const DO_SPACES_KEY = "Y5T6HVOUJPIES7L75MRE";
const DO_SPACES_SECRET = "B/Ar4tePdCBKbS63kEbZNT8XdGJOcWknZeMuhy3knZI";
const DO_SPACES_NAME = "dossierdirectspace";

const spacesEndpoint = new aws.Endpoint(DO_SPACES_ENDPOINT);

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: DO_SPACES_KEY,
  secretAccessKey: DO_SPACES_SECRET,
});

module.exports.googleTokenVerify = async (req, res, next) => {
  const ticket = await client.verifyIdToken({
    idToken: req.body.id_token,
    audience: appConfig.googleClientId,
  });
  const payload = ticket.getPayload();
  if (payload) {
    req.user = payload;
    next();
  } else {
    if (payload.exp < Date.now()) {
      res.status(500).json({
        err: "Token expired. Try login again",
      });
    } else {
      res.status(500).json({
        err: "Cannot authenticated using google",
      });
    }
  }
};

// Configaration for multer
module.exports.uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: DO_SPACES_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      // console.log(file);
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now().toString() + "^" + file.originalname);
    },
  }),
});

//Handle route err
module.exports.handleError = (e, req, res, next) => {
  res.status(400).json({ err: e.message });
};
