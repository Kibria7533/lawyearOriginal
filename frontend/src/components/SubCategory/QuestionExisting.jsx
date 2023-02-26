import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteQuestionSubCategory } from "../../store/actions";
import UpdateQuestionModal from "./UpdateQuestionModal";
import QuestionDnd from "./QuestionDnd";
import QuestionInputExisting from "./QuestionInputExisting";
import {
  addQuestionSubcategory,
  deleteQuestionSubcategory,
  editQuestionSubcategory,
} from "../../services/subcategories";
import { getAuthData } from "../../util";

const Question = ({ questions, data, mutate }) => {
  const [questionId, setQuestionId] = useState("");
  const [questionData, setQuestionData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [inputField, setInputField] = useState(false);

  useEffect(() => {
    setQuestionData([...questions]);
  }, [questions.length, data]);

  const dispatch = useDispatch();
  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestionSubcategory(id, getAuthData().token);

      mutate();
    } catch (error) {}
  };

  const addQuestion = async (data) => {
    const res = await addQuestionSubcategory(data, getAuthData().token);
    mutate();
    setInputField(false);
    console.log(res);
  };

  const updateQuestion = async (data) => {
    const res = await editQuestionSubcategory(data, getAuthData().token);
    mutate();

    console.log(res);
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
        mutate={mutate}
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
        <QuestionInputExisting
          addQuestion={addQuestion}
          onClose={() => setInputField(false)}
          id={questionData.length + 1}
          handleDuplicate={handleDuplicate}
          updateQuestion={updateQuestion}
          data={data}
          mutate={mutate}
          onDelete={() => setInputField(false)}
        />
      )}
      {console.log(questions)}
    </div>
  );
};

export default Question;
