import {
  BellOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { notification, Spin } from "antd";
import React, { Fragment } from "react";
import { useState } from "react";
import { DrossierInput } from "..";
import api from "../../api";
import { endpoint } from "../../config";
import { addDocumentOnRequest, addQustionOnRequest } from "../../store/actions";
import { getImage } from "../../util";
import QuestionInput from "./QuestionInputCreateLawyer";
import QuestionInputDocument from "./QuestionInputDocument";
import Comments from "./Comments";
import DocumentComments from "./DocumentComments";
import DocumentHistory from "./DocumentHistory";
import History from "./History";
import PreviewImage from "./PreviewImage";
import TypeOfFieldInput from "./TypeOfInputField";

const ClientDetailsItem = ({
  combinedData = {},
  idx,
  requestId,
  onAddSubQueOrDoc,
  clientEmail,
}) => {
  const [inputField, setInputField] = useState(false);
  const [docInputField, setDocInputField] = useState(false);
  const [addQuesLoading, setAddQuesLoading] = useState(false);
  const [addDocLoading, setAddDocLoading] = useState(false);
  const [allQuestions, setAllQuestions] = useState(
    combinedData?.questions || []
  );
  const [allDocuments, setAllDocuments] = useState(
    combinedData?.documents || []
  );
  const subcategoryDetails = allQuestions[0]?.subcategory || {};
  const [loading, setLoading] = useState("");

  const onAddQuestion = async (ques) => {
    setAddQuesLoading(true);
    try {
      const data = {
        clientEmail,
        type: "subcategory",
        ques: ques.ques,
        questionType: ques.type,
        options: ques.options,
        requestId,
        subcategoryId: subcategoryDetails.id,
      };
      const res = await addQustionOnRequest(data);
      if (res.success) {
        setAllQuestions([
          ...allQuestions,
          { ...res.question, request_question_answers: [] },
        ]);
        onAddSubQueOrDoc("request_questions", {
          ...res.question,
          request_question_answers: [],
        });
        setInputField(false);
      }
    } catch (error) {
      notification.warn({
        message: error.message || "Something went wrong",
        placement: "bottomRight",
      });
    }
    setAddQuesLoading(false);
  };

  const onAddDocument = async (name) => {
    setAddDocLoading(true);
    try {
      const data = {
        clientEmail,
        name,
        requestId,
        subcategoryId: subcategoryDetails.id,
      };
      const res = await addDocumentOnRequest(data);
      if (res.success) {
        setAllDocuments([
          ...allDocuments,
          { ...res.document, request_document_answers: [] },
        ]);
        onAddSubQueOrDoc("request_documents", {
          ...res.document,
          request_document_answers: [],
        });
        setDocInputField(false);
      }
    } catch (error) {
      notification.warn({
        message: error.message || "Something went wrong",
        placement: "bottomRight",
      });
    }
    setAddDocLoading(false);
  };

  const sendNotification = async (type, id) => {
    setLoading(id);
    let sendData = {
      requestId: allQuestions[0].requestId,
    };
    if (type === "question") {
      sendData.questionId = id;
    } else {
      sendData.documentId = id;
    }
    const res = await api.post(endpoint.send_notification, { ...sendData });
    if (res.success) {
      notification.success({
        message: res.message,
        placement: "bottomRight",
      });
    }
    setLoading("");
  };

  return (
    <div
      className="fillup-form row"
      style={{
        paddingBottom: 60,
        borderBottom: "1px solid #CDCDCD",
      }}
    >
      {idx === 0 && (
        <div className="titles_document_question">
          <div className="row ">
            <div className="title col-md-6">Questions</div>
            <div className="title col-md-1"></div>
            <div className="title col-md-5">Documents</div>
          </div>
        </div>
      )}
      <div className="basic-information col-md-6">
        <div className="title title_hidden_invert" style={{ marginTop: 16 }}>
          Questions
        </div>
        <div
          className="subcategory-name"
          style={{ marginTop: 20, marginBottom: 30 }}
        >
          {subcategoryDetails?.name}
        </div>
        {console.log(allQuestions)}
        <div className="mt-3"></div>
        {allQuestions?.map(
          (
            {
              id,
              request_question_answers,
              ques,
              comments,
              options,
              questionType,
            },
            index
          ) => (
            <Spin key={id} spinning={loading === id}>
              <div key={id} className="d-flex align-items-start">
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
                {request_question_answers?.length ? (
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
                  <div
                    style={{
                      borderBottom: "1px solid #E0EBF2",
                      paddingBottom: 16,
                      marginBottom: 16,
                    }}
                  >
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
                  </div>

                  <div
                    className="suf_box position-absolute"
                    style={{ top: -8, right: 0 }}
                  >
                    {!request_question_answers[0]?.ans && (
                      <div onClick={() => sendNotification("question", id)}>
                        <img src="/img/bell_icon.svg" alt="" />
                      </div>
                    )}
                    {/* SOLVED HERE */}
                    {/* {request_question_answers.length > 1 && (
                      <History id={id} answers={request_question_answers} />
                    )} */}
                    <History id={id} answers={request_question_answers} />
                    <Comments
                      id={id}
                      comments={comments}
                      allQuestions={allQuestions}
                      setAllQuestions={setAllQuestions}
                      from="requestQuestionId"
                    />
                  </div>
                </div>
              </div>
            </Spin>
          )
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
            <Spin spinning={addQuesLoading}>
              <QuestionInput
                onClose={() => {
                  console.log("onClose");
                  setInputField(false);
                }}
                addQuestion={(ques) => {
                  console.log("addQuestion");
                  onAddQuestion(ques);
                }}
                handleClose={() => setInputField(false)}
              />
            </Spin>
          )}
        </div>
      </div>
      <div className="col-md-1"></div>
      <div className="basic-information col-md-5">
        <div
          className="title title_hidden_invert mb-2 "
          style={{ marginTop: 50 }}
        >
          Documents
        </div>

        <div
          className="subcategory-name title_hidden"
          style={{ opacity: "0", marginTop: 20 }}
        >
          {subcategoryDetails?.name}
        </div>
        {/* <div className="mt-3"></div> */}
        <div className="mt-3">
          {allDocuments?.map(
            ({ id, request_document_answers, comments, name }, index) => (
              <Spin key={id} spinning={loading === id}>
                <div className="mb-2">
                  <div id="common-element">
                    <label
                      style={{
                        marginLeft: "45px",
                        textTransform: "capitalize",
                      }}
                    >
                      {request_document_answers[0]?.link ? name : ""}
                    </label>
                  </div>
                  <div key={id} className="d-flex align-items-center">
                    <p
                      style={{
                        marginTop: 0,
                        marginRight: 10,
                        color: "#455ECE",
                        fontSize: 18,
                      }}
                    >
                      {index + 1}.
                    </p>
                    {request_document_answers[0]?.link ? (
                      /*      <CheckOutlined
                        className="completed_icon"
                        style={{
                          color: "#fff",
                          background: "#27AE60",
                          padding: "4px",
                          borderRadius: "50%",
                          fontSize: "12px",
                          marginRight: "10px",
                        }}
                      /> */
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
                          height: 20,
                          width: 20,
                        }}
                      />
                    ) : (
                      /*      <CloseOutlined
                        className="completed_icon"
                        style={{
                          color: "#fff",
                          background: "#E94614",
                          padding: "4px",
                          borderRadius: "50%",
                          fontSize: "12px",
                          marginRight: "10px",
                        }}
                      /> */
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
                          height: 20,
                          width: 20,
                        }}
                      />
                    )}
                    <div
                      className="file-name d-flex align-items-center"
                      style={{
                        padding: "0.7rem .5rem",
                        fontSize: "1.125rem",
                        border: "1px solid #afd2e9",
                        width: "100%",
                        borderRadius: "10px",
                        display: "flex",
                        // justifyContent: "space-between",
                      }}
                    >
                      {request_document_answers[0]?.link ? (
                        <Fragment>
                          <a
                            style={{ marginRight: "7px", marginTop: "-5px" }}
                            download={`${
                              request_document_answers[0]?.link.split("^")[1]
                            }`}
                            href={getImage(request_document_answers[0]?.link)}
                          >
                            <DownloadOutlined />
                          </a>
                          <PreviewImage
                            link={request_document_answers[0]?.link}
                          />
                          <p
                            style={{
                              marginLeft: "10px",
                              color: "#212121",
                              overflow: "hidden",
                              fontSize: "1.125rem",
                              textOverflow: "ellipsis",
                              maxWidth: "100%",
                            }}
                          >
                            {request_document_answers[0]?.link.split("^")[1]}
                          </p>
                        </Fragment>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <p
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {name}
                          </p>
                        </div>
                      )}
                      <div className="suf_box position-absolute">
                        {!request_document_answers[0]?.link && (
                          <div onClick={() => sendNotification("document", id)}>
                            <img src="/img/bell_icon.svg" alt="" />
                          </div>
                        )}
                        {/* solved here */}
                        {/* {request_document_answers.length > 1 && (
                          <DocumentHistory
                            id={id}
                            answers={request_document_answers}
                          />
                        )} */}
                        
                        <DocumentHistory
                            id={id}
                            answers={request_document_answers}
                          />
                        <DocumentComments
                          id={id}
                          comments={comments}
                          allQuestions={allDocuments}
                          setAllQuestions={setAllDocuments}
                          from="requestDocumentId"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Spin>
            )
          )}
          <div style={{ margin: "25px 0 0 30px" }}>
            {!docInputField && (
              <p
                style={{
                  color: "#455ECE",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginBottom: "0",
                }}
                onClick={() => setDocInputField(true)}
              >
                Add a Document
              </p>
            )}
            {docInputField && (
              <Spin spinning={addQuesLoading}>
                <QuestionInputDocument
                  placeHolder="Add a Document"
                  onClose={() => {
                    console.log("onClose");
                    setDocInputField(false);
                  }}
                  addQuestion={(docName) => {
                    console.log("adddocNametion");
                    onAddDocument(docName);
                    // setQues(data);
                  }}
                />
              </Spin>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsItem;
