import React from "react";
import { Link } from "react-router-dom";

const AuthFooter = () => {
  return (
    <section id="auth-footer">
      <div className="container-fluid d-flex justify-content-around">
        <div className="footer-text">
          <p className="text-center">
            By clicking Create Account you agree for{" "}
            <Link className="term" to="/">
              Terms
            </Link>{" "}
            and have read our <Link className="term" to="/">
              Privacy statment
            </Link>
            
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthFooter;
