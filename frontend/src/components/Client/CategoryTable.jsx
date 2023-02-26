import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Select, notification, Checkbox } from "antd";
import QuestionInput from "./QuestionInputCategoryTable";
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import { ReactComponent as SvgEdit } from "../../assets/edit.svg";
import { DrossierButton } from "..";
import {
  SET_CATEGORY_WITH_SUBCATEGORY_AND_QUESTION,
  SET_SUBCATEGORY_LIST,
} from "../../store/constants";
import {
  addQuestion,
  fetchAllSubcategoryWithCategory,
} from "../../store/actions";
import { ConfirmationModal } from "../Shared";
import { DrossierInput } from "..";
import TypeOfFieldInput from "../MyFile/TypeOfInputFieldAddClient";
import ProcessBar from "./ProcessBar";

const getSelectedRows = ({ questions }) => {
  const data = questions?.map((item) => {
    if (
      item.ques === "First name" ||
      item.ques === "Last name" ||
      item.ques === "Email"
    )
      return item.id;
  });
  console.log(data);
  return data || [];
};

const CategoryTable = ({
  selectedCategory,
  setSelectedCategory,
  disabled,
  setStep,
  step,
}) => {
  const [visible, setVisible] = useState(false);
  const [ques, setQues] = useState("");
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);
  const [addQuesLoading, setAddQuestionLoading] = useState(false);
  const [edit, setEdit] = useState("");
  const [inputField, setInputField] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState(
    getSelectedRows({ ...selectedCategory })
  );
  const [selectedRowKeysStart, setSelectedRowKeysStart] = useState(
    getSelectedRows({ ...selectedCategory })
  );
  // const
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.subcategories?.list || []);
  const { Option } = Select;

  // setting question selected or not
  const onSelectChange = (rowKeys) => {
    console.log(rowKeys);
    const questions = selectedCategory.questions?.map((question, idx) => {
      const flag = rowKeys.find((id) => id === question.id);
      if (flag) question.selected = true;
      else question.selected = false;
      if (idx === 0 || idx === 1 || idx === 2) {
        question.selected = true;
        rowKeys.push(question.id);
      }
      return question;
    });
    setSelectedCategory({ ...selectedCategory, questions });
    setSelectedRowKeys(rowKeys);
  };
  // setting all category with subcategory, question and documents
  const GetAllSubcategories = async () => {
    setLoading(true);
    const data = await fetchAllSubcategoryWithCategory();
    dispatch({
      type: SET_SUBCATEGORY_LIST,
      payload: data?.category,
    });
    setLoading(false);
  };
  useEffect(() => {
    GetAllSubcategories();
  }, []);
  // on chnage category
  const onChangeCategory = (_, { category }) => {
    // console.log(category)
    const rowKey = [];
    const questions = category.questions?.map((question, idx) => {
      if (
        question.ques === "First name" ||
        question.ques === "Last name" ||
        question.ques === "Email"
      ) {
        question.selected = true;
        rowKey.push(question.id);
      }
      return question;
    });
    setSelectedRowKeys(rowKey);
    setSelectedCategory({ ...category, questions });
  };
  const onAddQuestion = async (addToCategory) => {
    selectedCategory.questions.push({ id: Date.now(), ...ques });
    setSelectedCategory({
      ...selectedCategory,
      questions: [...selectedCategory.questions],
    });
    if (addToCategory) {
      setAddQuestionLoading(true);
      await dispatch(addQuestion({ ...ques, categoryId: selectedCategory.id }));
      setAddQuestionLoading(false);
    }
    setVisible(false);
    setInputField(false);
  };
  const onChangeQuestion = (value, id) => {
    const questions = selectedCategory.questions.map((item) => {
      if (item.id === id)
        item = {
          ...value,
          id,
        };
      return item;
    });
    setSelectedCategory({ ...selectedCategory, questions });
  };

  console.log(selectedCategory.questions);
  //   console.log(selectedCategory);
  const onEditQuestion = (questionId) => {
    setEdit(questionId);
  };
  const onDeleteQuestion = (questionId) => {
    const questions = selectedCategory.questions.filter(
      (item) => item.id !== questionId
    );
    setSelectedCategory({ ...selectedCategory, questions });
  };
  const onChangeClientAnswer = (name, value) => {
    /*   const { name, value } = e.target; */
    setSelectedCategory({ ...selectedCategory, [name]: value });
  };
  console.log(selectedCategory);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getStyle = (ques) => {
    if (
      (ques === "First name" || ques === "Last name" || ques === "Email") &&
      !selectedCategory[ques]
    ) {
      return { borderColor: "rgb(233, 70, 20)" };
    }
  };
  const columns = [
    {
      width: "100%",
      title: "All Questions",
      dataIndex: "ques",
      key: "ques",
      render: (ques, question, idx) => (
        <div>
          <div className="qustion_and_icon">
            {/*      <input
              onBlur={() => setEdit("")}
              readOnly={edit !== question.id}
              className={`table_data ${edit === question.id && "editable"}`}
              value={ques}
              onChange={(e) =>
                onChangeQuestion({ value: e.target.value, id: question.id })
              }
            /> */}
            {/*        {ques !== "Last name" && ques !== "First name" && ques !== "Email" && (
              <div className="row_action">
                {edit === question.id ? (
                  <CheckOutlined onClick={() => setEdit("")} />
                ) : (
                  <>
                    <SvgEdit
                      onClick={() => onEditQuestion(question.id)}
                      style={{ marginRight: 10 }}
                    />
                  </>
                )}

                <SvgDelete onClick={() => onDeleteQuestion(question.id)} />
              </div>
            )} */}
          </div>
        </div>
      ),
    },
  ];

  const loadingArray = [
    {
      id: 1,
      position: 1,
      ques: "First name",
      type: "Short Answer",
      options: [],
    },
    {
      id: 2,
      position: 2,
      ques: "Last name",
      type: "Short Answer",
      options: [],
    },
    {
      id: 3,
      position: 3,
      ques: "Email",
      type: "Short Answer",
      options: [],
    },
  ];

  return (
    <div className="">
      <ProcessBar step={0} />
      <ConfirmationModal
        visible={visible}
        setVisible={setVisible}
        onCancel={() => onAddQuestion()}
        onOk={() => onAddQuestion(true)}
        title="Do you want to add this question to this category for all clients?"
        okText="Yes"
        cencelText="No, For this client only"
        className="client_confirmation"
      />
      <div className="">
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <p className="select_title" style={{ marginBottom: 20 }}>
                Choose Category
              </p>
              <Select
                placeholder="Category"
                onChange={onChangeCategory}
                className="category_selector"
                loading={loading}
                value={selectedCategory.id}
                suffixIcon={
                  <img src="/img/arrow_down_gray.svg" style={{ width: 12 }} />
                }
              >
                {categoryList?.map((category) => (
                  <Option
                    className="category_selector_option"
                    key={category.id}
                    value={category.id}
                    category={category}
                  >
                    {category.name}
                  </Option>
                ))}
              </Select>{" "}
            </div>
            <DrossierButton
              text="Continue"
              disabled={disabled}
              className="mt-4"
              onClick={() => {
                setStep(step + 1);
              }}
              style={{ opacity: disabled && "50%" }}
            />
          </div>
        </div>
        <p style={{ marginTop: 40, fontSize: 18, color: "#1F295A" }}>
          Personal Information Required For The Selected Category Copy
        </p>
      </div>

      {/* Before choosing */}
      {!selectedCategory?.questions && (
        <div style={{ maxWidth: 700 }}>
          {loadingArray?.map((question, idx) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <p
                  style={{
                    color: "#455ECE",
                    fontSize: 18,
                    marginRight: 20,
                    marginTop: 12,
                  }}
                >
                  {idx + 1}.
                </p>

                <TypeOfFieldInput
                  data={{
                    ...question,
                    questionType: question.type,
                    options: question.options.map((item) => item.value),
                  }}
                  ans={""}
                  setAns={onChangeClientAnswer}
                  disabled={true}
                />
              </div>
            </div>
          ))}
          <p
            style={{
              color: "#455ECE",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "0",
              marginTop: 20,
              opacity: "50%",
              cursor: "not-allowed",
            }}
          >
            Add a Question
          </p>
        </div>
      )}

      <div style={{ maxWidth: 700 }}>
        {selectedCategory?.questions?.slice(0, 3)?.map((question, idx) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <p
                style={{
                  color: "#455ECE",
                  fontSize: 18,
                  marginRight: 20,
                  marginTop: 12,
                }}
              >
                {idx + 1}.
              </p>

              <TypeOfFieldInput
                data={{
                  ...question,
                  questionType: question.type,
                  options: question.options.map((item) => item.value),
                }}
                ans={selectedCategory[question.ques] || ""}
                setAns={onChangeClientAnswer}
                disabled={false}
              />
            </div>
          </div>
        ))}

        {selectedCategory?.questions?.length > 3 && (
          <div style={{ width: "100%", margin: "28px 0 14px 35px" }}>
            <Checkbox
              checked={selectedCategory?.questions?.every((item) =>
                selectedRowKeys.find((element) => element === item.id)
              )}
              onChange={() => {
                if (
                  selectedCategory?.questions?.every((item) =>
                    selectedRowKeys.find((element) => element === item.id)
                  )
                ) {
                  setSelectedRowKeys(selectedRowKeysStart);
                  onSelectChange(selectedRowKeysStart);
                } else {
                  const newArr = selectedCategory?.questions?.map(
                    (item) => item.id
                  );
                  setSelectedRowKeys(newArr);
                  onSelectChange(newArr);
                }
              }}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontSize: 16, color: "#9D9D9D" }}>
              All Questions
            </span>
          </div>
        )}
        {selectedCategory?.questions?.slice(3, 10000)?.map((question, idx) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                padding: "10px 0",
                borderBottom: "1px solid #BDD9EB",
              }}
            >
              <p
                style={{
                  color: "#455ECE",
                  fontSize: 18,
                  marginRight: 20,
                }}
              >
                {idx + 4}.
              </p>
              <Checkbox
                checked={Boolean(
                  selectedRowKeys.find((item) => item === question.id)
                )}
                onChange={() => {
                  if (
                    Boolean(
                      selectedRowKeys.find((item) => item === question.id)
                    )
                  ) {
                    const newArr = selectedRowKeys.filter(
                      (item) => item !== question.id
                    );
                    setSelectedRowKeys(newArr);
                    onSelectChange(newArr);
                  } else {
                    onSelectChange([...selectedRowKeys, question.id]);
                    setSelectedRowKeys([...selectedRowKeys, question.id]);
                  }
                }}
                style={{ marginRight: 8 }}
              />
              <QuestionInput
                question={{
                  ...question,
                  options: question?.options?.map((item) => item.value),
                }}
                updateQuestion={onChangeQuestion}
                id={question.id}
                onDelete={onDeleteQuestion}
                index={selectedCategory?.questions?.length + 1}
              />
            </div>
          </div>
        ))}
      </div>

      {Object.keys(selectedCategory).length > 1 && (
        <div className="mt-3" style={{ maxWidth: 700 }}>
          {!inputField && (
            <p
              style={{
                color: "#455ECE",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: 20,
              }}
              onClick={() => setInputField(true)}
            >
              Add a Question
            </p>
          )}
          {inputField && (
            <QuestionInput
              onClose={() => {
                console.log("onClose");
                setInputField(false);
              }}
              addQuestion={(data) => {
                const dataSent = {
                  ...data,
                  options: data?.options?.map((item) => ({ value: item })),
                  id:
                    Math.max(
                      ...selectedCategory?.questions.map((item) => item.id)
                    ) + 1,
                };

                setQues(dataSent);
                setVisible(true);
              }}
              handleClose={() => setInputField(false)}
              index={selectedCategory?.questions?.length + 1}
              newQuestion={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
