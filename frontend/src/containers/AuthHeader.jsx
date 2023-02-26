import React from "react";
import { Link } from "react-router-dom";

const AuthHeader = () => {
  return (
    <section id="auth-header">
      <div className="container-fluid">
        <nav className="navbar navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            <img
              alt="logo"
              src="/img/logo_in_color.svg"
              style={{ height: 24 }}
            />
          </Link>
        </nav>
      </div>
    </section>
  );
};

export default AuthHeader;
