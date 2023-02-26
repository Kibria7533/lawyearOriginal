import React, { useState } from "react";
import { Modal } from "antd";
import { DrossierButton, DrossierInput } from "..";
import { UpdateSingleQuestionAnswer } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const AnswerModal = ({ ansModal, setAnsModal, data }) => {
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleInput = (e) => {
    setAns(e.target.value);
  };
  //modal close
  const handleClose = () => {
    console.log('hgh')
    setAns("");
    setAnsModal(false);
  };

  const dispatch = useDispatch();
  // handleSubmit
  const handleSubmit = async () => {
    setLoading(true);
    await dispatch(UpdateSingleQuestionAnswer({id: data?.id, ans, requestId:data?.requestId}))
    history.push(`/file/details/${data?.requestId}`)
    handleClose();
    setLoading(false);
  };
  return (
    <Modal
      className="add_question_modal"
      visible={ansModal}
      bodyStyle={{ borderRadius: "0.625rem", padding: "3.438rem" }}
      centered
      footer={null}
      title={null}
      onCancel={() => setAnsModal(false)}
      closable={false}
    >
      <div className="d-flex justify-content-center">
        <p className="modal_title">Answer The Question</p>
      </div>
      <DrossierInput
        placeHolder={data?.ques}
        value={ans}
        onChange={handleInput}
      />
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "1rem" }}
      >
        <div className="action_box text-center">
          <DrossierButton
           text="Answer"
           onClick={handleSubmit}
           disabled={!ans || loading}
           loading={loading}
          />
          <button
            style={{
              border: "none",
              background: "none",
              fontSize: "1rem",
              color: "#9d9d9d",
              marginTop: "0.978rem",
            }}
            onClick={() => setAnsModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default AnswerModal;
