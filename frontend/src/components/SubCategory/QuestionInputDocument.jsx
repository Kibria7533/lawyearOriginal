import { CloseCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { DrossierInput } from "..";
import { fetchQuesSuggestions } from "../../store/actions";

const QuestionInputDocument = ({
  addQuestion,
  onClose,
  placeHolder,
  btnText,
}) => {
  const [show, setShow] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [suggetions, setSuggestion] = useState([]);

  const handleQuestion = async (e) => {
    setQuestionText(e.target.value);
    const res = await fetchQuesSuggestions({ name: e.target.value });
    setSuggestion(res);
  };
  const onEnter = () => {
    if (questionText) {
      addQuestion(questionText);
      setQuestionText("");
    }
  };
  const suffix = (
    <button
      className="add-ques"
      style={{
        fontSize: "1rem",
        border: "none",
        background: "none",
        color: "#455ECE",
        fontWeight: "bold",
        cursor: "pointer",
        // pointerEvents: "",
        position: "relative",
      }}
      onClick={() => {
        if (questionText) {
          addQuestion(questionText);
          setQuestionText("");
        }
      }}
      disabled={!questionText}
    >
      {typeof onClose === "function" && (
        <div onClick={(e) => e.stopPropagation()}>
          <CloseCircleOutlined
            onClick={onClose}
            style={{
              background: "#fff",
              position: "absolute",
              right: "-30px",
              top: "-18px",
              fontSize: "18px",
              // pointerEvents: "",
            }}
          />
        </div>
      )}
      {btnText || "Add"}
    </button>
  );

  return (
    <div style={{ width: "24.125rem" }}>
      <div className="ques-input">
        <DrossierInput
          suffix={suffix}
          labelShow
          onFocus={() => setShow(true)}
          onEnter={onEnter}
          // onBlur={() => setShow(false)}
          style={{ padding: "0.5rem 1.25rem" }}
          placeHolder={placeHolder || "Write a Question"}
          onChange={handleQuestion}
          value={questionText}
        />
        {questionText && show && suggetions?.length > 0 && (
          <div className="options-layout">
            <div className="mt-3">
              {suggetions.map((item) => (
                <div
                  onClick={() => {
                    addQuestion(item?.ques);
                    setSuggestion([]);
                    setQuestionText("");
                  }}
                  style={{ cursor: "pointer" }}
                  key={item?._id}
                  className="single-item"
                >
                  <p>{item?.ques}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionInputDocument;
