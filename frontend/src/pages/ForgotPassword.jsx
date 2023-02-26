import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DrossierButton, DrossierInput } from "../components";
import { forgotPassword } from "../store/actions/auth";
import { formValidation } from "../util";

const ForgetPassword = () => {
  const [credentialTypeId, setCredentialTypeId] = useState(true);
  const [loading, setLoading] = useState(false);
  const [credential, setCredential] = useState("");
  const [err, setErr] = useState(false);
  const handleEmail = (e) => {
    setCredential(e.target.value);
    if (!credentialTypeId) {
      setErr(formValidation("email", e.target.value));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = {};
    if (credentialTypeId) {
      data.user_id = credential;
    } else {
      data.email = credential;
    }
    try {
      await forgotPassword(data);
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  const disable = !credential || !err;

  return (
    <section id="signin">
      <div className="container-fluid d-flex justify-content-around">
        <div className="confirmation-text" style={{ marginBottom: "14rem" }}>
          <div className="form-header mb-4">
            <h4 style={{ color: "#212121", marginBottom: "0.625rem" }}>
              Restore Password
            </h4>
            <p className="subtitle">
              We will send a message with instructions to you Email
            </p>
          </div>
          <div className="input-email">
            <DrossierInput
              style={
                !credentialTypeId
                  ? err
                    ? { border: "1px solid #8CE445" }
                    : !err && credential
                    ? { border: "1px solid #E94614" }
                    : {}
                  : {}
              }
              value={credential}
              placeHolder={credentialTypeId ? "User Id" : "Email Address"}
              onChange={handleEmail}
            />
            <div>
              <span
                style={{
                  color: "#455ece",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                className="ml-2"
                onClick={() => {
                  setCredentialTypeId(!credentialTypeId);
                  setCredential("");
                }}
              >
                {credentialTypeId ? "Forgot user id" : "Reset by user id"}
              </span>
            </div>
          </div>
          <div className="text-center login-buton">
            <DrossierButton
              style={{ padding: "0.696rem 5.406rem" }}
              text="Send"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading || (credentialTypeId ? !credential : disable)}
            />
            <div className="text-center" style={{ marginTop: "2.125rem" }}>
              <Link
                style={{
                  color: "#455ECE",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
                to="/"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
