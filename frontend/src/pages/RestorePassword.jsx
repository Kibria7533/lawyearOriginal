import React, { useState } from "react";
import { useParams } from "react-router";
import { DrossierButton, DrossierInput, ErrorPromp } from "../components";
import { resetPassword } from "../store/actions";
import { formValidation } from "../util";

const RestorePassword = ({ history }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    pass: "",
    cpassword: "",
  });
  const [err, setErr] = useState({
    pass: {},
  });

  const [focus, setFocus] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    setErr({ ...err, [name]: formValidation(name, value) });
  };

  // reset password api
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await resetPassword({ token: id, pass: state.pass });
      if (res) {
        history.push("/");
      }
    } catch (error) {
      console.log();
    }
    setLoading(false);
  };

  const { length, number, upperLetter, smallLetter, special } = err.pass;
  const passCheck =
    !length || !special || !number || !upperLetter || !smallLetter;
  const showPromp = state.pass && passCheck;
  const disable =
    !state.pass ||
    !state.cpassword ||
    passCheck ||
    state.pass !== state.cpassword;

  return (
    <section id="signin">
      <div className="container-fluid d-flex justify-content-around">
        <div className="auth-inner">
          <div className="form-header mb-4 d-flex justify-content-between">
            <h4>Restore Password</h4>
          </div>
          <div className="input-field">
            <div className="mb-4">
              <DrossierInput
                style={
                  passCheck && state.pass
                    ? { border: "1px solid #E94614" }
                    : !passCheck && state.pass
                    ? { border: "1px solid #8CE445" }
                    : {}
                }
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                className="mb-2"
                placeHolder="Password"
                onChange={handleInput}
                value={state.pass}
                name="pass"
                type="password"
              />
            </div>
            <div>
              <DrossierInput
                style={
                  state.cpassword ? state.cpassword !== state.pass
                    ? { border: "1px solid #E94614" }
                    : { border: "1px solid #8CE445"}:{}
                }
                className="mb-2"
                placeHolder="Confirm Password"
                onChange={handleInput}
                value={state.cpassword}
                name="cpassword"
                type="password"
              />
            </div>
            <div className="text-center login-buton">
              <DrossierButton
                style={{ padding: "0.696rem 5.406rem" }}
                text="Restore"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading || disable}
              />
            </div>
            {(showPromp || focus) && (
              <ErrorPromp err={err} className="error-promp-restore" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestorePassword;
