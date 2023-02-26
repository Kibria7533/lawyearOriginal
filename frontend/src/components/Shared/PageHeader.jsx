import React from "react";
import {Link} from "react-router-dom"

const PageHeader = ({ title = "Title" }) => {
  return (
    <div
      style={{ marginBottom: "1.25rem" }}
      className="d-flex justify-content-between align-items-center"
      id="common-element"
    >
      <h2 className="page-title">{title}</h2>
      <Link to="/notifications">
        <img
          style={{ width: "1.125rem", cursor: "pointer" }}
          alt="notification"
          src="/img/bell.png"
        />
      </Link>
    </div>
  );
};

export default PageHeader;
