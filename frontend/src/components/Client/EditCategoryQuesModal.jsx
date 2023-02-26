import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { DrossierButton, DrossierInput } from "..";

const EditCategoryQuesModal = ({
  selectedCategory,
  visible,
  setVisible,
  addQuestion,
}) => {
  const [ques, setQues] = useState("");
  const onChange = (e) => setQues(e.target.value);
  const onAddQuestion = () => {
    addQuestion({ value: ques, id: visible });
    setVisible("");
  };
  useEffect(() => {
    const data = selectedCategory.questions?.find(
      (item) => String(item.id) === String(visible)
    );
    setQues(data?.ques || "");
    // console.log(data,selectedCategory)
  }, [visible]);
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
      <DrossierInput placeHolder="Question" onChange={onChange} value={ques} />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Update Question"
            onClick={onAddQuestion}
            disabled={!ques}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditCategoryQuesModal;
