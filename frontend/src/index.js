import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import AppRouter from "./routes/AppRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.min.css";
import "./styles/index.scss";
import { Provider } from "react-redux";
import store from "./store";
ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById("root")
);
serviceWorker.unregister();
