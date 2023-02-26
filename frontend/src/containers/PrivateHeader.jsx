import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DrossierButton } from "../components";
import { LogoutUser } from "../store/actions";

const PrivateFooter = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(LogoutUser());
  };
  return (
    <section id="auth-header">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <nav className="navbar navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            <img alt="logo" src="/img/logo_in_color.svg" />
          </Link>
        </nav>
        <div>
          <DrossierButton text="Logout" onClick={handleLogout} />
        </div>
      </div>
    </section>
  );
};

export default PrivateFooter;
