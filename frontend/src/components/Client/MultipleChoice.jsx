import React from "react";

const MultipleChoice = ({ question }) => {
  if (question?.options?.length > 0)
    return (
      <div style={{ padding: "12px 0 20px 0" }}>
        {question?.options?.map((item, index) => (
          <div
            className="d-flex align-items-center"
            style={{ gap: 4, padding: "5px 0" }}
          >
            {question?.type === "Dropdown" && <p>{index + 1}.</p>}
            {question?.type === "Checkboxes" && (
              <img
                src="/img/checkbox_gray.svg"
                style={{ width: 16, height: 16 }}
              />
            )}
            {question?.type === "Multiple Choice" && (
              <img
                src="/img/circle_gray.svg"
                style={{ width: 16, height: 16 }}
              />
            )}
            <p style={{ color: "#1F295A", fontWeight: "600" }}>{item}</p>
          </div>
        ))}
      </div>
    );

  return <></>;
};

export default MultipleChoice;
