import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteQuestionSubCategory } from "../../store/actions";
import UpdateQuestionModal from "./UpdateQuestionModal";
import QuestionDnd from "./QuestionDnd";
import QuestionInput from "./QuestionInput";

const Question = ({ questions, data }) => {
  const [questionId, setQuestionId] = useState("");
  const [questionData, setQuestionData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [inputField, setInputField] = useState(false);

  useEffect(() => {
    setQuestionData([...questions]);
  }, [questions.length]);

  const dispatch = useDispatch();
  const handleDeleteQuestion = (id) => {
    try {
      dispatch(
        deleteQuestionSubCategory({
          id: id,
          subcategoryId: data?.id,
          categoryId: data?.categoryId,
        })
      );
    } catch (error) {}
  };

  const addQuestion = (data) => {
    // get max id
    const max = Math.max.apply(
      Math,
      questionData.map((item) => item.id)
    );

    //Delete options if type does not have options
    data.options.forEach((item) => {
      if (
        data.type !== "Multiple Choice" &&
        data.type !== "Checkboxes" &&
        data.type !== "Dropdown"
      ) {
        data.options = [];
      }
    });

    data.options = data.options.map((item) => ({ value: item }));
    data.id = max + 1;

    const newData = [...questionData, data];

    setQuestionData(newData);
    setInputField(false);
  };

  const updateQuestion = (data, idx) => {
    //Delete options if type does not have options
    data.options.forEach((item) => {
      if (
        data.type !== "Multiple Choice" &&
        data.type !== "Checkboxes" &&
        data.type !== "Dropdown"
      ) {
        data.options = [];
      }
    });

    data.options = data.options.map((item) => ({ value: item }));

    const id = questionData.find((item, index) => index === idx).id;
    data.id = id;

    const filteredArray = questionData.filter((item, index) => index !== idx);
    filteredArray.splice(idx, 0, data);

    setQuestionData(filteredArray);
    /* setInputField(false); */
  };

  const handleDuplicate = (question) => {
    setQuestionData([...questionData, question]);
  };

  return (
    <div className="question-list">
      <UpdateQuestionModal
        visible={visible}
        setVisible={setVisible}
        data={data}
        itemId={questionId}
        question={question}
      />
      <QuestionDnd
        questionData={questionData}
        setQuestionData={setQuestionData}
        setQuestion={setQuestion}
        setQuestionId={setQuestionId}
        setVisible={setVisible}
        handleDeleteQuestion={handleDeleteQuestion}
        subcategoryId={data?.id}
        categoryId={data?.categoryId}
        updateQuestion={updateQuestion}
        handleDuplicate={handleDuplicate}
      />
      {!inputField && (
        <p
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#455ECE",
            paddingTop: 20,
            cursor: "pointer",
          }}
          onClick={() => setInputField(true)}
        >
          Add a question
        </p>
      )}
      {inputField && (
        <QuestionInput
          addQuestion={addQuestion}
          onClose={() => setInputField(false)}
          id={questionData.length + 1}
          handleDuplicate={handleDuplicate}
          updateQuestion={updateQuestion}
        />
      )}
    </div>
  );
};

export default Question;
