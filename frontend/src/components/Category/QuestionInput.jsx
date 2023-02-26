import { CloseCircleOutlined } from "@ant-design/icons";
import { Select, Input, Tooltip } from "antd";
import { Option } from "antd/lib/mentions";
import React, { useEffect, useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { DrossierInput } from "..";

import { fetchQuesSuggestions } from "../../store/actions";
import QuestionType from "./QuestionType";
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import { ReactComponent as SvgEdit } from "../../assets/edit.svg";

const QuestionInput = ({
  addQuestion,
  question,
  updateQuestion,
  id,
  handleCloseEdit,
  handleDuplicate,
  onDelete,
}) => {
  const [show, setShow] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [suggetions, setSuggestion] = useState([]);

  const [openDropDown, setOpenDropDown] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionValues, setOptionValues] = useState({});

  const [type, setType] = useState({
    name: "Short Answer",
    icon: "/img/shortAnswer.svg",
  });

  useEffect(() => {
    if (question && question.options) {
      //Question text Edit
      setQuestionText(question.ques);

      //Options Edit
      let option = {};

      question.options.forEach(
        (item, index) => (option = { ...option, [index + 1]: item })
      );
      setOptionValues(option);

      //Type Edit
      setType(types?.find((item) => item.name === question.type));
    }
  }, [question]);

  const handleAddQuestion = () => {
    if (questionText.length === 0) return;
    const options = Object.entries(optionValues).map((item) => item[1]);
    const newQuestion = {
      ques: questionText,
      type: type?.name,
      options,
    };

    if (question) {
      updateQuestion(newQuestion, id - 1);
      handleCloseEdit();
    } else {
      addQuestion(newQuestion);
    }
  };

  const inputStyle = {
    border: "1px solid #AFD2E9",
    fontSize: 16,
    color: "#1F295A",
    padding: "8px 20px",

    fontWeight: "400",
    borderRadius: 10,
    width: "100%",
  };

  const types = [
    {
      name: "Short Answer",
      icon: "/img/shortAnswer.svg",
    },
    {
      name: "Paragraph",
      icon: "/img/paragraph.svg",
    },
    {
      name: "Multiple Choice",
      icon: "/img/mcq.png",
    },
    {
      name: "Checkboxes",
      icon: "/img/checkbox.svg",
    },
    {
      name: "Dropdown",
      icon: "/img/dropdown.svg",
    },
    {
      name: "Date",
      icon: "/img/date.svg",
    },
    {
      name: "Time",
      icon: "/img/time.svg",
    },
  ];

  const getIcon = (name) => {
    return types.find((item) => item?.name === name)?.icon;
  };

  return (
    <>
      <div
        className="d-flex container_question"
        style={{
          paddingTop: "13px",
          paddingBottom: question?.options?.length === 0 ? "18px" : "0px",
        }}
      >
        <p style={{ color: "#455ECE", padding: "0.45rem 0", marginRight: 6 }}>
          {id}.
        </p>
        <div className="ques-input" style={{ width: "100%" }}>
          {/* Basic Input */}
          <Input
            placeholder="Question"
            style={inputStyle}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          {/* Dropdown */}
          <div className="d-flex dropdown">
            <div style={{ width: "100%", position: "relative" }}>
              {!openDropDown && (
                <div
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    width: "100%",
                    background: "white",
                  }}
                  className="d-flex align-items-center justify-content-between"
                  onClick={() => setOpenDropDown(!openDropDown)}
                >
                  <div className="d-flex align-items-center" style={{ gap: 8 }}>
                    <img
                      src={getIcon(type?.name)}
                      style={{ height: 16, width: 16 }}
                    />
                    <p>{type?.name}</p>
                  </div>
                  <img
                    src="/img/arrow_down.svg"
                    style={{ height: 8, width: 12 }}
                  />
                </div>
              )}
              {openDropDown && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    background: "white",
                    zIndex: "999",
                    border: "1px solid #AFD2E9",
                    fontSize: 16,
                    color: "#1F295A",
                    overflow: "hidden",
                    fontWeight: "400",
                    borderRadius: 10,
                    marginBottom: 50,
                  }}
                >
                  {types.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        cursor: "pointer",
                        height: 40,
                        padding: "4px 20px",
                        background: `${
                          item?.name === type?.name ? "#DBF1FF" : ""
                        }`,
                        flexWrap: "wrap",
                      }}
                      className="dropdown_item d-flex align-items-center justify-content-between"
                      onClick={() => {
                        setType(item);
                        setOpenDropDown(!openDropDown);
                      }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 8 }}
                      >
                        <img
                          src={getIcon(item?.name)}
                          style={{ height: 16, width: 16 }}
                        />
                        <p>{item?.name}</p>
                      </div>
                      {index === 0 && (
                        <img
                          src="/img/arrow_up.svg"
                          style={{ height: 8, width: 12 }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: 40, gap: 10 }}
            >
              <p
                style={{
                  color: "#455ECE",
                  fontWeight: "700",
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={handleAddQuestion}
              >
                Save
              </p>
              <Tooltip
                placement="bottom"
                color="#DBF1FF"
                title="Duplicate"
                overlayInnerStyle={{ color: "#1F295A", fontWeight: 600 }}
                overlayStyle={{ borderRadius: 4 }}
              >
                <img
                  src="/img/duplicate.svg"
                  alt="fess"
                  onClick={() => {
                    const options = Object.entries(optionValues).map(
                      (item) => item[1]
                    );
                    const newQuestion = {
                      ques: questionText,
                      type: type?.name,
                      options,
                    };

                    handleDuplicate(newQuestion);
                    /*   handleCloseEdit(); */
                  }}
                  style={{ height: 14, width: 14, cursor: "pointer" }}
                />
              </Tooltip>{" "}
              <Tooltip
                placement="bottom"
                color="#DBF1FF"
                title="Delete"
                overlayInnerStyle={{ color: "#1F295A", fontWeight: 600 }}
                overlayStyle={{ borderRadius: 4 }}
              >
                {/*     <img
                  src="/img/delete.svg"
                  alt="fess"
                  onClick={onDelete}
                  style={{ height: 14, width: 14, cursor: "pointer" }}
                /> */}
                <SvgDelete
                  onClick={onDelete}
                  style={{ height: 14, width: 14, cursor: "pointer" }}
                />
              </Tooltip>
            </div>
          </div>

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
      <QuestionType
        type={type}
        options={options}
        setOptions={setOptions}
        optionValues={optionValues}
        setOptionValues={setOptionValues}
      />
    </>
  );
};

export default QuestionInput;
