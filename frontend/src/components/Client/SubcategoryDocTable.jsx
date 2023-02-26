import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Popconfirm, Table, Tooltip } from "antd";
import AddDocumentModal from "./AddDocumentModal";
import UpdateSubcategoryDocumentModal from "./UpdateSubcategoryDocumentModal";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { DrossierInput } from "..";
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";

const DragHandle = sortableHandle(() => (
  <div>
    <MenuOutlined style={{ cursor: "grab", color: "#999" }} draggable={true} />
  </div>
));

const SortableItem = sortableElement((props) => {
  return <tr {...props} className="ant-table-cell " />;
});
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const SubcategoryDocTable = ({
  selectedSubcategories,
  setSelectedSubcategories,
  name,
  documents,
  id,
  showCheckbox = true,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const [conVisible, setConVisible] = useState(false);
  const [edit, setEdit] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [docName, setDocName] = useState("");

  // drag and drop
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.id === id && oldIndex !== newIndex) {
        const newData = arrayMove(
          [].concat(subcategory.documents),
          oldIndex,
          newIndex
        ).filter((el) => !!el);
        subcategory.documents = newData;
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
    const index = documents.findIndex(
      (item) => item.id === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };
  const onChangeDocument = ({ value, id, subcategoryId }) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.id === subcategoryId) {
        const documentData = subcategory.documents.map((document) => {
          if (document.id === id) document.name = value;
          return document;
        });
        subcategory.documents = documentData;
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);
  };

  const onDelete = (id, subcategoryId) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.id === subcategoryId) {
        const documentData = subcategory.documents.filter(
          (document) => document.id !== id
        );
        subcategory.documents = documentData;
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);
  };

  const onSelectChange = (rowKeys) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (id === subcategory.id) {
        const documents = subcategory.documents?.map((document) => {
          const flag = rowKeys.find((id) => id === document.id);
          if (flag) document.selected = true;
          else document.selected = false;
          return document;
        });
        subcategory.documents = documents;
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

  const addDocumentOnSubcategory = (document) => {
    const data = selectedSubcategories.map((subcategory) => {
      if (subcategory.id === document.subcategoryId) {
        subcategory.documents = [
          ...subcategory.documents,
          { ...document, selected: true },
        ];
      }
      return subcategory;
    });
    setSelectedSubcategories([...data]);
    setVisible(false);
  };

  const columns = [
    {
      title: "",
      render: () => <DragHandle />,
      className: "drag-visible",
      width: "1%",
    },
    {
      width: "85%",
      title: `All Documents`,
      dataIndex: "name",
      key: "name",
      render: (name, record) =>
        edit.id === record?.id ? (
          <DrossierInput
            placeHolder="Document"
            onChange={(e) => setDocName(e.target.value)}
            value={docName}
          />
        ) : (
          <input readOnly className={`table_data`} value={name} />
        ),
    },
    {
      /*     title: (
        <img
          className="header_logo"
          src="/img/plus-logo.png"
          onClick={() => setVisible(true)}
        />
      ), */
      dataIndex: "age",
      key: "age",
      render: (_, record) => (
        <div className="row_action">
          <img
            src="/img/edit.svg"
            alt="edit icon"
            onClick={() => setEdit(record)}
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDelete(record.id, record.subcategoryId)}
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
    <>
      <AddDocumentModal
        data={{ name: docName, id }}
        visible={conVisible}
        setVisible={setConVisible}
        addDocumentOnSubcategory={addDocumentOnSubcategory}
      />
      <UpdateSubcategoryDocumentModal
        data={edit}
        visible={edit.subcategoryId === id}
        setVisible={setEdit}
        onUpdate={onChangeDocument}
      />
      <Table
        className={!showCheckbox && "overview-table"}
        locale={{ emptyText: "No document selected or added" }}
        dataSource={documents || []}
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
      {!visible ? (
        <p
          onClick={() => setVisible(true)}
          style={{
            marginTop: 16,
            color: "#455ECE",
            fontWeight: "700",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {" "}
          Add a document
        </p>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DrossierInput
            placeHolder="Document"
            onChange={(e) => setDocName(e.target.value)}
            value={docName}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 22,
            }}
          >
            <p
              onClick={() => setConVisible(true)}
              style={{
                color: "#455ECE",
                fontWeight: "700",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Save
            </p>
            <Tooltip
              placement="bottom"
              color="#DBF1FF"
              title="Delete"
              overlayInnerStyle={{ color: "#1F295A", fontWeight: 600 }}
              overlayStyle={{ borderRadius: 4 }}
            >
              <SvgDelete
                onClick={() => setVisible(false)}
                style={{ height: 14, width: 14, cursor: "pointer" }}
              />
            </Tooltip>
          </div>
        </div>
      )}
    </>
  );
};

export default SubcategoryDocTable;
