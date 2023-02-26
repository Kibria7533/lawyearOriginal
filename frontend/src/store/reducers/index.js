import { combineReducers } from "redux";

import auth from "./auth";
import categories from "./category";
import subcategories from "./subcategory";
import client from "./client";
import myFile from "./myFile";

export default combineReducers({
  auth,
  categories,
  subcategories,
  client,
  myFile
});
