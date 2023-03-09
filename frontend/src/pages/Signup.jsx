import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DrossierButton, DrossierInput, ErrorPromp } from "../components";
import { checkExistingUser, RegisterUser } from "../store/actions";
import { formValidation } from "../util";

const Signup = ({ history }) => {
  
  const [state, setState] = useState({
    user_id: "",
    first_name:"",
    last_name:"",
    designation:"",
    office_id:"",
    email: "",
    pass: "",
    phone:"",
    education:"",
    work_experince:"",
    chember:"",
    per_minute_charge:"",
    per_hour_charge:"",
    per_day_charge:"",
    per_case_charge:"",
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
    user_id:false ,
    first_name:false,
    last_name:false,
    designation:false,
    office_id:false,
    phone:false,
    education:false,
    work_experince:false,
    chember:false,
    per_minute_charge:false,
    per_hour_charge:false,
   per_day_charge:false,
    per_case_charge:false,
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
        <div className="auth-inner w-50">
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

          <div className="input-field row row-cols-md-2 row-cols-1 ">

            <div className="mb-4">
              <DrossierInput
                  style={
                    err.userId && state.user_id
                        ? { border: "1px solid #E94614" }
                        : state.user_id && !err.userId
                            ? { border: "1px solid #8CE445" }
                            : {}
                  }
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
                    err.first_name
                        ? { border: "1px solid #8CE445" }
                        : !err.first_name && state.first_name
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your first name"
                  onChange={handleInput}
                  value={state.first_name}
                  name="first_name"
                  type="text"
              />
            </div>
            <div className="mb-4">
            <DrossierInput
                style={
                  err.last_name
                      ? { border: "1px solid #8CE445" }
                      : !err.last_name && state.last_name
                          ? { border: "1px solid #E94614" }
                          : {}
                }
                className="mb-2"
                placeHolder="Your last name"
                onChange={handleInput}
                value={state.last_name}
                name="last_name"
                type="text"
            />
          </div>

            <div className="mb-4">
              <DrossierInput
                  style={
                    err.office_id
                        ? { border: "1px solid #8CE445" }
                        : !err.office_id && state.office_id
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your office id"
                  onChange={handleInput}
                  value={state.office_id}
                  name="office_id"
                  type="number"
              />
            </div>
            <div className="mb-4">
              <DrossierInput
                  style={
                    err.designation
                        ? { border: "1px solid #8CE445" }
                        : !err.designation && state.designation
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your designation"
                  onChange={handleInput}
                  value={state.designation}
                  name="designation"
                  type="text"
              />
            </div>

            <div className="mb-4">
              <DrossierInput
                  style={
                    err.phone
                        ? { border: "1px solid #8CE445" }
                        : !err.phone && state.phone
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your  tel phone"
                  onChange={handleInput}
                  value={state.phone}
                  name="phone"
                  type="tel"
              />
            </div>

            <div className="mb-4">
              <DrossierInput
                  style={
                    err.education
                        ? { border: "1px solid #8CE445" }
                        : !err.education && state.education
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Eucation "
                  onChange={handleInput}
                  value={state.education}
                  name="education"
                  type="text"
              />
            </div>

            <div className="mb-4">
              <DrossierInput
                  style={
                    err.work_experince
                        ? { border: "1px solid #8CE445" }
                        : !err.work_experince && state.work_experince
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="work experince "
                  onChange={handleInput}
                  value={state.work_experince}
                  name="work_experince"
                  type="text"
              />
            </div>


            <div className="mb-4">
              <DrossierInput
                  style={
                    err.chember
                        ? { border: "1px solid #8CE445" }
                        : !err.chember && state.chember
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your chember "
                  onChange={handleInput}
                  value={state.chember}
                  name="chember"
                  type="text"
              />
            </div>

            <div className="mb-4">
              <DrossierInput
                  style={
                    err.per_minute_charge
                        ? { border: "1px solid #8CE445" }
                        : !err.per_minute_charge && state.per_minute_charge
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your per_minute_charge "
                  onChange={handleInput}
                  value={state.per_minute_charge}
                  name="per_minute_charge"
                  type="number"
              />
            </div>

            <div className="mb-4 ">
              <DrossierInput
                  style={
                    err.per_hour_charge
                        ? { border: "1px solid #8CE445" }
                        : !err.per_hour_charge && state.per_hour_charge
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your per_hour_charge "
                  onChange={handleInput}
                  value={state.per_hour_charge}
                  name="per_hour_charge"
                  type="number"
              />
            </div>


            <div className="mb-4">
              <DrossierInput
                  style={
                    err.per_day_charge
                        ? { border: "1px solid #8CE445" }
                        : !err.per_day_charge && state.per_day_charge
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your per_day_charge"
                  onChange={handleInput}
                  value={state.per_day_charge}
                  name="per_day_charge"
                  type="number"
              />
            </div>

            <div className="mb-4">
              <DrossierInput
                  style={
                    err.per_case_charge
                        ? { border: "1px solid #8CE445" }
                        : !err.per_case_charge && state.per_case_charge
                            ? { border: "1px solid #E94614" }
                            : {}
                  }
                  className="mb-2"
                  placeHolder="Your per_case_charge"
                  onChange={handleInput}
                  value={state.per_case_charge}
                  name="per_case_charge"
                  type="number"
              />
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
            {/* <div className="mb-4 pt-4 role_selector_wrapper">*/}
            {/*  <label>User role</label>*/}
            {/*  <Select*/}
            {/*    className="role_selector mb-2"*/}
            {/*    style={{ width: "100%" }}*/}
            {/*    value={state.role}*/}
            {/*    onChange={(role) => setState({ ...state, role })}*/}
            {/*  >*/}
            {/*    <Select.Option className="role_selector_option" value="lawyer">*/}
            {/*      Lawyer*/}
            {/*    </Select.Option>*/}
            {/*    <Select.Option className="role_selector_option" value="client">*/}
            {/*      Client*/}
            {/*    </Select.Option>*/}
            {/*  </Select>*/}
            {/*</div>*/}
            <div className="text-center mt-md-3 ">
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
