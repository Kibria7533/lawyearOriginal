import React from "react";
import AuthFooter from "./AuthFooter";
import AuthHeader from "./AuthHeader";

const AuthLayout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <AuthHeader />
      <div>{children}</div>
      <AuthFooter />
    </div>
  );
};

export default AuthLayout;
