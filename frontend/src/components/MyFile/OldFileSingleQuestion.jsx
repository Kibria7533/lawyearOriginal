import React, { useEffect, useState } from "react";
import { Spin, Input, Checkbox, Select, Radio } from "antd";

import { DrossierInput } from "..";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { UpdateSingleQuestionAnswer } from "../../store/actions";
import { useDispatch } from "react-redux";
import TypeOfFieldInput from "./TypeOfInputField";

const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

const SingleQuestion = ({ data, index }) => {
  const [ans, setAns] = useState("");
  const [disabled, setDisabled] = useState(
    data?.request_question_answers?.length > 0 ? true : false
  );
  const [loading, setLoading] = useState(false);
  // console.log(data?.request_question_answers?.length );
  {
    console.log(data?.request_question_answers?.length > 0);
  }
  useEffect(() => {
    setAns(
      data?.request_question_answers?.length > 0
        ? data?.request_question_answers[0]?.ans
        : ""
    );

    //NEW
    if (
      data?.questionType === "Dropdown" &&
      data?.options &&
      ans?.length === 0
    ) {
      setAns(data.options[0]);
    }
    //NEW
  }, [data]);
  // console.log(disabled);
  const handleInput = (e) => {
    setAns(e.target.value);
  };

  //modal close
  const handleClose = () => {
    // setAns("");
  };

  const dispatch = useDispatch();

  // handleSubmit

  const handleSubmit = async (reAsign) => {
    setLoading(true);

    await dispatch(
      UpdateSingleQuestionAnswer({
        id: data?.id,
        ans,
        requestId: data?.requestId,
        reAsign,
      })
    );
    // handleClose();
    setDisabled(true);
    setLoading(false);
  };

  // console.log(data);

  return (
    <Spin spinning={loading}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
          width: "100%",
        }}
      >
        <p
          style={{
            color: "#455ECE",
            fontSize: 18,
            marginTop: 32,
          }}
        >
          {index + 1}.
        </p>
        <div
          style={{ display: "flex", alignItems: "flex-start", width: "100%" }}
        >
          {data?.request_question_answers?.length ? (
            /*      <CheckOutlined
              className="completed_icon"
              style={{
                color: "#fff",
                background: "#27AE60",
                padding: "4px",
                borderRadius: "50%",
                fontSize: "12px",
                marginRight: "10px",
                marginTop: 36,
              }}
            /> */

            <img
              src="/img/check_icon_small.svg"
              className="completed_icon"
              style={{
                color: "#fff",
                background: "#27AE60",
                padding: "4px",
                borderRadius: "50%",
                fontSize: "12px",
                marginRight: "10px",
                marginTop: 36,
                height: 20,
                width: 20,
              }}
            />
          ) : (
            /*       <CloseOutlined
              className="completed_icon"
              style={{
                color: "#fff",
                background: "#E94614",
                padding: "4px",
                borderRadius: "50%",
                fontSize: "12px",
                marginRight: "10px",
                marginTop: 36,
              }}
            /> */
            <img
              src="/img/close_icon_small.svg"
              className="completed_icon"
              style={{
                color: "#fff",
                background: "#E94614",
                padding: "4px",
                borderRadius: "50%",
                fontSize: "12px",
                marginRight: "10px",
                marginTop: 36,
                height: 20,
                width: 20,
              }}
            />
          )}
          <TypeOfFieldInput
            data={data}
            ans={ans}
            setAns={setAns}
            disabled={disabled}
          >
            <>
              {!data?.request_question_answers?.length > 0 ? (
                <button
                  style={{ ...btnStyle, opacity: !ans && "50%" }}
                  disabled={!ans}
                  onClick={() => handleSubmit(false)}
                >
                  Answer
                </button>
              ) : disabled ? (
                <button style={btnStyle} onClick={() => setDisabled(false)}>
                  Edit
                </button>
              ) : (
                <button
                  disabled={!ans}
                  style={{ ...btnStyle, opacity: !ans && "50%" }}
                  onClick={() => handleSubmit(true)}
                >
                  Update
                </button>
              )}
            </>
          </TypeOfFieldInput>
        </div>
      </div>
    </Spin>
  );
};
export default SingleQuestion;

const btnStyle = {
  color: "#455ECE",
  fontSize: 18,
  fontWeight: "700",
  border: "none",
  background: "transparent",
  padding: 0,
};
