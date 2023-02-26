import React, { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link,useParams } from "react-router-dom";
import { DrossierButton, DrossierInput } from "../components";
import { LoginUser } from "../store/actions";
import { createBrowserHistory } from "history";
const Signin = () => {
  const [state, setState] = useState({
    user_id: "",
    pass: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = createBrowserHistory();
  // getting params
  const urlSearchParams = new URLSearchParams(history.location?.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log(params,'coolest')
  // if(params.userId){
   
  
  // }

  const { userId,password } = params;
  useEffect(()=>{
  setState({ ...state, user_id: userId,pass: password });
  },[])
  const handleInput = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  // login action
  const handleSubmit = async () => {
    setLoading(true);
    await dispatch(LoginUser(state));
    setLoading(false);
  };

  const disabled = !state.user_id || !state.pass;
  const invitationId = localStorage.getItem("invitationId");

  return (
    <section id="signin">
      <div className="container-fluid d-flex justify-content-around">
        <div className="auth-inner">
          <div className="form-header mb-4 d-flex justify-content-between">
            <h4>Log In</h4>
            <div className="login-link">
              {!invitationId && (
                <p>
                  or{" "}
                  <Link to={`/signup`} className="login-redirect">
                    Create Account
                  </Link>
                </p>
              )}
            </div>
          </div>
          <div className="input-field">
            <div className="mb-4">
              <DrossierInput
                className="mb-2"
                placeHolder="User ID"
                onChange={handleInput}
                value={state.user_id}
                name="user_id"
              />
            </div>
            <div>
              <DrossierInput
                className="mb-2"
                placeHolder="Password"
                onChange={handleInput}
                value={state.pass}
                name="pass"
                type="password"
              />
              <div className="remember-me mt-3">
                <input type="checkbox" /> <span>Remember me</span>
              </div>
            </div>
            <div className="text-center login-buton">
              <DrossierButton
                style={{ padding: "0.696rem 5.406rem" }}
                text="Log In"
                onClick={handleSubmit}
                disabled={disabled || loading}
                loading={loading}
              />
            </div>
            <div className="text-center">
              <Link to="/recovery-password" className="forget-password">
                Forgot Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
