import React, { Fragment, useEffect, useState } from "react";
import { CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Progress, Spin } from "antd";
import { DrossierButton } from "..";
import Questionaries from "./Questionaries";
import { AddDraft, LogoutUser, submitRequest } from "../../store/actions";
import BasicInformation from "./BasicInformation";
import api from "../../api";
import { endpoint } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const NewFileDetails = ({ type }) => {
  const [step, setStep] = useState(1);
  const [basicState, setBasicState] = useState([]);
  const [questionState, setQuestionState] = useState([]);
  const [docState, setDocState] = useState([]);
  const [docFillupCount, setDocFillupCount] = useState(0);
  const [quesFillupCount, setQuesFillupCount] = useState(0);
  const [basicLoading, setBasicLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const urlSearchParams = new URLSearchParams(history.location.search);
  const draftid = urlSearchParams.get("id");
  const invitationid = urlSearchParams.get("invitationid");
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState({});

  //redux data
  const draftData = useSelector((state) =>
    Array.isArray(state?.client?.draftData) ? state?.client?.draftData : []
  );
  const user = useSelector((state) => state?.auth);
  const getRequestData = async () => {
    setLoading(true);
    const res = await api.get(endpoint.single_request + invitationid);
    setRequestData(res?.request);
    setLoading(false);
    const reqUser = res?.request?.user || [];
    const isFoundUser = reqUser.find((item) => item.user_id === user.user_id);
    if (!isFoundUser) {
      Modal.confirm({
        title: "This invitation isn't associated with your account.",
        icon: <ExclamationCircleOutlined />,
        // content: "Some descriptions",
        centered: true,
        okText: "Re-signin",
        okButtonProps: { type: "primary", className: "danger ghost" },
        onOk() {
          dispatch(LogoutUser());
          history.push(`/?invitationId=${invitationid}`);
        },
        onCancel() {
          history.push("/file");
        },
      });
    }
  };

  const getDraftData = async () => {
    const data = draftData.find((item) => String(item.id) === String(draftid));
    try {
      const parsedValue = JSON.parse(data.value);
      if (parsedValue && Object.keys(parsedValue)) {
        setRequestData(parsedValue);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (invitationid) getRequestData();
    if (draftid) {
      getDraftData();
    }
  }, [draftid, invitationid]);

  // basic information questions filter
  const basicQuestions = draftid
    ? requestData?.questions?.filter((item) => item.type === "category")
    : requestData?.request_questions
        ?.filter((item) => item.type === "category")
        .map(
          ({
            id,
            ques,
            request_question_answers,
            type,
            questionType,
            options,
          }) => ({
            requestQuestionId: id,
            ques,
            questionType,
            options,
            ans:
              request_question_answers?.length > 0
                ? request_question_answers[0]?.ans
                : "",
            type,
          })
        );

  let quesCount = 0;
  let imgCount = 0;
  // questions
  const questions = draftid
    ? requestData?.questions
        /*    ?.filter((item) => item.type === "subcategory") */
        ?.map((filterData) => {
          if (filterData?.ans) {
            quesCount += 1;
          }
          return filterData;
        })
    : requestData?.request_questions
        /*     ?.filter((item) => item.type === "subcategory") */
        ?.map(
          ({
            request_question_answers,
            id,
            type,
            ques,
            questionType,
            options,
          }) => {
            if (request_question_answers?.length) {
              quesCount += 1;
            }
            return {
              requestQuestionId: id,
              ques,
              questionType,
              options,
              ans:
                request_question_answers?.length > 0
                  ? request_question_answers[0]?.ans
                  : "",
              type,
            };
          }
        );

  const docData = draftid
    ? requestData?.documents?.map((filterData) => {
        if (filterData?.link) {
          imgCount += 1;
        }
        return { ...filterData, requestDocumentId: filterData.id };
      })
    : requestData?.request_documents?.map(
        ({ id, name, request_document_answers }) => {
          if (request_document_answers?.link) {
            imgCount += 1;
          }
          return {
            id,
            name,
            link: request_document_answers?.link,
          };
        }
      );

  useEffect(() => {
    console.log(questions);
    setDocState(docData);
    setQuestionState(questions);
    setBasicState([...(basicQuestions || [])]);
    setQuesFillupCount(quesCount);
    setDocFillupCount(imgCount);
  }, [requestData]);

  // documents
  const documents = requestData?.request_documents || [];

  // submit request
  // console.log(docState);
  const handleSubmit = async () => {
    setSubmitLoading(false);
    await saveBasic();
    const data = [...questionState];
    const formatQuestionData = data
      .filter((item) => item.ans)
      .filter((item, index) => index > 2)
      .map(({ requestQuestionId, id, ans }) => ({
        requestQuestionId: id || requestQuestionId,
        ans,
      }));
    const formatDocData = docState
      .filter((item) => item.link)
      .map(({ requestDocumentId, id, link }) => ({
        requestDocumentId: id || requestDocumentId,
        link,
      }));

    const payload = {
      request_id: draftid ? requestData?.request_id : requestData?.id,
      quesFillupCount,
      docFillupCount,
      questions: formatQuestionData,
      documents: formatDocData,
      status:
        docData?.length === docFillupCount &&
        questions?.length === quesFillupCount
          ? "completed"
          : "accepted",
    };

    console.log(payload);

    const res = await submitRequest(payload);
    if (res?.success) {
      history.push(
        `/file/details/${draftid ? requestData?.request_id : requestData?.id}`
      );
    }
  };

  // save basic information
  const saveBasic = async () => {
    setBasicLoading(true);

    console.log({ basicState });
    const res = await api.post(endpoint.update_basic_ques, {
      questions: basicState,
    });
    if (res.success) {
      setStep(2);
    }
    setBasicLoading(false);
  };

  // add draft
  const saveDraft = async () => {
    const data = [...basicState, ...questionState];
    const payload = {
      request_id: draftid ? requestData?.request_id : requestData?.id,
      docFillupCount,
      quesFillupCount,
      questions: data,
      documents: docState,
    };
    await AddDraft({
      value: payload,
      request_id: draftid ? requestData?.request_id : requestData?.id,
    });
  };

  const documentPerce = (docFillupCount * 100) / docData?.length;
  const quesPer = (quesFillupCount * 100) / questions?.length;

  return (
    <Fragment>
      {type !== "request" && (
        <Fragment>
          {/*         <div className="step-com">
            <div className="step-number">
              <p>Step {step}/2</p>
            </div>
            <div className="complete-percentage">
              <div className="percentage-item d-flex">
                <p>Documents: </p>
                {getProccessBar(
                  Math.round(documentPerce || 0),
                  `${docFillupCount}/${docData?.length}`
                )}
              </div>
              <div className="percentage-item">
                <p>Questionaries:</p>
                {getProccessBar(
                  Math.round(quesPer || 0),
                  `${quesFillupCount}/${questions?.length}`
                )}
              </div>
              <div className="percentage-item">
                <p>Overall Completion:</p>
                {getProccessBar(
                  Math.round((quesPer + documentPerce) / 2) || 0
                  // `${quesFillupCount + docFillupCount}/${
                  //   questions?.length + docData?.length
                  // }`
                )}
              </div>
            </div>
          </div> */}
          <div className="keep-option">
            <div className="info">
              {/*    <p>Your file is being auto-saved in drafts</p> */}
              <p style={{ color: "#1F295A", fontSize: 16, fontWeight: "400" }}>
                File ID : {requestData?.id}
              </p>
            </div>
            <div className="submit-file d-flex align-items-center">
              <p onClick={saveDraft}> Save as Draft</p>
              <DrossierButton
                text="Submit"
                style={{ padding: "0.938rem 5.188rem" }}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </Fragment>
      )}
      <Spin spinning={loading || basicLoading || submitLoading}>
        <div className="fillup-form" style={{ marginBottom: "2.5rem" }}>
          {/*       {step === 1 ? (
            <BasicInformation
              title="Basic Information"
              state={basicState}
              setState={setBasicState}
            />
          ) : ( */}
          <Questionaries
            questions={questions}
            title="Questions"
            state={questionState}
            setState={setQuestionState}
            documents={documents}
            docState={docState}
            setDocState={setDocState}
            docFillupCount={docFillupCount}
            setDocFillupCount={setDocFillupCount}
            quesFillupCount={quesFillupCount}
            setQuesFillupCount={setQuesFillupCount}
          />
          {/*    )} */}
        </div>
      </Spin>
      {console.log(questionState)}
      {/*       {step === 1 && (
        <div className="submit-button">
          <DrossierButton
            text="Continue"
            style={{ padding: "0.938rem 5.188rem" }}
            onClick={saveBasic}
            loading={basicLoading}
            disabled={basicLoading}
          />
        </div>
      )} */}
      {/*  {step === 2 && ( */}
      <div
        className="submit-file d-flex align-items-center"
        style={{ gap: 28 }}
      >
        <DrossierButton
          text="Submit"
          style={{ padding: "0.938rem 5.188rem" }}
          onClick={handleSubmit}
        />
        <p
          onClick={saveDraft}
          style={{ color: "#455ECE", fontWeight: "700", fontSize: 16 }}
        >
          {" "}
          Save as Draft
        </p>
      </div>
      {/*    )} */}
    </Fragment>
  );
};

export default NewFileDetails;

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
