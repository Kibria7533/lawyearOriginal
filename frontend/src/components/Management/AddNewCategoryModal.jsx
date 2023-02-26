import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { createCategoryWithDefaultSubCategory } from "../../services/category";
import { updateSubcategory } from "../../services/subcategories";
import { addDocumentSubcategory } from "../../store/actions";
import { getAuthData } from "../../util";

const AddCategoryModal = ({ visible, setVisible, setActiveItem, mutate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setName(e.target.value);

  const addNewCategory = async () => {
    setLoading(true);

    const res = await createCategoryWithDefaultSubCategory(
      { name },
      getAuthData().token
    );
    if (res?.status === 201) {
      setActiveItem(res?.data?.category?.id);
      mutate();
    }
    setVisible(false);
    setLoading(false);
  };

  return (
    <Modal
      visible={visible}
      className="add_question_modal"
      centered
      footer={null}
      title={null}
      onCancel={() => setVisible(false)}
      bodyStyle={{ borderRadius: "0.625rem", padding: "3.438rem 2rem" }}
    >
      <div
        className="d-flex align-items-center"
        style={{ flexDirection: "column" }}
      >
        <p className="modal_title" style={{ fontSize: 18, fontWeight: "700" }}>
          Create Category
        </p>
        {/*     <p className="modal_title">{editElement?.name}</p> */}
      </div>
      <DrossierInput placeHolder="New Name" onChange={onChange} value={name} />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Create Category"
            onClick={addNewCategory}
            disabled={!name}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
