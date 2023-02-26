import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteSingleCategory } from "../../store/actions";
import { ConfirmationModal } from "../Shared";
import AddQuestionModal from "./AddQuestionModal";
import QuestionDnd from "./QuestionDnd";
// import SingleQuestion from "./SingleQuestion";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { Input } from "antd";
import QuestionInput from "./QuestionInput";
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import { ReactComponent as SvgEdit } from "../../assets/edit.svg";

const SingleCategoryDetails = ({ category }) => {
  const [visible, setVisible] = useState(false);
  const [addQuesVisible, setAddQuesVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(true);
  const [questionData, setQuestionData] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [inputField, setInputField] = useState(false);
  const dispatch = useDispatch();

  const { name, questions } = category;
  const onOpenModal = () => setVisible(true);
  const onCloseModal = () => {
    setVisible(false);
  };
  const onDelete = async () => {
    await dispatch(deleteSingleCategory(category.id));
    onCloseModal();
  };
  useEffect(() => {
    setCategoryName(name);
    setQuestionData(questions);
  }, [name, questions]);

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
    setInputField(false);
  };

  const handleDuplicate = (question) => {
    setQuestionData([...questionData, question]);
  };

  return (
    <React.Fragment>
      <ConfirmationModal
        title="Are you sure you want to delete selected category?"
        visible={visible}
        onOk={onDelete}
        onCancel={onCloseModal}
      />
      <AddQuestionModal
        title={category.name}
        categoryId={category.id}
        visible={addQuesVisible}
        setVisible={setAddQuesVisible}
      />
      {/*       <UpdateCategoryModal
        id={category.id}
        title={category.name}
        visible={categoryVisible}
        setVisible={setCategoryVisible}
      /> */}
      <div className="col-md-9 category_item">
        <div className="category_details">
          <div className="category_header">
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ marginBottom: 40 }}
            >
              <div
                className="d-flex align-items-center justify-content-between"
                style={{
                  border: "1px solid #455ECE",
                  height: 56,
                  width: "100%",
                  maxWidth: 420,
                  padding: "16px 16px 15px 11px",
                  borderRadius: 10,
                  fontWeight: "400",
                }}
              >
                {categoryVisible ? (
                  <h3 style={{ fontWeight: "400" }}>{categoryName}</h3>
                ) : (
                  <Input
                    placeholder="Category Name"
                    bordered={false}
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    style={{ padding: 0, fontSize: 18, fontWeight: "400" }}
                  />
                )}
                <div>
                  {!categoryVisible ? (
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#455ECE",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (categoryName.length > 0)
                          setCategoryVisible(!categoryVisible);
                      }}
                    >
                      Save
                    </p>
                  ) : (
                    /*      <img
                      src="/img/edit.svg"
                      alt="edit icon"
                      onClick={() => setCategoryVisible(!categoryVisible)}
                    /> */
                    <SvgEdit
                      onClick={() => setCategoryVisible(!categoryVisible)}
                      style={{ height: 14, width: 14, cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>
              <div className="d-flex category_details_right">
                <p className="delete_category" onClick={onOpenModal}>
                  Delete Category
                </p>
              </div>
            </div>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#1F295A" }}>
              Personal Information Required For New Category
            </p>
          </div>{" "}
          <QuestionDnd
            category={category}
            questionData={questionData}
            setQuestionData={setQuestionData}
            handleDuplicate={handleDuplicate}
            updateQuestion={updateQuestion}
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
          <div style={{ paddingBottom: "15rem" }}></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SingleCategoryDetails;
