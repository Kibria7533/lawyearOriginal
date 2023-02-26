import { CheckOutlined, CloseOutlined, MenuOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Select, notification } from "antd";
import QuestionInput from "../Category/QuestionInput";
import {
  SET_CATEGORY_WITH_SUBCATEGORY_AND_QUESTION,
  SET_SUBCATEGORY_LIST,
} from "../../store/constants";
import {
  addQuestion,
  fetchAllSubcategoryWithCategory,
} from "../../store/actions";
import { ConfirmationModal } from "../Shared";
import { DrossierButton, DrossierInput } from "..";
import AddCategoryQuesModal from "./AddCategoryQuesModal";
import {
  arrayMove,
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import EditCategoryQuesModal from "./EditCategoryQuesModal";
import ProcessBar from "./ProcessBar";

const DragHandle = sortableHandle(() => (
  <div className="mx-2">
    <MenuOutlined style={{ cursor: "grab", color: "#999" }} draggable={true} />
  </div>
));

const SortableItem = sortableElement((props) => {
  return <tr {...props} className="ant-table-cell " />;
});
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const OverviewCategoryTable = ({
  selectedCategory,
  setSelectedCategory,
  createLoading,
  onCreateClient,
}) => {
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [ques, setQues] = useState("");
  const [loading, setLoading] = useState(false);
  const [addQuesLoading, setAddQuestionLoading] = useState(false);
  const [edit, setEdit] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [questions, setQuestions] = useState([]);
  // const
  const dispatch = useDispatch();
  // useEffect(()=>{},[selectedCategory.questions])
  // drag and drop
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (newIndex === 0 || newIndex === 1 || newIndex === 1) return;
    if (oldIndex !== newIndex) {
      const newData = arrayMove(
        [].concat(selectedCategory.questions),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      selectedCategory.questions = newData;
    }
    setSelectedCategory({ ...selectedCategory });
  };
  // on chnage category
  const onAddQuestion = async (addToCategory) => {
    selectedCategory.questions.push({ id: Date.now(), ques, selected: true });
    setSelectedCategory({
      ...selectedCategory,
      questions: [...selectedCategory.questions],
    });
    if (addToCategory) {
      setAddQuestionLoading(true);
      await dispatch(addQuestion({ ques, categoryId: selectedCategory.id }));
      setAddQuestionLoading(false);
    }
    setVisible1(false);
    setVisible(false);
  };
  const onChangeQuestion = ({ value, id }) => {
    const questions = selectedCategory.questions.map((item) => {
      if (item.id === id) item.ques = value;
      return item;
    });
    setSelectedCategory({ ...selectedCategory, questions });
  };
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
  const onChangeClientAnswer = (e) => {
    const { name, value } = e.target;
    setSelectedCategory({ ...selectedCategory, [name]: value });
  };

  const rowSelection = {
    selectedRowKeys,
    // onChange: onSelectChange,
    renderCell: (_, __, idx) => <span className="indexing">{idx + 1}.</span>,
  };

  const columns = [
    {
      width: "100%",
      /*    title: (
        <img
          className="header_logo"
          src="/img/plus-logo.png"
          onClick={() => setVisible1(true)}
        />
      ), */
      dataIndex: "ques",
      key: "ques",
      render: (ques, { id }, idx) => (
        <div>
          <div className="qustion_and_icon">
            {ques !== "First name" &&
              ques !== "Last name" &&
              ques !== "Email" && <DragHandle />}
            <input
              // onBlur={() => setEdit("")}
              readOnly
              className={`table_data`}
              value={ques}
              // onChange={(e) => onChangeQuestion({ value: e.target.value, id })}
            />
            {ques !== "Last name" && ques !== "First name" && ques !== "Email" && (
              <div className="row_action">
                {/* {edit === id ? (
                  <CheckOutlined onClick={() => setEdit("")} />
                ) : (
                  <> */}
                <img
                  className="edit_icon"
                  src="/img/edit.svg"
                  alt="edit icon"
                  onClick={() => onEditQuestion(id)}
                />
                {/* </>
                )} */}
                <img
                  src="/img/delete.svg"
                  alt="fess"
                  onClick={() => onDeleteQuestion(id)}
                />
              </div>
            )}
          </div>
          {/* <DrossierInput
            placeHolder="Answer"
            labelShow={true}
            name={ques}
            value={selectedCategory[ques]}
            onChange={onChangeClientAnswer}
          /> */}
        </div>
      ),
    },
  ];

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass={"row-dragging-create"}
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  // function findIndex base on Table rowKey props
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = selectedCategory.questions.findIndex(
      (item) => item.id === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };
  return (
    <div className="row">
      <EditCategoryQuesModal
        selectedCategory={selectedCategory}
        visible={edit}
        setVisible={setEdit}
        addQuestion={onChangeQuestion}
      />
      <AddCategoryQuesModal
        name={selectedCategory.name}
        visible={visible1}
        setVisible={setVisible1}
        ques={ques}
        setQues={setQues}
        addQuestion={setVisible}
      />
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
      <ProcessBar step={3} />
      <div className="col-md-12 mt-3">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <p className="selected_category_title">
            Selected Category: {selectedCategory.name}
          </p>
          <DrossierButton
            loading={createLoading}
            text="Send"
            onClick={onCreateClient}
          />
        </div>

        <div
          style={{
            margin: "1.563rem 0 5px",
            borderBottom: "1px solid #CDCDCD",
          }}
        ></div>
      </div>
      {selectedCategory?.questions?.length > 0 && (
        <div className="col-md-12">
          <Table
            id="overview_category_questions"
            // className="category_questions"
            locale={{ emptyText: "No question selected or added" }}
            dataSource={
              selectedCategory?.questions?.filter((item) => item.selected) || []
            }
            columns={columns}
            pagination={false}
            rowSelection={rowSelection}
            rowKey={({ id }) => id}
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
          />
        </div>
      )}
      <div
        style={{ margin: "1.563rem 0 5px", borderBottom: "1px solid #CDCDCD" }}
      ></div>
    </div>
  );
};

export default OverviewCategoryTable;
