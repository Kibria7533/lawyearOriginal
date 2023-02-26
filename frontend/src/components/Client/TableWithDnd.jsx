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

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} draggable={true} />
));

const SortableItem = sortableElement((props) => {
  return <tr {...props} className="ant-table-cell " />;
});
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const TableWithDnd = ({
  selectedSubcategories,
  setSelectedSubcategories,
  name,
  questions,
  id,
  showCheckbox = true,
  ...rest
}) => {
  const [edit, setEdit] = useState({});
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
      helperClass="row-dragging"
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

  const onChangeQuestion = ({ value, id, subcategoryId }) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.id === subcategoryId) {
        const questionData = subcategory.questions.map((question) => {
          if (question.id === id) question.ques = value;
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
        subcategory.questions = [...subcategory.questions, question];
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);
  };

  // const
  const onDeleteQuestion = (id, subcategoryId) => {
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
      <div className="d-flex align-items-center">
        <span className="me-2">{index + 1}.</span>
        {showCheckbox && originNode}
      </div>
    ),
  };

  const questionColumns = [
    {
      title: "",
      render: () => <DragHandle />,
      className: "drag-visible",
      width: "1%",
    },
    {
      width: "85%",
      title: `${name} ${showCheckbox ? "Questions" : ""}`,
      dataIndex: "ques",
      render: (ques) => (
        <input readOnly className={"table_data"} value={ques} />
      ),
    },
    {
      title: (
        <img
          className="header_logo"
          src="/img/plus-logo.png"
          onClick={() => setVisible(true)}
        />
      ),
      dataIndex: "age",
      render: (_, record) => (
        <div className="row_action">
          <img
            className="edit_icon"
            src="/img/edit.svg"
            alt="edit icon"
            onClick={() => setEdit(record)}
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDeleteQuestion(record.id, record.subcategoryId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ type: "danger" }}
          >
            <img src="/img/delete.svg" alt="fess" />
          </Popconfirm>
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
      />
    </div>
  );
};

export default TableWithDnd;
