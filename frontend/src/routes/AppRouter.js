import React from "react";
import {BrowserRouter as Router, Switch } from "react-router-dom";
import { Auth, ClientsPages, LawerPages } from "./Routes";
import { AuthRoute, ClientsRoute, LawyerRoutes } from "./AllRoute";
import { Layout } from "../containers";
import { createBrowserHistory } from "history";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../store/actions";

const AppRouter = () => {
  const history = createBrowserHistory();
  // getting params
  const urlSearchParams = new URLSearchParams(history.location?.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const user = useSelector(state=>state.auth);
  const dispatch = useDispatch();

  if(user?.role ==='lawyer' && (params.invitationId || params.requestId)){
    dispatch(LogoutUser());
  }

  if (params.invitationId) {
    localStorage.setItem("invitationId", params.invitationId);
    localStorage.removeItem("requestId");
  } else if (params.requestId) {
    localStorage.setItem("requestId", params.requestId);
    localStorage.removeItem("invitationId");
  }
  // question or docuement
  if (params.questionId) {
    localStorage.setItem("questionId", params.questionId);
  } else if (params.documentId) {
    localStorage.setItem("documentId", params.documentId);
  }
  
  return (
    <Router history={history}>
      <Layout>
        <Switch>
          {Auth.map((item, index) => (
            <AuthRoute key={index} {...item} />
          ))}
          {/* {PrivatePagesCommon.map((item, index) => (
            <ClientsRoute key={index} {...item} />
          ))} */}
          {LawerPages.map((item, index) => (
            <LawyerRoutes key={index} {...item} />
          ))}
          {ClientsPages.map((item, index) => (
            <ClientsRoute key={index} {...item} />
          ))}
        </Switch>
      </Layout>
    </Router>
  );
};

export default AppRouter;
