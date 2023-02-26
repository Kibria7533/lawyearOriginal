import { useWindowWidth } from "@react-hook/window-size";
import { Modal, notification } from "antd";
import { clamp } from "date-fns/esm";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput, ErrorPromp } from "..";
import { uploadMyPassword } from "../../services/user";
import { formValidation, getAuthData } from "../../util";

const UpdatePassword = ({ visible, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);
  const [focusConfirm, setFocusConfirm] = useState(false);
  const [error, setError] = useState(null);
  const onlyWidth = useWindowWidth();

  const onClick = async () => {
    if (state.pass !== stateConfirm.pass) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await uploadMyPassword(
      { pass: state.pass },
      getAuthData().token
    );

    if (res?.status === 200) {
      setLoading(false);
      setVisible(false);
      setError(null);
      notification.success({
        message: res.data,
        placement: "bottomRight",
      });
    }
    setLoading(false);
  };

  //Pass
  const [state, setState] = useState({
    pass: "",
  });

  const [err, setErr] = useState({
    pass: {
      length: false,
      number: false,
      special: false,
      upperLetter: false,
      smallLetter: false,
    },
  });

  const passCheck =
    !err.pass.length ||
    !err.pass.special ||
    !err.pass.number ||
    !err.pass.upperLetter ||
    !err.pass.smallLetter;

  const showPromp = state.pass && passCheck;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    setErr({ ...err, [name]: formValidation(name, value) });
    setError(null);
  };

  //Confirm
  const [stateConfirm, setStateConfirm] = useState({
    pass: "",
  });

  const [errConfirm, setErrConfirm] = useState({
    pass: {
      length: false,
      number: false,
      special: false,
      upperLetter: false,
      smallLetter: false,
    },
  });

  const passCheckConfirm =
    !errConfirm.pass.length ||
    !errConfirm.pass.special ||
    !errConfirm.pass.number ||
    !errConfirm.pass.upperLetter ||
    !errConfirm.pass.smallLetter;

  const showPrompConfirm = stateConfirm.pass && passCheckConfirm;

  const handleInputConfirm = (e) => {
    const { name, value } = e.target;
    setStateConfirm({ ...state, [name]: value });
    setErrConfirm({ ...err, [name]: formValidation(name, value) });
    setError(null);
  };
  console.log(onlyWidth > 768);
  return (
    <Modal
      visible={visible}
      className="add_question_modal"
      centered={onlyWidth > 768}
      footer={null}
      title={null}
      onCancel={() => setVisible(false)}
      bodyStyle={{
        borderRadius: "0.625rem",
        padding:
          "clamp(30px , 5vw , 3.438rem) clamp(20px , 5vw , 3.438rem) clamp(40px , 5vw , 3.438rem) clamp(20px , 5vw , 3.438rem)",
      }}
      style={{ maxWidth: "95%" }}
    >
      <div className="d-flex justify-content-center">
        <p className="modal_title" style={{ fontWeight: "600" }}>
          Change Password
        </p>
      </div>
      <div className="mb-4 password" style={{ position: "relative" }}>
        <DrossierInput
          style={
            passCheck && state.pass
              ? { boxShadow: "none", border: "1px solid #E94614" }
              : !passCheck && state.pass
              ? { boxShadow: "none", border: "1px solid #8CE445" }
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
        {showPromp && focus && (
          <div
            style={{
              position: "absolute",
              right: "-190px",
              top: 22,
              background: "white",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #9D9D9D",
            }}
          >
            <ErrorPromp err={err} className="error-promp-signup" />
          </div>
        )}
      </div>
      <div className="mb-4 password" style={{ position: "relative" }}>
        <DrossierInput
          style={
            passCheckConfirm && stateConfirm.pass
              ? { boxShadow: "none", border: "1px solid #E94614" }
              : !passCheck && state.pass
              ? { boxShadow: "none", border: "1px solid #8CE445" }
              : {}
          }
          className="mb-2"
          onFocus={() => setFocusConfirm(true)}
          onBlur={() => setFocusConfirm(false)}
          placeHolder="Confirm Password"
          onChange={handleInputConfirm}
          value={stateConfirm.pass}
          name="pass"
          type="password"
        />
        {showPrompConfirm && focusConfirm && (
          <div
            style={{
              position: "absolute",
              right: "-190px",
              top: 22,
              background: "white",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #9D9D9D",
            }}
          >
            <ErrorPromp err={errConfirm} className="error-promp-signup" />
          </div>
        )}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>

      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Change Password"
            onClick={onClick}
            disabled={passCheckConfirm || passCheck}
            loading={loading}
            style={{ opacity: (passCheckConfirm || passCheck) && "50%" }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdatePassword;
