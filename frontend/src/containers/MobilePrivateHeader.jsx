import React from "react";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";

const MobilePrivateHeader = ({ open }) => {
  const history = useHistory();

  return (
    <div className="d-flex justify-content-between align-items-center my-3 mx-3">
      <ArrowLeftOutlined
        style={{ fontSize: 20 }}
        onClick={() => history.goBack()}
      />
      <Link to="/">
        <img
          src="/img/logo.png"
          alt="Dossier Direct"
          style={{ height: 18, width: 145 }}
        />
      </Link>
      <MenuOutlined onClick={open} style={{ fontSize: 20 }} />
    </div>
  );
};

export default MobilePrivateHeader;
