require("dotenv").config();
const path = require("path");
const express = require("express");
const passport = require("passport");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
const categoryRouter = require("./routers/category");
const subcategoryRouter = require("./routers/subcategory");
const requestRouter = require("./routers/request");
const subscriptionRouter = require("./routers/subscription");
const stratagy = require("./config/passport");

require("./db");

// "engines": {
//     "node": "14x"
//   },

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
stratagy.jwtStra(passport);
// stratagy.googleStra(passport)
// stratagy.facebookStrategy(passport);

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/request", requestRouter);
app.use("/subscription", subscriptionRouter);


app.get("/", (req, res) =>
  res.status(200).send("Hello from dossier_direct_api@1.0.0")
);
app.post("/", (req, res) => {
  console.log("sldkf j");
  res.status(200).send("Hello from dossier_direct_api@1.0.0");
});

app.listen(port, () => console.log(`Server listening at ${port}`));
