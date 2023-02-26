import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { updateCategoryName } from "../../store/actions";

const UpdateCategoryModal = ({ id, title, visible, setVisible }) => {
  const [ques, setQues] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setQues(title || "");
  }, [visible, title]);
  const onChange = (e) => setQues(e.target.value);
  const onClick = async () => {
    setLoading(true);
    await dispatch(updateCategoryName({ id, name: ques }));
    setLoading(false);
    setVisible(false);
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
      {/* <div className="d-flex justify-content-center">
        <p className="modal_title">{title1}</p>
      </div> */}
      <DrossierInput
        placeHolder="Category name"
        onChange={onChange}
        value={ques}
      />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Update Category"
            onClick={onClick}
            disabled={!ques}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateCategoryModal;
