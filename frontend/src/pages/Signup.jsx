import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DrossierButton, DrossierInput, ErrorPromp } from "../components";
import { checkExistingUser, RegisterUser } from "../store/actions";
import { formValidation } from "../util";

const Signup = ({ history }) => {
  const [state, setState] = useState({
    email: "",
    user_id: "",
    pass: "",
    role: "lawyer",
  });
  useEffect(() => {
    const invitationId = localStorage.getItem("invitationId");
    if (invitationId) setState({ ...state, role: "client" });
  }, []);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({
    email: false,
    userId: false,
    pass: {
      length: false,
      number: false,
      special: false,
      upperLetter: false,
      smallLetter: false,
    },
  });

  const [focus, setFocus] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    setErr({ ...err, [name]: formValidation(name, value) });
    if (name === "user_id") {
      checkUserExist(value);
    }
  };

  // check user is exists or not
  const checkUserExist = async (userId) => {
    try {
      const res = await checkExistingUser(userId);
      console.log(res);
      if (!res.isAbailable) {
        setErr({ ...err, userId: true });
      } else {
        setErr({ ...err, userId: false });
      }
    } catch (error) {}
  };

  //create account
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await RegisterUser(state);

      if (res) {
        history.push("/reg-confirmation");
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  const { length, number, upperLetter, smallLetter, special } = err.pass;

  const passCheck =
    !length || !special || !number || !upperLetter || !smallLetter;
  const showPromp = state.pass && passCheck;

  const disabled =
    !state.email ||
    !state.user_id ||
    !state.pass ||
    !err.email ||
    passCheck ||
    err.userId;
  return (
    <section id="signin">
      <div className="container-fluid d-flex justify-content-around">
        <div className="auth-inner">
          <div className="form-header mb-4 d-flex justify-content-between">
            <h4>Create Account</h4>
            <div className="login-link">
              <p>
                or{" "}
                <Link to="/" className="login-redirect">
                  Log in
                </Link>
              </p>
            </div>
          </div>
          <div className="input-field">
            <div className="mb-4">
              <DrossierInput
                style={
                  err.email
                    ? { border: "1px solid #8CE445" }
                    : !err.email && state.email
                    ? { border: "1px solid #E94614" }
                    : {}
                }
                className="mb-2"
                placeHolder="Email Address"
                onChange={handleInput}
                value={state.email}
                name="email"
                type="email"
              />
            </div>
            <div className="mb-4">
              <DrossierInput
                style={
                  err.userId && state.user_id
                    ? { border: "1px solid #E94614" }
                    : state.user_id && !err.userId
                    ? { border: "1px solid #8CE445" }
                    : {}
                }
                className="mb-2"
                placeHolder="User ID"
                onChange={handleInput}
                value={state.user_id}
                name="user_id"
              />
              {state.user_id &&
                (err.userId ? (
                  <div className="exist-userid-text text-right">
                    <p>A user with this ID already exists</p>
                  </div>
                ) : (
                  <div className="exist-userid-text text-right">
                    <p style={{ color: "#8CE445" }}>This id is available!</p>
                  </div>
                ))}
            </div>
            <div className="mb-4 password">
              <DrossierInput
                style={
                  passCheck && state.pass
                    ? { border: "1px solid #E94614" }
                    : !passCheck && state.pass
                    ? { border: "1px solid #8CE445" }
                    : {}
                }
                className="mb-2"
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeHolder="Password"
                onChange={handleInput}
                value={state.pass}
                name="pass"
                type="password"
              />
            </div>
            {/* <div className="mb-4 pt-4 role_selector_wrapper">
              <label>User role</label>
              <Select
                className="role_selector mb-2"
                style={{ width: "100%" }}
                value={state.role}
                onChange={(role) => setState({ ...state, role })}
              >
                <Select.Option className="role_selector_option" value="lawyer">
                  Lawyer
                </Select.Option>
                <Select.Option className="role_selector_option" value="client">
                  Client
                </Select.Option>
              </Select>
            </div> */}
            <div className="text-center">
              <DrossierButton
                loading={loading}
                disabled={disabled || loading}
                text="Create Account"
                onClick={handleSubmit}
              />
            </div>
            {(showPromp || focus) && (
              <ErrorPromp err={err} className="error-promp-signup" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
