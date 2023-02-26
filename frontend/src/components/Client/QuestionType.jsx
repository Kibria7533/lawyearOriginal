import { Input, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import { ReactComponent as SvgEdit } from "../../assets/edit.svg";

const inputStyle = {
  border: "1px solid #AFD2E9",
  fontSize: 16,
  color: "#1F295A",
  padding: "8px 20px",

  fontWeight: "400",
  borderRadius: 10,
  marginBottom: 4,
};

const QuestionType = ({
  type,
  options,
  setOptions,
  optionValues,
  setOptionValues,
}) => {
  if (type?.name === "Short Answer") return <></>;
  if (type?.name === "Paragraph") return <></>;
  if (type?.name === "Multiple Choice")
    return (
      <MultipleChoice
        type="Multiple Choice"
        options={options}
        setOptions={setOptions}
        optionValues={optionValues}
        setOptionValues={setOptionValues}
      />
    );
  if (type?.name === "Checkboxes")
    return (
      <MultipleChoice
        type="Checkboxes"
        options={options}
        setOptions={setOptions}
        optionValues={optionValues}
        setOptionValues={setOptionValues}
      />
    );
  if (type?.name === "Dropdown")
    return (
      <MultipleChoice
        type="Dropdown"
        options={options}
        setOptions={setOptions}
        optionValues={optionValues}
        setOptionValues={setOptionValues}
      />
    );
  if (type?.name === "Date") return <></>;
  if (type?.name === "Time") return <></>;
  return <></>;
};

export default QuestionType;

const MultipleChoice = ({ optionValues, setOptionValues, type }) => {
  const [optionsLocal, setOptionsLocal] = useState([
    { id: 1, placeholder: "Option 1", saved: false },
  ]);
  const [error, setError] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [optionsLocal]);

  useEffect(() => {
    if (Object.entries(optionValues).length > 0)
      setOptionsLocal(
        Object.entries(optionValues).map((item, index) => ({
          id: index + 1,
          placeholder: `Option ${index + 1}`,
          saved: true,
        }))
      );
  }, []);

  const handleDelete = (index) => {
    if (optionsLocal.length <= 1) {
      setError("At least one option is necessary");
      return;
    }
    let array = optionsLocal.filter((item, idx) => idx !== index);
    setOptionsLocal(array);

    const object = { ...optionValues };
    delete object[index + 1];
    setOptionValues(object);
  };

  const handleSaveOption = (index, boolean) => {
    const element = optionsLocal.find((item) => item.id === index);
    element.saved = boolean;
    const filteredArray = optionsLocal.filter((item) => item.id !== index);
    filteredArray.splice(index, 0, element);
    setOptionsLocal(filteredArray);
  };

  const handleAddOption = () => {
    const max = Math.max(...optionsLocal.map((item) => item.id)) + 1;
    const temp = optionsLocal.map((item) => ({ ...item, saved: true }));

    setOptionsLocal([
      ...temp,
      {
        id: max,
        placeholder: `Option ${max}`,
      },
    ]);
    setError("");
  };

  return (
    <div style={{ padding: "1rem 0 1rem 1rem" }}>
      {optionsLocal
        .sort(function (a, b) {
          return a.id - b.id;
        })
        .map((item, index) => (
          <div
            style={inputStyle}
            className="d-flex align-items-center justify-content-between"
          >
            <div
              className="d-flex align-items-center"
              style={{ width: "90%", gap: 4 }}
            >
              <>
                {(type === "Multiple Choice" || type === "Dropdown") && (
                  <p>{index + 1}.</p>
                )}
                {type === "Checkboxes" && <img src="/img/checkbox_gray.svg" />}
              </>

              {!item.saved ? (
                <input
                  key={item?.id}
                  placeholder={item.placeholder}
                  style={{
                    border: "none",
                    width: "100%",
                    color: "#1F295A",
                    fontWeight: "600",
                  }}
                  value={optionValues[item.id]}
                  onChange={(e) => {
                    setOptionValues({
                      ...optionValues,
                      [item.id]: e.target.value,
                    });
                  }}
                  ref={inputRef}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddOption();
                    }
                  }}
                />
              ) : (
                <p style={{ color: "#1F295A", fontWeight: "600" }}>
                  {optionValues[item.id]}
                </p>
              )}
            </div>
            <div
              style={{ width: "10%", minWidth: 80, gap: 8 }}
              className="d-flex justify-content-end align-items-center"
            >
              {!item.saved ? (
                <p
                  style={{
                    color: "#455ECE",
                    fontWeight: "700",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                  onClick={() => handleSaveOption(item.id, true)}
                >
                  Save
                </p>
              ) : (
                <Tooltip
                  placement="bottom"
                  color="#DBF1FF"
                  title="Edit"
                  overlayInnerStyle={{ color: "#1F295A", fontWeight: 600 }}
                  overlayStyle={{ borderRadius: 4 }}
                >
                  {/*      <img
                    src="/img/edit.svg"
                    alt="fess"
                    onClick={() => handleSaveOption(item.id, false)}
                    style={{ height: 14, width: 14, cursor: "pointer" }}
                  /> */}
                  <SvgEdit
                    onClick={() => handleSaveOption(item.id, false)}
                    style={{ height: 14, width: 14, cursor: "pointer" }}
                  />
                </Tooltip>
              )}
              <Tooltip
                placement="bottom"
                color="#DBF1FF"
                title="Delete"
                overlayInnerStyle={{ color: "#1F295A", fontWeight: 600 }}
                overlayStyle={{ borderRadius: 4 }}
              >
                {/*      <img
                  src="/img/delete.svg"
                  alt="fess"
                  onClick={() => handleDelete(index)}
                  style={{ height: 14, width: 14, cursor: "pointer" }}
                /> */}

                <SvgDelete
                  onClick={() => handleDelete(index)}
                  style={{ height: 14, width: 14, cursor: "pointer" }}
                />
              </Tooltip>
            </div>
          </div>
        ))}
      {error?.length > 0 && (
        <p style={{ fontSize: 12, color: "#CC0202" }}>{error}</p>
      )}
      <span
        style={{
          color: "#455ECE",
          fontWeight: "700",
          fontSize: 16,
          marginTop: 4,
          cursor: "pointer",
        }}
        onClick={handleAddOption}
      >
        Add option
      </span>
    </div>
  );
};
