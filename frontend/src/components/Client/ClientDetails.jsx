import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu, notification, Progress, Spin } from "antd";
import api from "../../api";
import { endpoint } from "../../config";
import { useParams } from "react-router";
import { groupedBySubcategory } from "../../util";
import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import PageHeader from "../Shared/PageHeader";
import ClientDetailsItem from "./ClientDetailsItem";
import { DrossierInput } from "..";
import QuestionInput from "./QuestionInputCreateLawyer";
import { addQustionOnRequest, createCategory } from "../../store/actions";
import { useSelector } from "react-redux";
import History from "./History";
import Comments from "./Comments";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";
import {
  Document,
  Table,
  TableRow,
  TableCell,
  Packer,
  Paragraph,
  HeadingLevel,
  WidthType,
} from "docx";
import { getImage } from "../../util";
import TypeOfFieldInput from "./TypeOfInputField";

const RequestDetails = () => {
  const [csvData, setCsvData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [inputField, setInputField] = useState(false);
  const [requestData, setRequestData] = useState();
  const [totalSubquestion, setTotalSubquestion] = useState();
  const [loading, setLoading] = useState(false);
  const [categoryQuesLoading, setCategoryQuesLoading] = useState(false);
  const { id } = useParams();
  const [allData, setAllData] = useState({});
  const [categoryQues, setCateghoryQues] = useState([]);
  const [client, setClient] = useState({});
  const user = useSelector((state) => state?.auth);

  const onExportFile = () => {
    var doc = new jsPDF();
    tableData.map(({ rows, header }, idx) => {
      console.log(rows);
      doc.autoTable(header, rows, {
        margin: { top: 15 },
        tableWidth: 200,
        columnStyles: {
          0: { cellWidth: idx == 0 ? 90 : 45 },
          1: { cellWidth: idx == 0 ? 90 : 45 },
          2: { cellWidth: 45 },
          3: { cellWidth: 45 },
        },
        width: {},
      });
    });

    doc.save(`${requestData?.client_id}.pdf`);
  };

  const getRequestData = async (id) => {
    setLoading(true);
    const res = await api.get(endpoint.single_request + id);
    setRequestData(res?.request);
    const caetgoryQuestion = res?.request?.request_questions?.filter(
      (item) => item.type === "category"
    );
    const quesData = res?.request?.request_questions;
    const docData = res?.request?.request_documents;
    const ab = groupedBySubcategory(quesData, docData);
    setAllData(ab.combinedData);
    setTotalSubquestion(ab.totalSubQuestion);
    setCateghoryQues(caetgoryQuestion);
    setLoading(false);
    setClient(res?.request?.user?.find(({ id }) => user.id !== id) || {});
    const combinedData = ab.combinedData;
    formatCsvData({ combinedData, caetgoryQuestion, setCsvData });
    formatTableData({ combinedData, caetgoryQuestion, setTableData });
  };
  // console.log(tableData);
  const onAddQuestion = async (data) => {
    setCategoryQuesLoading(true);
    try {
      const res = await addQustionOnRequest({
        ...data,
        clientEmail: client.email,
      });
      // console.log(res);
      if (res.success) {
        setCateghoryQues([...categoryQues, res.question]);
        setInputField(false);
      }
    } catch (error) {
      notification.warn({
        message: error.message || "Something went wrong",
        placement: "bottomRight",
      });
    }
    setCategoryQuesLoading(false);
  };

  const sendNotification = async (id) => {
    // console.log(id);
    setLoading(id);
    try {
      let sendData = {
        requestId: categoryQues[0].requestId,
        questionId: id,
      };
      const res = await api.post(endpoint.send_notification, { ...sendData });
      if (res.success) {
        notification.success({
          message: res.message,
          placement: "bottomRight",
        });
      } else {
        notification.error({
          message: res.message,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.log(error.response);
      notification.error({
        message: error.response?.data?.message || error?.message,
        placement: "bottomRight",
      });
    }
    setLoading("");
  };

  useEffect(() => {
    if (id) {
      getRequestData(id);
    }
  }, [id]);

  const onAddSubQueOrDoc = (feild, data) => {
    setRequestData({
      ...requestData,
      [feild]: [...requestData[feild], data],
    });
    // console.log({ [feild]: [...requestData[feild], data] });
  };

  const docCount = requestData?.request_documents?.filter(
    (item) => item?.request_document_answers?.length > 0
  )?.length;

  console.log(docCount);

  const questionStatic = `${
    requestData?.request_questions?.filter(
      (item) => item?.request_question_answers?.length > 0
    )?.length || 0
  }/${requestData?.request_questions?.length || 0}`;

  const documentStatic = requestData?.updated_by
    ? `${requestData?.request_documents?.length}/${requestData?.request_documents?.length}`
    : `${docCount}/${requestData?.request_documents?.length}`;
  const totalReqQAndD =
    requestData?.request_documents?.length +
    requestData?.request_questions?.length;
  console.log("total req for q and d ", totalReqQAndD);
  const quesCount = requestData?.request_questions?.filter(
    (item) => item?.request_question_answers?.length > 0
  )?.length;
  console.log(docCount, quesCount);
  const questionPer = requestData?.updated_by
    ? 100
    : Math.round(
        (requestData?.request_questions?.filter(
          (item) => item?.request_question_answers?.length > 0
        )?.length *
          100) /
          requestData?.request_questions?.length
      );
  const documentPer = requestData?.updated_by
    ? 100
    : Math.round((docCount * 100) / requestData?.request_documents?.length);

  const menu = (
    <Menu>
      <Menu.Item onClick={onExportFile}>
        <FileWordOutlined /> Pdf
      </Menu.Item>
      <Menu.Item>
        <CSVLink data={csvData} filename={`${requestData?.client_id}.csv`}>
          <FileExcelOutlined />
          Excel
        </CSVLink>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          onCreateDocX({
            tableData,
            filename: requestData?.client_id,
          })
        }
      >
        <FileWordOutlined /> Word
      </Menu.Item>
    </Menu>
  );

  return (
    <Spin spinning={loading}>
      <div className="my-file">
        <PageHeader title="Client's Information" />
        <div className="step-com">
          <div></div>
          <div className="complete-percentage ">
            <div className="percentage-item ">
              <p>Documents: </p>
              {getProccessBar(documentPer || 0, documentStatic || 0)}
            </div>
            <div className="percentage-item">
              <p>Questionaries:</p>
              {getProccessBar(questionPer || 0, questionStatic || 0)}
            </div>
            <div className="percentage-item">
              <p>Overall Completion:</p>
              {getProccessBar(
                Math.round(((quesCount + docCount) * 100) / totalReqQAndD || 0),
                null
              )}
            </div>
            <div style={{ marginLeft: "15px" }}>
              <Dropdown overlay={menu} placement="bottomCenter" arrow>
                <Button>
                  <DownloadOutlined style={{ marginRight: "10px" }} />
                  Export
                </Button>
              </Dropdown>
            </div>
            {/* <button onClick={onExportFile}>Export</button> */}
          </div>
        </div>
        <div className="fillup-form row" style={{ marginBottom: "1.313rem" }}>
          <div className="col-md-6">
            <div className="title">Category Questions</div>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div
          className="fillup-form row"
          style={{
            marginBottom: 20,
            paddingBottom: 60,
            borderBottom: "1px solid #CDCDCD",
          }}
        >
          <div className="basic-information col-md-6">
            {categoryQues?.map(
              (
                {
                  request_question_answers,
                  comments,
                  ques,
                  id,
                  options,
                  questionType,
                },
                index
              ) => {
                // const {} = item;
                return (
                  <Spin spinning={loading === id} key={id}>
                    <div className="d-flex align-items-start">
                      <p
                        style={{
                          marginBottom: 6,
                          marginRight: 10,
                          color: "#455ECE",
                          fontSize: 18,
                          position: "relative",
                          top: "-2px",
                        }}
                      >
                        {index + 1}.
                      </p>
                      {request_question_answers?.length > 0 ? (
                        <img
                          src="/img/check_icon_small.svg"
                          className="completed_icon"
                          style={{
                            color: "#fff",
                            background: "#27AE60",
                            padding: "4px",
                            borderRadius: "50%",
                            fontSize: "12px",
                            marginRight: "10px",
                            marginTop: 2,
                            height: 20,
                            width: 20,
                          }}
                        />
                      ) : (
                        <img
                          src="/img/close_icon_small.svg"
                          className="completed_icon"
                          style={{
                            color: "#fff",
                            background: "#E94614",
                            padding: "4px",
                            borderRadius: "50%",
                            fontSize: "12px",
                            marginRight: "10px",
                            marginTop: 2,
                            height: 20,
                            width: 20,
                          }}
                        />
                      )}
                      <div className="w-100 position-relative">
                        <TypeOfFieldInput
                          data={{
                            request_question_answers,
                            comments,
                            ques,
                            id,
                            options,
                            questionType,
                          }}
                          ans={
                            request_question_answers?.length
                              ? request_question_answers[0]?.ans
                              : ""
                          }
                          disabled={true}
                          setAns={() => console.log("aza")}
                        />

                        <div
                          className="suf_box position-absolute"
                          style={{ top: -6, right: 0 }}
                        >
                          {request_question_answers &&
                            !request_question_answers[0]?.ans && (
                              <div onClick={() => sendNotification(id)}>
                                <img src="/img/bell_icon.svg" alt="" />
                              </div>
                            )}
                          {/* {request_question_answers?.length > 1 && (
                            <History
                              id={id}
                              answers={request_question_answers}
                            />
                          )} */}

                          <History id={id} answers={request_question_answers} />
                          <Comments
                            id={id}
                            comments={comments}
                            allQuestions={categoryQues}
                            setAllQuestions={setCateghoryQues}
                          />
                        </div>
                      </div>
                    </div>
                  </Spin>
                );
              }
            )}
            <div style={{ margin: "25px 0 0 30px" }}>
              {!inputField && (
                <p
                  style={{
                    color: "#455ECE",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: "0",
                  }}
                  onClick={() => setInputField(true)}
                >
                  Add a Question
                </p>
              )}
              {inputField && (
                <Spin spinning={categoryQuesLoading}>
                  <QuestionInput
                    onClose={() => {
                      // console.log("onClose");
                      setInputField(false);
                    }}
                    addQuestion={(ques) => {
                      console.log(ques);
                      // console.log("addQuestion");
                      onAddQuestion({
                        type: "category",
                        ques: ques.ques,
                        questionType: ques.type,
                        options: ques.options,
                        requestId: id,
                      });
                      // setQues(data);
                    }}
                    handleClose={() => setInputField(false)}
                  />
                </Spin>
              )}
            </div>
          </div>
        </div>
        {Object.keys(allData)?.map((item, index) => (
          <ClientDetailsItem
            key={item}
            idx={index}
            combinedData={allData[item]}
            requestId={id}
            clientEmail={client.email}
            onAddSubQueOrDoc={onAddSubQueOrDoc}
          />
        ))}
      </div>
    </Spin>
  );
};

export default RequestDetails;

const getStrockColor = (percent) => {
  if (percent < 80) return "#F2C94C";
  else return "#27AE60";
};
const getProccessBar = (percent, statics) => {
  // const data = Math.floor(Math.random() * 101);
  if (percent === 100) {
    return (
      <div className="d-flex align-items-center">
        {/*       <CheckOutlined
          className="completed_icon"
          style={{
            color: "#fff",
            background: "#27AE60",
            padding: "4px",
            borderRadius: "50%",
            fontSize: "12px",
          }}
        /> */}
        <img
          src="/img/check_icon_small.svg"
          className="completed_icon"
          style={{
            color: "#fff",
            background: "#27AE60",
            padding: "4px",
            borderRadius: "50%",
            fontSize: "12px",
            height: 20,
            width: 20,
          }}
        />
        <p className="mb-0 ms-2" style={{ color: "#1F295A" }}>
          {statics ? statics : `${percent}%`}
        </p>
      </div>
    );
  }
  return (
    <div className="d-flex align-items-center">
      <Progress
        type="circle"
        width={20}
        strokeWidth={20}
        trailColor="#DADADA"
        strokeColor={getStrockColor(percent)}
        percent={percent}
        showInfo={false}
        status="success"
      />
      <p className="mb-0 ms-2" style={{ color: "#1F295A" }}>
        {statics ? statics : `${percent}%`}
      </p>
    </div>
  );
};

const onCreateDocX = ({ tableData, filename }) => {
  const tables = tableData.map(
    ({ header, rows }) =>
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        margins: { top: 15 },
        rows: [
          new TableRow({
            children: header.map((title) => {
              return new TableCell({
                width: {
                  size: 100 / header.length,
                  type: WidthType.PERCENTAGE,
                },
                children: [
                  new Paragraph({
                    text: title,
                    heading: HeadingLevel.HEADING_6,
                  }),
                ],
              });
            }),
          }),
          ...rows.map(
            (rowCell) =>
              new TableRow({
                children: rowCell.map((cell) => {
                  return new TableCell({
                    width: {
                      size: 100 / header.length,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [
                      new Paragraph({
                        text: cell,
                        heading: HeadingLevel.HEADING_6,
                      }),
                    ],
                  });
                }),
              })
          ),
        ],
      })
  );
  const doc = new Document({
    sections: [
      {
        children: tables,
      },
      // ...tables.map((item) => ({ children: [item] })),
    ],
  });
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${filename}.docx`);
  });
};

const formatCsvData = ({ combinedData, caetgoryQuestion, setCsvData }) => {
  let collect = [["Category Questions", "Question Answers"]];
  Object.keys(combinedData).map((key) => {
    const { questions, documents } = combinedData[key];
    const subcategoryName = questions[0]?.subcategory?.name;
    collect[0].push(`${subcategoryName} Question`);
    collect[0].push(`${subcategoryName} Answer`);
    collect[0].push(`${subcategoryName} Document`);
    collect[0].push(`${subcategoryName} Document Links`);
    for (let i = 0; i < documents?.length || i < questions?.length; i++) {
      const temp = [];
      const catQues = caetgoryQuestion[i];
      if (catQues) {
        temp.push(catQues.ques);
        temp.push(
          catQues.request_question_answers.length
            ? catQues.request_question_answers[0]?.ans
            : ""
        );
      } else {
        temp.push("");
        temp.push("");
      }
      // subcategory question
      const ques = questions[i];
      if (ques) {
        temp.push(ques.ques);
        temp.push(
          ques.request_question_answers.length
            ? ques.request_question_answers[0]?.ans
            : ""
        );
      } else {
        temp.push("");
        temp.push("");
      }
      const doc = documents && documents[i];
      // console.log("doc", doc);
      if (doc) {
        temp.push(doc.name);
        temp.push(
          doc.request_document_answers.length
            ? getImage(doc.request_document_answers[0]?.link)
            : ""
        );
      } else {
        temp.push("");
        temp.push("");
      }
      collect.push(temp);
    }
  });
  setCsvData(collect);
};

const formatTableData = ({ combinedData, caetgoryQuestion, setTableData }) => {
  const tables = [
    { header: ["Category Questions", "Question Answers"], rows: [] },
  ];
  // formating category table
  caetgoryQuestion.map((catQues) => {
    const rows = [];
    rows.push(catQues.ques);
    rows.push(
      catQues.request_question_answers.length
        ? catQues.request_question_answers[0]?.ans
        : ""
    );
    tables[0].rows.push(rows);
  });
  // formating subcategory table
  Object.keys(combinedData).map((key) => {
    const { questions, documents } = combinedData[key];
    const table = { header: [], rows: [] };
    const subcategoryName = questions[0]?.subcategory?.name;
    table.header = [
      `${subcategoryName} Questions`,
      `${subcategoryName} Answers`,
      `${subcategoryName} Documents`,
      `${subcategoryName} Links`,
    ];
    for (let i = 0; i < documents?.length || i < questions?.length; i++) {
      // subcategory question
      const rows = [];
      const ques = questions[i];
      if (ques) {
        rows.push(ques.ques);
        rows.push(
          ques.request_question_answers.length
            ? ques.request_question_answers[0]?.ans
            : ""
        );
      } else {
        rows.push("");
        rows.push("");
      }
      const doc = documents && documents[i];
      // console.log("doc", doc);
      if (doc) {
        rows.push(doc.name);
        rows.push(
          doc.request_document_answers.length
            ? getImage(doc.request_document_answers[0]?.link)
            : ""
        );
      } else {
        rows.push("");
        rows.push("");
      }
      table.rows.push(rows);
      // console.log({ table });
    }
    tables.push(table);
  });
  setTableData(tables);
};
