import { MenuOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteQuestion } from "../../store/actions";
import UpdateQuestionModal from "./UpdateQuestionModal";

const SingleQuestionDocument = ({
  id,
  categoryName,
  categoryId,
  ques,
  idx,
  showAction = true,
  variant,
  deleteSingleQues,
  onEditQues,
  dragHandleProps,
}) => {
  const [visible, setVisible] = useState(false);
  // const onOpenModal = () => setVisible(true);
  const dispatch = useDispatch();
  const onCloseModal = () => {
    setVisible(false);
  };
  const onDelete = async () => {
    if (variant === "create") {
      deleteSingleQues(idx - 1);
      return;
    }
    await dispatch(deleteQuestion({ id, categoryId }));
    onCloseModal();
  };
  const onEdit = (ques) => {
    onEditQues({ ques, idx: idx - 1 });
  };
  return (
    <>
      <UpdateQuestionModal
        questionId={id}
        title={ques}
        title1={categoryName}
        categoryId={categoryId}
        visible={visible}
        setVisible={setVisible}
        variant={variant}
        onEdit={onEdit}
      />
      <div className="single-ques d-flex justify-content-between align-items-center">
        <div className=" d-flex align-items-center">
          <span
            className="indexing d-inline-block d-flex align-items-center"
            style={{ marginRight: "10px" }}
          >
            {idx}.{" "}
            {dragHandleProps && showAction && (
              <MenuOutlined
                {...dragHandleProps}
                style={{
                  cursor: "grab",
                  color: "rgb(123 126 136)",
                  marginLeft: "10px",
                }}
              />
            )}
          </span>
          <div className="ques-title">{ques || ""}</div>
        </div>
        {showAction && (
          <div className="action" style={{ cursor: "pointer" }}>
            <img
              src="/img/edit-icon.png"
              alt="fess"
              onClick={() => setVisible(true)}
            />
            <img src="/img/delete-icon.png" alt="fess" onClick={onDelete} />
          </div>
        )}
      </div>
    </>
  );
};
export default SingleQuestionDocument;
