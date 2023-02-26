import { MenuOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteQuestion } from "../../store/actions";
import QuestionInput from "./QuestionInput";
import UpdateQuestionModal from "./UpdateQuestionModal";
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import { ReactComponent as SvgEdit } from "../../assets/edit.svg";

const SingleQuestion = ({
  type,
  id,
  question,
  categoryName,
  categoryId,
  ques,
  idx,
  showAction = true,
  variant,
  deleteSingleQues,
  onEditQues,
  dragHandleProps,
  updateQuestion,
  handleDuplicate,
}) => {
  const [visible, setVisible] = useState(false);
  const [beingEdited, setBeingEdited] = useState(null);
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

  const types = [
    {
      name: "Short Answer",
      icon: "/img/shortAnswer.svg",
    },
    {
      name: "Paragraph",
      icon: "/img/paragraph.svg",
    },
    {
      name: "Multiple Choice",
      icon: "/img/mcq.png",
    },
    {
      name: "Checkboxes",
      icon: "/img/checkbox.svg",
    },
    {
      name: "Dropdown",
      icon: "/img/dropdown.svg",
    },
    {
      name: "Date",
      icon: "/img/date.svg",
    },
    {
      name: "Time",
      icon: "/img/time.svg",
    },
  ];

  const getIcon = (name) => {
    return types.find((item) => item?.name === name)?.icon;
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
      {!beingEdited && (
        <>
          <div className="d-flex align-items-start">
            <p
              style={{
                color: "#455ECE",
                padding: "0.45rem 0",
                marginTop: 1.5,
                height: 40,
              }}
            >
              {idx}.{" "}
            </p>
            <div
              className="single-ques d-flex justify-content-between "
              style={{ width: "100%" }}
            >
              <div className="d-flex align-items-start">
                <span
                  className="indexing d-inline-block d-flex align-items-center"
                  style={{ marginRight: "10px", marginTop: 3 }}
                >
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
                <div>
                  <div className="ques-title">{ques || ""}</div>
                  <MultipleChoice type={question?.type} question={question} />
                </div>
              </div>{" "}
              <div className="action" style={{ cursor: "pointer" }}>
                <Tooltip
                  placement="bottom"
                  color="#DBF1FF"
                  title={question?.type}
                  overlayInnerStyle={{ color: "#1F295A", fontWeight: 600 }}
                  overlayStyle={{ borderRadius: 4 }}
                >
                  <img src={getIcon(question?.type)} alt="fess" />{" "}
                </Tooltip>

                {(idx > 3 || type === "SubCategory") && (
                  <>
                    <Tooltip
                      placement="bottom"
                      color="#DBF1FF"
                      title="Edit"
                      overlayInnerStyle={{
                        color: "#1F295A",
                        fontWeight: 600,
                      }}
                      overlayStyle={{ borderRadius: 4 }}
                    >
                      <SvgEdit
                        onClick={() => setBeingEdited(idx)}
                        /*    style={{ height: 14, width: 14, cursor: "pointer" }} */
                        style={{ marginLeft: 24 }}
                      />
                    </Tooltip>
                    <Tooltip
                      title="Delete"
                      placement="bottom"
                      color="#DBF1FF"
                      overlayInnerStyle={{
                        color: "#1F295A",
                        fontWeight: 600,
                      }}
                      overlayStyle={{ borderRadius: 4 }}
                    >
                      <SvgDelete
                        onClick={onDelete}
                        style={{ marginLeft: 10 }}
                      />
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {beingEdited && (
        <QuestionInput
          question={question}
          updateQuestion={updateQuestion}
          id={idx}
          handleCloseEdit={() => setBeingEdited(null)}
          handleDuplicate={handleDuplicate}
          onDelete={onDelete}
        />
      )}
    </>
  );
};
export default SingleQuestion;

const MultipleChoice = ({ question }) => {
  if (question?.options?.length > 0)
    return (
      <div style={{ padding: "12px 0 20px 0" }}>
        {question?.options?.map((item, index) => (
          <div
            className="d-flex align-items-center"
            style={{ gap: 4, padding: "5px 0" }}
          >
            {question?.type === "Dropdown" && <p>{index + 1}.</p>}
            {question?.type === "Checkboxes" && (
              <img
                src="/img/checkbox_gray.svg"
                style={{ width: 16, height: 16 }}
              />
            )}
            {question?.type === "Multiple Choice" && (
              <img
                src="/img/circle_gray.svg"
                style={{ width: 16, height: 16 }}
              />
            )}
            <p style={{ color: "#1F295A", fontWeight: "600" }}>{item}</p>
          </div>
        ))}
      </div>
    );

  return <></>;
};
