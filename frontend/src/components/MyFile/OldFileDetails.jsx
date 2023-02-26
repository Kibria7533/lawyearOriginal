import React, { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Progress, Spin, Tooltip } from "antd";
import AnswerModal from "./AnswerModal";
import DocumentModal from "./DocumentModal";
import { useParams } from "react-router";
import {
  CheckOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import SingleQuestion from "./OldFileSingleQuestion";
import SingleDocument from "./OldFileSingleDocument";
import { FetchSingleFileDetails } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import { getImage } from "../../util";
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
import jsPDF from "jspdf";
import "jspdf-autotable";

const OldFileDetails = ({ location }) => {
  const [csvData, setCsvData] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [document, setDocument] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSubQues, setTotalSubQues] = useState(0);
  const [countQuestion, setCountQuestion] = useState(0);
  const [countDoc, setCountDoc] = useState(0);

  const { id } = useParams();

  const [priorityQuestions, setPriorityQuestions] = useState([]);
  const [nonPriorityQuestions, setNonPriorityQuestions] = useState([]);

  const [priorityDocs, setPriorityDocs] = useState([]);
  const [nonPriorityDocs, setNonPriorityDocs] = useState([]);

  // get document id and question id
  const search = new URLSearchParams(location.search);

  const requestData = useSelector((state) => state?.myFile?.request);

  const getRequestData = async () => {
    setLoading(true);
    // const quesData = requestData.request_questions || [];
    const subCount = requestData.request_questions;
    setTotalSubQues(subCount?.length || 0);
    const quesData = requestData?.request_questions || [];
    setQuestions(quesData);
    const docData = requestData?.request_documents || [];
    setDocument(docData);

    // save fillup count in state for update realtime
    setCountDoc(
      requestData?.request_documents?.filter(
        (item) => item?.request_document_answers?.length > 0
      )?.length || 0
    );
    setCountQuestion(
      requestData?.request_questions?.filter(
        (item) => item?.request_question_answers?.length > 0
      )?.length || 0
    );
    setLoading(false);
    // formating json data
    // console.log(docData, quesData);
    let collect = [
      ["Questions", "Question Answers", "Documents", "Document Links"],
    ];
    for (let i = 0; i < docData.length || i < quesData.length; i++) {
      const temp = [];
      const ques = quesData[i];
      // console.log("ques", ques);
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
      const doc = docData[i];
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
    setCsvData(collect);
  };

  useEffect(() => {
    if (requestData) {
      getRequestData();
    }
  }, [requestData]);

  const dispatch = useDispatch();
  useEffect(async () => {
    if (id) {
      setLoading(true);
      await dispatch(FetchSingleFileDetails(id));
      setLoading(false);
    }
  }, [id]);

  // useEffect for notified question or document
  useEffect(() => {
    const priorityQues = questions
      ?.filter((item) => item?.high_priority)
      ?.filter((item) => item?.request_question_answers?.length === 0);

    const nonPriorityQues = questions?.filter(
      (item) =>
        !item?.high_priority || item?.request_question_answers?.length > 0
    );

    setPriorityQuestions(priorityQues);
    setNonPriorityQuestions(nonPriorityQues);
  }, [questions]);

  useEffect(() => {
    const priorityDocs = document
      ?.filter((item) => item?.high_priority)
      ?.filter((item) => item?.request_document_answers?.length === 0);

    const nonPriorityDocs = document?.filter(
      (item) =>
        !item?.high_priority || item?.request_document_answers?.length > 0
    );

    setPriorityDocs(priorityDocs);
    setNonPriorityDocs(nonPriorityDocs);
  }, [document]);

  const questionStatic = `${countQuestion}/${totalSubQues || 0}`;
  const documentStatic = `${countDoc}/${
    requestData?.request_documents?.length || 0
  }`;
  const questionPer = requestData?.updated_by
    ? 100
    : Math.round((countQuestion * 100) / totalSubQues);
  const documentPer = requestData?.updated_by
    ? 100
    : Math.round((countDoc * 100) / requestData?.request_documents?.length);
  const totalReqQAndD = requestData?.request_documents?.length + totalSubQues;
  console.log("what about this one", countQuestion, countDoc, totalReqQAndD);
  const onExportFile = () => {
    var doc = new jsPDF();

    const col = csvData[0];
    const rows = [...csvData];
    rows.shift();
    doc.autoTable(col, rows);
    console.log(rows);
    doc.save(`${requestData?.client_id}.pdf`);
  };

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
            documents: document,
            questions: questions,
            filename: `${requestData.client_id}.docx`,
          })
        }
      >
        <FileWordOutlined /> Word
      </Menu.Item>
    </Menu>
  );

  return (
    <Spin spinning={loading}>
      <div className="step-com">
        <p style={{ color: "#1F295A", fontSize: 16 }}>
          File ID: {requestData?.id}
        </p>
        <div className="complete-percentage text-right">
          <div className="percentage-item d-flex">
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
              Math.round(
                100 * ((countQuestion + countDoc) / totalReqQAndD) || 0
              ),
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
        </div>
      </div>
      {(priorityQuestions?.length > 0 || priorityDocs?.length > 0) && (
        <>
          <div style={{ display: "flex" }}>
            <h1
              className="title"
              style={{
                fontSize: 24,
                fontWeight: "600",
                lineHeight: "32.72px",
                color: "#1F295A",
                margin: 0,
              }}
            >
              Priority Request
            </h1>
            <p
              style={{
                color: "#9D9D9D",
                fontWeight: "400",
                fontSize: 14,
                padding: "0 4px",
              }}
            >
              {priorityQuestions?.length + priorityDocs?.length}
            </p>

            <Tooltip
              placement="bottom"
              color="#DBF1FF"
              title="Information has been requested by your Lawyer on priority basis"
              overlayInnerStyle={{ color: "#1F295A", fontWeight: 600 }}
              overlayStyle={{ borderRadius: 4 }}
            >
              <img
                src="/img/infoIcon.svg"
                style={{ marginLeft: 4, cursor: "pointer" }}
              />
            </Tooltip>
          </div>
          <div
            className="fillup-form row grid-new-file"
            style={{ marginBottom: "2.5rem" }}
          >
            {priorityQuestions?.length > 0 && (
              <div className="basic-information ">
                <div className="mt-3"></div>
                <div className="mt-3">
                  {priorityQuestions?.map((item, index) => {
                    return (
                      <SingleQuestion data={item} key={item.id} index={index} />
                    );
                  })}
                </div>
              </div>
            )}

            {priorityDocs?.length > 0 && (
              <div className="basic-information ">
                <div style={{ marginTop: "42px" }}>
                  {priorityDocs?.map((item, index) => {
                    return (
                      <SingleDocument
                        key={item.id}
                        data={item}
                        request={requestData}
                        index={index}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div
        className="fillup-form row grid-new-file"
        style={{ marginBottom: "2.5rem" }}
      >
        <div className="basic-information ">
          <div className="title">Questions</div>
          <div className="mt-3"></div>
          <div className="mt-3">
            {nonPriorityQuestions?.map((item, index) => {
              return <SingleQuestion data={item} key={item.id} index={index} />;
            })}
          </div>
        </div>

        <div className="basic-information ">
          <div className="title">Documents</div>
          <div style={{ marginTop: "42px" }}>
            {nonPriorityDocs?.map((item, index) => {
              return (
                <SingleDocument
                  key={item.id}
                  data={item}
                  request={requestData}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Spin>
  );
};

const getStrockColor = (percent) => {
  if (percent < 50) return "#E94614";
  else if (percent < 80) return "#F2C94C";
  else return "#27AE60";
};
const getProccessBar = (percent, statics) => {
  if (percent === 100) {
    return (
      <div className="d-flex align-items-center">
        {/*   <CheckOutlined
          className="completed_icon d-block"
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
        <p className="mb-0 ms-2">{statics ? statics : `${percent}%`}</p>
      </div>
    );
  }
  return (
    <div className="d-flex align-items-center">
      <Progress
        type="circle"
        width={20}
        strokeWidth={10}
        strokeColor={getStrockColor(percent)}
        percent={percent}
        showInfo={false}
        status="success"
      />
      <p className="mb-0 ms-2">{statics ? statics : `${percent}%`}</p>
    </div>
  );
};

export default OldFileDetails;

const onCreateDocX = ({ documents, questions, filename }) => {
  let dataSource = [];
  for (let i = 0; i < documents.length || i < questions.length; i++) {
    const temp = [];
    const ques = questions[i];
    // console.log("ques", ques);
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
    const doc = documents[i];
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
    dataSource.push(temp);
  }
  const columnTitles = [
    "Questions",
    "Question Answers",
    "Documents",
    "Document Links",
  ];
  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      new TableRow({
        children: columnTitles.map((title) => {
          return new TableCell({
            width: {
              size: 100 / columnTitles.length,
              type: WidthType.PERCENTAGE,
            },
            children: [
              new Paragraph({ text: title, heading: HeadingLevel.HEADING_6 }),
            ],
          });
        }),
      }),
      ...dataSource.map(
        (rowCell) =>
          new TableRow({
            children: rowCell.map((cell) => {
              return new TableCell({
                width: {
                  size: 25,
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
  });
  const doc = new Document({
    sections: [
      {
        children: [table],
      },
    ],
  });
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, filename);
  });
};
