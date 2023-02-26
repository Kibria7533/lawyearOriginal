import { Modal } from "antd";
import React from "react";
const ConfirmationModal = ({
  onOk,
  okText = "",
  cencelText = "",
  onCancel,
  title,
  visible,
  setVisible,
  className = "",
  deleteButton,
}) => {
  return (
    <Modal
      visible={visible}
      className={`confirmation_modal ${className}`}
      centered
      footer={null}
      title={null}
      onCancel={() => setVisible(null)}
      bodyStyle={{ borderRadius: "0.625rem", padding: "3.438rem" }}
    >
      <div className="d-flex justify-content-center">
        <p className="modal_title" style={{ fontWeight: "600" }}>
          {title}
        </p>
      </div>
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <p className="cancel_btn" onClick={onCancel}>
            {cencelText || "Cancel"}
          </p>
          <p
            className="ok_btn"
            onClick={onOk}
            style={{ color: deleteButton ? "#E94614" : "" }}
          >
            {okText || "Yes, Delete"}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
