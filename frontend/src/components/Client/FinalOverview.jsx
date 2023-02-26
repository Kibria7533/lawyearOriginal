import React, { useEffect, useState } from "react";
import { Table } from "antd";
import SubcategoryDocTable from "./SubcategoryDocTable";
import SubcategoryQuesTable from "./SubcategoryQuesTable";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DrossierInput } from "..";
import { SET_SUBCATEGORY } from "../../store/constants";
import { useDispatch } from "react-redux";

const FinalOverview = ({ subcategories, name, questions }) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    subcategories || []
  );
  const [edit, setEdit] = useState(false);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const data = subcategories.map((subcategory) => {
      const { questions, documents } = subcategory;
      let questionData = questions.filter((data) => data.selected === true);
      let documentData = documents.filter((data) => data.selected === true);
      return {
        ...subcategory,
        questions: questionData,
        documents: documentData,
      };
    });
    setSelectedSubcategories([...data]);
  }, []);

  const rowSelection = {
    // selectedRowKeys,
    // onChange: onSelectChange,
  };

  useEffect(() => {
    dispatch({ type: SET_SUBCATEGORY, payload: selectedSubcategories });
  }, [selectedSubcategories]);

  const questionColumns = [
    {
      width: "100%",
      title: "All Questions",
      dataIndex: "ques",
      key: "ques",
      render: (ques, { id }, idx) => (
        <div>
          <div className="qustion_and_icon">
            <input
              onBlur={() => setEdit("")}
              readOnly={edit !== id}
              className={`table_data ${edit === id && "editable"}`}
              value={ques}
              // onChange={(e) => onChangeQuestion({ value: e.target.value, id })}
            />
            {ques !== "Last name" && ques !== "First name" && ques !== "Email" && (
              <div className="row_action">
                {edit === id ? (
                  <CheckOutlined
                  // onClick={() => setEdit("")}
                  />
                ) : (
                  <>
                    <img
                      src="/img/edit.svg"
                      alt="edit icon"
                      // onClick={() => onEditQuestion(id)}
                    />
                  </>
                )}
                <img
                  src="/img/delete.svg"
                  alt="fess"
                  // onClick={() => onDeleteQuestion(id)}
                />
              </div>
            )}
          </div>
          <DrossierInput
            placeHolder="Answer"
            labelShow={true}
            name={ques}
            // value={selectedCategory[ques]}
            // onChange={onChangeClientAnswer}
          />
        </div>
      ),
    },
  ];

  // console.log({ selectedSubcategories });
  return (
    <div className="subcategory_list client_overview">
      <div className="single_subcategory">
        <div className="row create_client">
          {/* <h2 className="category_title mb-0">Category Questions</h2>
          <Table
            locale={{ emptyText: "No question selected or added" }}
            dataSource={(questions || []).filter(
              (item) => item.selected === true
            )}
            rowSelection={rowSelection}
            columns={questionColumns}
            pagination={false}
            rowKey={({ id }) => id}
          />
          <div
            style={{ marginTop: "1.563rem", borderBottom: "1px solid #CDCDCD" }}
          ></div> */}

          {selectedSubcategories.map((item) => (
            <>
              <h1
                style={{
                  color: "#1F295A",
                  fontSize: 18,
                  fontWeight: "700",
                  lineHeight: "45px",
                }}
              >
                {item?.name}
              </h1>
              <div className="grid_question_documents">
                <div>
                  <div className="" key={item.id}>
                    <SubcategoryQuesTable
                      {...item}
                      selectedSubcategories={selectedSubcategories}
                      setSelectedSubcategories={setSelectedSubcategories}
                      showCheckbox={false}
                      step={3}
                    />
                  </div>
                </div>
                <div>
                  <div className="" key={item.id}>
                    <SubcategoryDocTable
                      {...item}
                      selectedSubcategories={selectedSubcategories}
                      setSelectedSubcategories={setSelectedSubcategories}
                      showCheckbox={false}
                    />
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalOverview;
