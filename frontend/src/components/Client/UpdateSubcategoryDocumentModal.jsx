import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { addQuestionSubcategory } from "../../store/actions";
import { ConfirmationModal } from "../Shared";

const UpdateSubcategoryDocumentModal = ({
  data,
  visible,
  setVisible,
  onUpdate,
}) => {
  const [ques, setQues] = useState(data.name);
  useEffect(() => {
    if (data.name) setQues(data.name);
  }, [data]);
  const onChange = (e) => {
    const { value } = e.target;
    setQues(value);
  };
  return (
    <Modal
      visible={visible}
      className="add_question_modal"
      centered
      footer={null}
      title={null}
      onCancel={() => setVisible({})}
      bodyStyle={{ borderRadius: "0.625rem", padding: "3.438rem" }}
    >
      <DrossierInput placeHolder="Question" onChange={onChange} value={ques} />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Update Document"
            onClick={() => {
              setVisible({});
              onUpdate({ ...data, value: ques });
            }}
            disabled={!ques}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateSubcategoryDocumentModal;
