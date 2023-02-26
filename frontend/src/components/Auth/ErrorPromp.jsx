import React from "react";
import { Badge } from "antd";


const ErrorPromp = ({err, className}) => {
  return (
    <div className={`error-promp ${className}`}>
      <div className="d-flex align-items-center mb-2">
        <Badge status={err.pass.length ? "success" : "error"} />
        <div className={err.pass.length ? "success-text" : "error-text"}>
          8 Characters minimum
        </div>
      </div>
      <div className="d-flex align-items-center mb-2">
        <Badge status={err.pass.upperLetter ? "success" : "error"} />
        <div
          className={err.pass.upperLetter ? "success-text" : "error-text"}
        >
          1 Capital Letter
        </div>
      </div>
      <div className="d-flex align-items-center mb-2">
        <Badge status={err.pass.number ? "success" : "error"} />
        <div className={err.pass.number ? "success-text" : "error-text"}>
          1 Number
        </div>
      </div>
      <div className="d-flex align-items-center mb-2">
        <Badge status={err.pass.smallLetter ? "success" : "error"} />
        <div
          className={err.pass.smallLetter ? "success-text" : "error-text"}
        >
          1 Small Letter
        </div>
      </div>
      <div className="d-flex align-items-center">
        <Badge status={err.pass.special ? "success" : "error"} />
        <div className={err.pass.special ? "success-text" : "error-text"}>
          1 Symbol
        </div>
      </div>
    </div>
  );
};

export default ErrorPromp;
