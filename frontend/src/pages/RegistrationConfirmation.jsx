import React from "react";
import { Link } from "react-router-dom";
import { DrossierButton } from "../components";

const RegistrationConfirmation = () => {
  return (
    <section id="signin">
      <div className="container-fluid d-flex justify-content-around">
        <div className="confirmation-text">
          <h2>You have successfully created an account</h2>
          <div className="back-to-login mt-5 text-center">
            <Link to="/">
              <DrossierButton text="Back to Log In Page" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default RegistrationConfirmation;
