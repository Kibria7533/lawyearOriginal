import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Popconfirm, Table } from "antd";
import AddSubcategoryQuesModal from "./AddSubcategoryQuesModal";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import UpdateSubcategoryQuesModal from "./UpdateSubcategoryQuesModal";
import QuestionInput from "./QuestionInput";
import { SET_SUBCATEGORY } from "../../store/constants";
import { useDispatch } from "react-redux";

const DragHandle = sortableHandle(({ step }) => (
  <div style={{ position: "absolute", top: step === 1 ? 10 : 20 }}>
    <MenuOutlined style={{ cursor: "grab", color: "#999" }} draggable={true} />
  </div>
));

const SortableItem = sortableElement((props) => {
  return <tr {...props} className="ant-table-cell " />;
});
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const SubcategoryQuesTable = ({
  selectedSubcategories,
  setSelectedSubcategories,
  name,
  questions,
  id,
  showCheckbox = true,
  step,
  ...rest
}) => {
  const [edit, setEdit] = useState({});
  const [visible, setVisible] = useState(false);
  const [beingEdited, setBeingEdited] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [inputField, setInputField] = useState(false);

  const dispatch = useDispatch();

  // drag and drop
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.id === id && oldIndex !== newIndex) {
        const newData = arrayMove(
          [].concat(subcategory.questions),
          oldIndex,
          newIndex
        ).filter((el) => !!el);
        subcategory.questions = newData;
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass={showCheckbox ? "row-dragging" : "row-dragging-1"}
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  // function findIndex base on Table rowKey props
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = questions.findIndex(
      (item) => item.id === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const onChangeQuestion = (questionNew, id) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.questions.find((item) => item.id === id)) {
        const questionData = subcategory.questions.map((question) => {
          if (question.id === id) {
            question.ques = questionNew.ques;
            question.type = questionNew.type;
            question.options = questionNew.options.map((item) => ({
              value: item,
            }));
          }
          return question;
        });
        subcategory.questions = questionData;
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);
  };

  const addQuestionOnSubcategory = (question) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.id === question.subcategoryId) {
        console.log(subcategory.questions);
        subcategory.questions = [
          ...subcategory.questions,
          {
            ...question,
            options: question?.options?.map((item) => ({ value: item })),
          },
        ];
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);

    dispatch({ type: SET_SUBCATEGORY, payload: data });
    setInputField(false);
  };

  // const
  const onDeleteQuestion = (id, subcategoryId) => {
    console.log(id, subcategoryId);
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.id === subcategoryId) {
        const questionData = subcategory.questions.filter(
          (question) => question.id !== id
        );
        subcategory.questions = questionData;
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);
  };

  const onSelectChange = (rowKeys) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (id === subcategory.id) {
        const questions = subcategory.questions?.map((question) => {
          const flag = rowKeys.find((id) => id === question.id);
          if (flag) question.selected = true;
          else question.selected = false;
          return question;
        });
        subcategory.questions = questions;
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);
    setSelectedRowKeys(rowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    renderCell: (_, __, index, originNode) => (
      <div
        className="d-flex align-items-start"
        style={{ position: "absolute", top: 10 }}
      >
        <span className="me-2">{index + 1}.</span>
        {showCheckbox && originNode}
      </div>
    ),
  };

  const questionColumns = [
    {
      title: "",
      render: () => <DragHandle step={step} />,
      className: "drag-visible",
      width: "1%",
    },

    {
      width: "100%",
      title: "All Questions",
      dataIndex: "age",
      render: (_, record) => (
        <div className="row_action">
          <QuestionInput
            question={{
              ...record,
              options: record?.options?.map((item) => item.value),
            }}
            updateQuestion={onChangeQuestion}
            id={record.id}
            handleCloseEdit={() => setBeingEdited(null)}
            onDelete={onDeleteQuestion}
            subcategoryId={id}
            handleClose={() => setInputField(false)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AddSubcategoryQuesModal
        data={{ id, name, ...rest }}
        visible={visible}
        setVisible={setVisible}
        addQuestionOnSubcategory={addQuestionOnSubcategory}
      />
      <UpdateSubcategoryQuesModal
        data={edit}
        visible={edit.subcategoryId === id}
        setVisible={setEdit}
        onUpdate={onChangeQuestion}
      />
      <Table
        className={!showCheckbox && "overview-table"}
        locale={{ emptyText: "No question selected or added" }}
        dataSource={questions}
        columns={questionColumns}
        pagination={false}
        rowSelection={rowSelection}
        rowKey={(row) => row.id}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
        style={{ marginTop: 0 }}
      />
      {inputField ? (
        <QuestionInput
          addQuestion={addQuestionOnSubcategory}
          onClose={() => setInputField(false)}
          id={Math.max(...questions.map((item) => item.id)) + 1}
          subcategoryId={id}
          position={
            selectedSubcategories.find((item) => item.id === id)?.questions
              ?.length
          }
          handleClose={() => setInputField(false)}
          newQuestion={true}
        />
      ) : (
        <p
          style={{
            marginTop: 16,
            color: "#455ECE",
            fontWeight: "700",
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => setInputField(true)}
        >
          Add a question
        </p>
      )}
    </div>
  );
};

export default SubcategoryQuesTable;
