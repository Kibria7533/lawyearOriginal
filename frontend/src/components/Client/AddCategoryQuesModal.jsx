import { Modal } from "antd";
import React from "react";
import { DrossierButton, DrossierInput } from "..";

const AddCategoryQuesModal = ({
  ques,
  setQues,
  visible,
  setVisible,
  addQuestion,
  name,
}) => {
  const onChange = (e) => setQues(e.target.value);
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
      <div className="d-flex justify-content-center">
        <p className="modal_title">{name}</p>
      </div>
      <DrossierInput placeHolder="Question" onChange={onChange} value={ques} />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Add Question"
            onClick={() => addQuestion(true)}
            disabled={!ques}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryQuesModal;
