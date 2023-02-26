import { Checkbox, Collapse, Spin } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import QuestionInput from "./QuestionInput";
import SingleQuestion from "./SingleQuestion";

const { Panel } = Collapse;
const SelectCategories = ({
  questions,
  setQuestion,
  categoriesId,
  setCategoriesId,
  selectCategory,
  setSelectCategory,
  categoryLoading,
}) => {
  const [inputField, setInputField] = useState(false);

  const categories = useSelector((state) => state?.categories?.list);

  // delete single question
  const deleteSingleQues = (index) => {
    // const newData = questions.filter((item) => item.ques !== ques);
    questions.splice(index, 1);
    setQuestion([...questions]);
  };
  const onEditQues = ({ ques, idx }) => {
    const newData = questions.map((item, id) => {
      if (id === idx) item = { ques };
      return item;
    });
    console.log(newData, idx);
    // questions.splice(index, 1);
    setQuestion([...newData]);
  };

  const handleSelectCategory = (item, e) => {
    const { name, checked } = e.target;
    if (!checked) {
      delete selectCategory[name];
      setSelectCategory({ ...selectCategory });
      const newIds = categoriesId.filter((id) => id !== item.id);
      setCategoriesId([...newIds]);
    } else {
      setSelectCategory({ ...selectCategory, [name]: checked });
      const newIds = [...categoriesId, item.id];
      setCategoriesId(newIds);
    }
  };

  // add questions

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

  // const categorySelectedList = (
  //   <div className="d-flex">
  //     {Object.keys(selectCategory).length > 0 ? (
  //       Object.keys(selectCategory).map((item) => (
  //         <Checkbox key={item} checked>
  //           {item}
  //         </Checkbox>
  //       ))
  //     ) : (
  //       <p style={{ marginBottom: "0" }}>Select Category</p>
  //     )}
  //   </div>
  // );

  //New
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

  return (
    <div className="col-md-5">
      <div className="category-name category-collaps">
        <Spin spinning={categoryLoading}>
          <Collapse
            expandIconPosition="right"
            ghost
            expandIcon={({ isActive }) =>
              isActive ? (
                <img
                  src="/img/arrow_up.svg"
                  style={{ height: 4, width: 8 }}
                ></img>
              ) : (
                <img style={{ width: "10px" }} src="/img/arrow_down.svg"></img>
              )
            }
          >
            <Panel header={"Select Categories"} key="1">
              <div className="subcategory-list">
                {categories.map((item) => (
                  <div key={item.id} className="d-block single-category-name">
                    <Checkbox
                      onChange={(e) => handleSelectCategory(item, e)}
                      name={item.name}
                      value={selectCategory["test"]}
                    >
                      {item?.name}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </Panel>
          </Collapse>
        </Spin>
      </div>
      <div>
        <div className="document-list mb-4">
          <p className="title">Questions</p>
        </div>
        <div style={{ width: "24.125rem", marginBottom: "20px" }}>
          {questions.map((item, index) => (
            <SingleQuestion
              type="SubCategory"
              variant="create"
              key={index}
              idx={index + 1}
              // showAction={false}
              ques={item.ques}
              deleteSingleQues={deleteSingleQues}
              onEditQues={onEditQues}
              question={item}
              updateQuestion={updateQuestion}
              /* showAction={index !== 0 && index !== 1 && index !== 2} */
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
      </div>
    </div>
  );
};

export default SelectCategories;
