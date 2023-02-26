import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Router, useHistory } from "react-router-dom";
import { DrossierButton, DrossierInput } from "..";
import { addDocumentSubcategory } from "../../store/actions";
import { ConfirmationModal } from "../Shared";

const AddDocumentModal = ({
  visible,
  setVisible,
  categoryName,
  categoryCreatedId,
}) => {
  const [conVisible, setConVisible] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useHistory();

  return (
    <Modal
      visible={visible}
      className={`confirmation_modal`}
      centered
      onCancel={() => setVisible(false)}
      footer={null}
      title={null}
      bodyStyle={{
        borderRadius: "0.625rem",
        padding: "3.438rem 2rem",
      }}
    >
      <div className="d-flex justify-content-center">
        <p className="modal_title">
          Would you like to create the first sub category for {categoryName}
        </p>
      </div>
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <p
            className="cancel_btn"
            onClick={() => {
              router.push("/category/list");
            }}
          >
            Not Now
          </p>
          <p
            className="ok_btn"
            style={{ color: "#455ECE" }}
            onClick={() => {
              router.push(
                `/subcategory?createdCategoryId=${categoryCreatedId}`
              );
            }}
          >
            Yes
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AddDocumentModal;
