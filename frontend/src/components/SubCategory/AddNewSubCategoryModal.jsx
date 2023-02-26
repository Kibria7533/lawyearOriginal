import { Checkbox, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import {
  createSubcategory,
  updateRelationCategorySubcategory,
} from "../../services/subcategories";
import { updateDocument } from "../../store/actions";
import { getAuthData } from "../../util";

const AddNewSubCategoryModal = ({
  visible,
  setVisible,
  data,
  mutate,
  setActiveItem,
  setSubcategoryId,
  setSubcategoryData,
  categoryCreatedId,
}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoryCreatedId) {
      setCategories([...categories, { id: Number(categoryCreatedId) }]);
    }
  }, [categoryCreatedId]);

  const onChange = (item) => {
    if (categories.find((element) => element.id === item.id)) {
      const arr = categories.filter((element) => element.id !== item.id);
      setCategories(arr);
    } else {
      setCategories([...categories, item]);
    }
  };

  const onClick = async () => {
    setLoading(true);
    const dataSent = {
      name: "",
      categoryId: categories.map((item) => item.id),
      questions: [],
      documents: [],
    };

    const res = await createSubcategory(dataSent, getAuthData().token);
    if (res?.status === 201) {
      await mutate();
      setActiveItem(categories.map((item) => item.id)[0]);
      setSubcategoryId(res?.data?.subcategories?.id);
      setSubcategoryData({
        id: res?.data?.subcategories?.id,
        name: "",
        questions: [],
        documents: [],
      });
    }
    setCategories([]);
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
      bodyStyle={{ borderRadius: "0.625rem", padding: "3.438rem" }}
    >
      <p
        style={{
          fontSize: 18,
          lineHeight: "24.55px",
          marginBottom: 28,
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        Select the Category/Categories to which the new Sub-Category will belong
      </p>
      <div
        style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}
      >
        <div style={{ minWidth: 150 }}>
          {data?.map((item) => (
            <div key={item.id} style={{ marginBottom: 10 }}>
              <Checkbox
                checked={categories.find((element) => element.id === item.id)}
                onChange={() => onChange(item)}
                style={{ color: "#1F295A", fontSize: 16, fontWeight: "600" }}
              >
                {item.name}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Create a Sub-Category"
            onClick={onClick}
            loading={loading}
            style={{ width: 300, height: 52, padding: "16px 32px" }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddNewSubCategoryModal;
