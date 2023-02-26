import { createBrowserHistory } from "history";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

// Auth router components
export const AuthRoute = ({ component: Component, ...rest }) => {
  const { token = "", role = "lawyer" } = useSelector((state) => state.auth);

  return token ? (
    role === "lawyer" ? (
      <Redirect to="/category/list" />
    ) : (
      <Redirect to="/draft-client" />
    )
  ) : (
    <Route {...rest} component={(props) => <Component {...props} />} />
  );
};

//private common
export const PrivateCommonRoute = ({ component: Component, ...rest }) => {
  const { token = "", role = "lawyer" } = useSelector((state) => state.auth);

  return token ? (
    <Route {...rest} component={(props) => <Component {...props} />} />
  ) : (
    <Redirect to="/" from={rest.path} />
  );
};

// Lawyer route components
export const LawyerRoutes = ({ component: Component, ...rest }) => {
  localStorage.removeItem("invitationId");
  const { token = "", role = "lawyer" } = useSelector((state) => state.auth);
  return token ? (
    role === "lawyer" ? (
      <Route {...rest} component={(props) => <Component {...props} />} />
    ) : (
      <Redirect to="/draft-client" />
    )
  ) : (
    <Redirect to="/" from={rest.path} />
  );
};

export const ClientsRoute = ({ component: Component, ...rest }) => {
  const { token = "", role = "lawyer" } = useSelector((state) => state.auth);
  // const history = createBrowserHistory();

  // invitation id setup
  const invitationId = localStorage.getItem("invitationId");
  const requestId = localStorage.getItem("requestId");

  if (invitationId && role === "client") {
    localStorage.removeItem("invitationId");
    return <Redirect to={`/file/open?invitationid=${invitationId}`} />;
  } else if (requestId && role === "client") {
    const questionId = localStorage.getItem("questionId");
    const documentId = localStorage.getItem("documentId");
    localStorage.removeItem("questionId");
    localStorage.removeItem("documentId");
    localStorage.removeItem("requestId");
    if (questionId) {
      return (
        <Redirect to={`/file/details/${requestId}?questionId=${questionId}`} />
      );
    } else if (documentId) {
      return (
        <Redirect to={`/file/details/${requestId}?documentId=${documentId}`} />
      );
    } else {
      return <Redirect to={`/file/details/${requestId}`} />;
    }
  }
  return token ? (
    role === "client" ? (
      <Route {...rest} component={(props) => <Component {...props} />} />
    ) : (
      <Redirect to="/category/list" from={rest.path} />
    )
  ) : (
    <Redirect to="/" from={rest.path} />
  );
};
