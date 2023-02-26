import { MenuOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { subcategoryQuestionPositionUpdate } from "../../store/actions";
import SingleQuestion from "./SingleQuestion";

// const getItems = (count) =>
//   Array.from({ length: count }, (v, k) => k).map((k) => ({
//     id: `item-${k}`,
//     content: `item ${k}`,
//   }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: "10px 0",
  margin: `0 0 0 0`,
  background: isDragging ? "white" : "transparent",
  // borderBottom: "1px solid #bdd9eb",
  // borderTop: isDragging ? "1px solid #bdd9eb" : "none",
  // borderLeft: isDragging ? "1px solid #bdd9eb" : "none",
  // borderRight: isDragging ? "1px solid #bdd9eb" : "none",
  borderRadius: isDragging ? "10px" : "0",
  width: "100%",
  padding: isDragging ? "10px" : "0",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  //   background: isDraggingOver ? "lightblue" : "lightgrey",
  background: "transparent",
  padding: "0",
  width: "100%",
});

const QuestionDnd = ({
  questionData,
  setQuestionData,
  handleDeleteQuestion,
  setQuestionId,
  setQuestion,
  setVisible,
  categoryId,
  subcategoryId,
  handleDuplicate,
  updateQuestion,
  mutate,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dataDisplayed, setDataDisplayed] = useState([]);

  const onDragEnd = async (result) => {
    setLoading(true);
    if (!result.destination) {
      return;
    }

    const currentData = [...questionData];

    const items = reorder(
      questionData,
      result.source.index,
      result.destination.index
    );
    setQuestionData(items);
    const ids = items.map((item) => item.id);
    const res = await dispatch(
      subcategoryQuestionPositionUpdate({
        ids,
        categoryId,
        subcategoryId,
        items,
      })
    );
    if (res) {
      setLoading(false);
    } else {
      setQuestionData(currentData);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questionData) {
      const newArr = questionData.map((item) => ({
        ...item,
        options: item.options.map((item) => item?.value),
      }));

      setDataDisplayed(newArr);
    }
  }, [questionData]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <Spin spinning={loading}>
              {dataDisplayed?.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={`${question.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      // {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      className="single-ques "
                    >
                      <SingleQuestion
                        {...question}
                        type="SubCategory"
                        question={question}
                        dragHandleProps={provided.dragHandleProps}
                        showAction={
                          question.ques !== "First name" &&
                          question.ques !== "Last name" &&
                          question.ques !== "Email"
                        }
                        key={question.id}
                        idx={index + 1}
                        handleDuplicate={handleDuplicate}
                        updateQuestion={updateQuestion}
                        mutate={mutate}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </Spin>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default QuestionDnd;
