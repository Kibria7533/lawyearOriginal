import { notification } from "antd";
import React, { useState } from "react";
import { DrossierButton, DrossierInput } from "..";
import { createCategory } from "../../store/actions";
import QuestionInput from "./QuestionInput";
import SingleQuestion from "./SingleQuestion";
import { useHistory } from "react-router-dom";
import WouldYouCreateYourFirstSubCategoryModal from "./WouldYouCreateYourFirstSubCategoryModal";

const CreateCategories = () => {
  const [inputField, setInputField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestion] = useState(initialQues);
  const [categoryName, setCategoryName] = useState("");
  const [openRedirectSubCategory, setOpenRedirectSubCategory] = useState(false);
  const [categoryCreatedId, setCategoryCreatedId] = useState(null);
  const [categoryCreatedName, setCategoryCreatedName] = useState(null);

  const router = useHistory();

  const addQuestion = (data) => {
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

    const newData = [...questions, data];

    setQuestion(newData);
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

    const filteredArray = questions.filter((item, index) => index !== idx);
    filteredArray.splice(idx, 0, data);

    setQuestion(filteredArray);
    setInputField(false);
  };

  const handleDuplicate = (question) => {
    setQuestion([...questions, question]);
  };

  // delete single question
  const deleteSingleQues = (index) => {
    questions.splice(index, 1);
    setQuestion([...questions]);
  };
  const onEditQues = ({ ques, idx }) => {
    const newData = questions.map((item, id) => {
      if (id === idx) item = { ques };
      return item;
    });
    setQuestion([...newData]);
  };
  // create category
  const CreateCategoryFunction = async () => {
    setLoading(true);
    try {
      const res = await createCategory({
        name: categoryName,
        questions: questions,
      });
      if (res.success) {
        console.log();
        setCategoryName("");
        setQuestion(initialQues);
        /*   router.push("/category/list"); */
        setOpenRedirectSubCategory(true);
        setCategoryCreatedId(res?.category?.id);
        setCategoryCreatedName(res?.category?.name);
      }
      setLoading(false);
    } catch (error) {
      notification.warn({
        message: error.message || "Something went wrong",
        placement: "bottomRight",
      });
      setLoading(false);
    }
  };

  return (
    <div className="create-category">
      <div className="sub_create_category">
        <h3
          className="title_page_category d-block"
          style={{ marginBottom: "2rem" }}
        >
          Create new Category
        </h3>

        <div className="category-name">
          <DrossierInput
            className="create_category_input"
            labelShow
            placeHolder="Category Name"
            type="text"
            onChange={(e) => setCategoryName(e.target.value)}
            value={categoryName}
          />
        </div>

        <div className="information-title">
          <p>Personal Information Required For New Category</p>
        </div>
        <div>
          <div style={{ marginBottom: 6 }}>
            {questions.map((item, index) => (
              <SingleQuestion
                type="Category"
                question={item}
                updateQuestion={updateQuestion}
                variant="create"
                key={index}
                idx={index + 1}
                showAction={index !== 0 && index !== 1 && index !== 2}
                ques={item.ques}
                deleteSingleQues={deleteSingleQues}
                onEditQues={onEditQues}
                handleDuplicate={handleDuplicate}
              />
            ))}
          </div>
          <div className="text-left" style={{ marginBottom: "2.625rem" }}>
            {!inputField && (
              <p
                style={{
                  color: "#455ECE",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setInputField(true)}
              >
                Add a Question
              </p>
            )}
            {inputField && (
              <QuestionInput
                addQuestion={addQuestion}
                onClose={() => setInputField(false)}
                id={questions.length + 1}
                handleDuplicate={handleDuplicate}
              />
            )}
          </div>
          <div>
            <DrossierButton
              text="Create Category"
              loading={loading}
              disabled={
                categoryName.length === 0 || questions.length === 0 || loading
              }
              onClick={CreateCategoryFunction}
              style={{
                background:
                  categoryName.length === 0 ||
                  questions.length === 0 ||
                  loading === 0
                    ? "#B8C4F6"
                    : "",
                boxShadow:
                  categoryName.length === 0 ||
                  questions.length === 0 ||
                  loading === 0
                    ? "none"
                    : "",
              }}
            />
          </div>
        </div>
        {/* {console.log(questions, categoryName)} */}
      </div>
      <WouldYouCreateYourFirstSubCategoryModal
        visible={openRedirectSubCategory}
        setVisible={setOpenRedirectSubCategory}
        categoryName={categoryCreatedName}
        categoryCreatedId={categoryCreatedId}
      />
    </div>
  );
};

export default CreateCategories;

const initialQues = [
  { ques: "First name", type: "Short Answer", options: [] },
  { ques: "Last name", type: "Short Answer", options: [] },
  { ques: "Email", type: "Short Answer", options: [] },
];
