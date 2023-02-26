import { Checkbox, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { updateRelationCategorySubcategory } from "../../services/subcategories";
import { updateDocument } from "../../store/actions";
import { getAuthData } from "../../util";

const UpdateDocumentModal = ({
  itemId,
  visible,
  setVisible,
  data,
  activeCategories,
  documentName,
  mutate,
  subcategoryData,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [inCommonElements, setInCommonElements] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    function getArraysIntersection(arrayOne, arrayTwo) {
      return arrayOne.filter(function (n) {
        return arrayTwo.indexOf(n) !== -1;
      });
    }
    setInCommonElements(getArraysIntersection(data, activeCategories));
  }, [data, activeCategories]);

  const onChange = (item) => {
    if (inCommonElements.find((element) => element.id === item.id)) {
      const arr = inCommonElements.filter((element) => element.id !== item.id);
      setInCommonElements(arr);
    } else {
      setInCommonElements([...inCommonElements, item]);
    }
  };

  console.log(inCommonElements);

  const onClick = async () => {
    setLoading(true);
    const dataSent = {
      subcategory_id: subcategoryData.id,
      category_ids: inCommonElements.map((item) => item.id),
    };

    const res = await updateRelationCategorySubcategory(
      dataSent,
      getAuthData().token
    );
    if (res?.status === 201) mutate();
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
                checked={inCommonElements.find(
                  (element) => element.id === item.id
                )}
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
            text="Next"
            onClick={onClick}
            loading={loading}
            style={{ width: 220 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateDocumentModal;
