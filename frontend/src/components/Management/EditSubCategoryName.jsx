import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { updateSubcategory } from "../../services/subcategories";
import { addDocumentSubcategory } from "../../store/actions";
import { getAuthData } from "../../util";

const EditSubCategoryName = ({ editElement, setEditElement, mutate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(editElement?.name);
  }, [editElement]);

  const onChange = (e) => setName(e.target.value);

  const saveSubCategoryName = async () => {
    setLoading(true);

    await updateSubcategory(
      { name: name, id: editElement.id },
      getAuthData().token
    );
    setEditElement(null);
    mutate();
    setLoading(false);
  };

  return (
    <Modal
      visible={editElement}
      className="add_question_modal"
      centered
      footer={null}
      title={null}
      onCancel={() => setEditElement(null)}
      bodyStyle={{ borderRadius: "0.625rem", padding: "3.438rem 2rem" }}
    >
      <div
        className="d-flex align-items-center"
        style={{ flexDirection: "column" }}
      >
        <p className="modal_title" style={{ fontSize: 18, fontWeight: "700" }}>
          Rename Sub-Category
        </p>
        <p className="modal_title">{editElement?.name}</p>
      </div>
      <DrossierInput placeHolder="New Name" onChange={onChange} value={name} />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Rename"
            onClick={saveSubCategoryName}
            disabled={!name}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditSubCategoryName;
