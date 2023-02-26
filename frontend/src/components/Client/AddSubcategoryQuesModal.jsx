import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { addQuestionSubcategory } from "../../store/actions";
import { ConfirmationModal } from "../Shared";

const AddSubcategoryQuesModal = ({
  data,
  visible,
  setVisible,
  addQuestionOnSubcategory,
}) => {
  const [ques, setQues] = useState("");
  const [conVisible, setConVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  /*   useEffect(() => {
    setQues(data?.ques || "");
  }, [visible, data]); */
  /*   const onChange = (e) => setQues(e.target.value); */

  const onAddQuestion = async (flag) => {
    setConVisible(false);
    setLoading(true);
    if (flag) {
      const returnData = await dispatch(
        addQuestionSubcategory({
          ...data,
          shouldDispatch: false,
        })
      );
      if (returnData) {
        addQuestionOnSubcategory(data);
      }
    } else {
      addQuestionOnSubcategory({
        ...data,
        id: Date.now(),
      });
    }
    // console.log(returnData);
    setLoading(false);
    setVisible(false);
  };

  return (
    <>
      <ConfirmationModal
        visible={visible}
        setVisible={setVisible}
        onCancel={() => {
          onAddQuestion();
        }}
        onOk={() => {
          onAddQuestion(true);
        }}
        title="Do you want to add this question to this subcategory for all clients?"
        okText="Yes"
        cencelText="No, For this client only"
        className="client_confirmation"
      />
    </>
  );
};

export default AddSubcategoryQuesModal;
