import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { addQuestion } from "../../store/actions";

const AddQuestionModal = ({ categoryId, title, visible, setVisible }) => {
  const [ques, setQues] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setQues("");
  }, [visible]);
  const onChange = (e) => setQues(e.target.value);
  const onClick = async () => {
    setLoading(true);
    await dispatch(addQuestion({ ques, categoryId }));
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
      <div className="d-flex justify-content-center">
        <p className="modal_title">{title}</p>
      </div>
      <DrossierInput placeHolder="Question" onChange={onChange} value={ques} />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Add a Question"
            onClick={onClick}
            disabled={!ques}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddQuestionModal;
