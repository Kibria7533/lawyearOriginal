import React from "react";

const ProcessBar = ({ step }) => {
  const steps = [
    { number: 0, name: "Choose Category" },
    { number: 1, name: "Send Questions and Request Documents" },
    { number: 2, name: "Attachments" },
    { number: 3, name: "Final Review" },
    { number: 4, name: "Send to Client" },
    { number: 5, name: "Setup Reminders" },
  ];

  return (
    <div>
      <div className="steps_container">
        {steps.map((item, index) => (
          <div className="step_item">
            <div className="step_circle_container">
              <div
                className={`step_circle ${
                  item?.number === step && "active_step_circle"
                } ${item?.number < step && "finished_step_circle"} ${
                  item?.number > step && "not_finished_step_circle"
                }`}
              >
                {item?.number + 1}
              </div>
              <div
                className={`line_through_steps ${
                  index === 0 && "line_through_steps_first"
                } ${index + 1 === steps.length && "line_through_steps_last"}`}
              ></div>
            </div>
            <p
              className={`step_text ${
                item?.number === step && "active_step_text"
              } ${item?.number < step && "finished_step_text"} ${
                item?.number > step && "not_finished_step_text"
              }`}
            >
              {item?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessBar;
