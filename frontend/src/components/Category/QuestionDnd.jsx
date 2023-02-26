import { Spin } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { questionPositionUpdate } from "../../store/actions";
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
  padding: "0",
  margin: `0 0 0 0`,
  background: isDragging ? "white" : "transparent",
  borderBottom: "1px solid #bdd9eb",
  // borderTop: isDragging ? "1px solid #bdd9eb" : "none",
  // borderLeft: isDragging ? "1px solid #bdd9eb" : "none",
  // borderRight: isDragging ? "1px solid #bdd9eb" : "none",
  width: "100%",
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
  category,
  handleDuplicate,
  updateQuestion,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dataDisplayed, setDataDisplayed] = useState([]);

  const onDragEnd = async (result) => {
    if (
      !result.destination ||
      result.destination.index === 0 ||
      result.destination.index === 1 ||
      result.destination.index === 2
    ) {
      return;
    }
    setLoading(true);

    const currentData = [...questionData];

    const items = reorder(
      questionData,
      result.source.index,
      result.destination.index
    );

    setQuestionData(items);
    const ids = items.map((item) => String(item.id));
    const res = await dispatch(
      questionPositionUpdate({
        ids,
        items,
        categoryId: category.id,
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
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <Spin spinning={loading}>
              {dataDisplayed?.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={`${item.id}`}
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
                    >
                      <SingleQuestion
                        type="Category"
                        {...item}
                        question={item}
                        dragHandleProps={provided.dragHandleProps}
                        showAction={
                          item.ques !== "First name" &&
                          item.ques !== "Last name" &&
                          item.ques !== "Email"
                        }
                        key={item.id}
                        idx={index + 1}
                        categoryId={category.id}
                        categoryName={category.name}
                        handleDuplicate={handleDuplicate}
                        updateQuestion={updateQuestion}
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
