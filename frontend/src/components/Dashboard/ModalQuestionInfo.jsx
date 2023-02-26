import { Checkbox, Modal, Progress, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { DrossierButton, DrossierInput } from "..";
import { updateRelationCategorySubcategory } from "../../services/subcategories";
import {
  getClients,
  onUpdateClientStatus,
  onDeleteClient,
} from "../../store/actions";
import moment from "moment";
import { useWindowWidth } from "@react-hook/window-size";

import { getAuthData } from "../../util";

import { BellOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import ScrollArea from "react-scrollbar";

const ModalQuestionInfo = ({
  type,
  visible,
  handleClose,
  contentList,
  tableType,
}) => {
  const onlyWidth = useWindowWidth();
  const router = useHistory();
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState(false);
  const [dropDownId, setDropDownId] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    console.log(contentList);
    setList(contentList);
  }, [contentList]);

  const getCategoryAnswer = (arr, question) => {
    const data = arr?.find((item) => item.ques === question);
    return Array.isArray(data?.request_question_answers)
      ? data?.request_question_answers[0]?.ans
      : "-";
  };

  const onUpdateStatus = async (payload) => {
    const data = await onUpdateClientStatus(payload);
    if (data) {
      const temp = list.map((item) => {
        if (item.id === payload.id) {
          item.status = payload.status;
          item.updated_by = payload.updated_by;
        }
        return item;
      });
      setList([...temp]);
      handleClose();
    }
  };

  const onDelete = async (id) => {
    const data = await onDeleteClient(id);
    if (data) {
      const temp = list.filter((item) => item.id !== id);
      setList([...temp]);
      setDropDownId("");
    }
  };

  const columns = [
    {
      with: "7%",
      title: "Client ID",
      dataIndex: "client_id",
      key: "client_id",
      render: (client_id, { id }) => (
        <>
          <span>{client_id}</span>

          <div
            className="position-relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/*          <CheckOutlined
              className="completed_icon"
              onClick={() =>
                onUpdateStatus({
                  id,
                  status: "accepted",
                  updated_by: "",
                })
              }
              style={{
                position: "absolute",
                color: "#fff",
                background: "#27AE60",
                padding: "5px",
                borderRadius: "50%",
                fontSize: "12px",
                left: "-48px",
                bottom: "2px",
              }}
            /> */}
            <img
              onClick={() =>
                onUpdateStatus({
                  id,
                  status: "accepted",
                  updated_by: "",
                })
              }
              src="/img/check_icon_small.svg"
              className="completed_icon"
              style={{
                position: "absolute",
                color: "#fff",
                background: "#27AE60",
                padding: "5px",
                borderRadius: "50%",
                fontSize: "12px",
                left: "-48px",
                bottom: "2px",
                height: 20,
                width: 20,
              }}
            />
          </div>
        </>
      ),
    },
    {
      with: "25%",
      title: "First Name",
      dataIndex: "request_questions",
      key: "first_name",
      render: (data) => getCategoryAnswer(data, "First name"),
    },
    {
      with: "25%",
      title: "Last Name",
      dataIndex: "request_questions",
      key: "last_name",
      render: (data) => getCategoryAnswer(data, "Last name"),
    },
    {
      with: "25%",
      title: "Email",
      dataIndex: "request_questions",
      key: "email",
      render: (data) => getCategoryAnswer(data, "Email"),
    },

    tableType === "unansweredQues" || tableType === "submittedQuesFilterTime"
      ? {
          with: "8%",
          title: "Questions",
          dataIndex: "quesFillupCount",
          key: "quesFillupCount",
          render: (
            quesFillupCount,
            { id, updated_by, request_questions, ...rest }
          ) => {
            const statics = `${
              request_questions?.filter(
                (item) => item?.request_question_answers?.length > 0
              )?.length || 0
            }/${request_questions?.length || 0}`;

            const percent = updated_by
              ? 100
              : Math.round(
                  (request_questions?.filter(
                    (item) => item?.request_question_answers?.length > 0
                  )?.length *
                    100) /
                    request_questions?.length
                );

            return (
              <div
                tabIndex={0}
                onBlur={() => setDropDownId("")}
                className="d-flex align-items-center justify-content-between dor_bar position-relative"
              >
                {getProccessBar(percent, statics)}
                <div onClick={(e) => e.stopPropagation()}>
                  <img
                    style={{ padding: "0 5px" }}
                    src="/img/dots.png"
                    alt="dots"
                    onClick={(e) => {
                      setDropDownId(id);
                    }}
                  />
                </div>
                {dropDownId === id && (
                  <div className={`actions`}>
                    <ul onClick={(e) => e.stopPropagation()}>
                      <li
                        onClick={() =>
                          onUpdateStatus({
                            id,
                            status: "completed",
                            updated_by: "lawyer",
                          })
                        }
                      >
                        <CheckOutlined />
                        Mark as Completed
                      </li>

                      {getClosestDate(rest) === "No" ? (
                        <li
                          onClick={() => {
                            setModalVisible(id);
                            setDropDownId("");
                            setEdit(false);
                          }}
                        >
                          <BellOutlined />
                          Send a Reminder
                        </li>
                      ) : (
                        <li
                          onClick={() => {
                            setModalVisible({ id, request_questions, ...rest });
                            setEdit(true);
                            setDropDownId("");
                          }}
                        >
                          <BellOutlined />
                          View Reminder
                        </li>
                      )}
                      <li onClick={() => onDelete(id)}>
                        <DeleteOutlined style={{ color: "#E94614" }} />
                        Archive
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            );
          },
        }
      : tableType === "unansweredDocs" ||
        tableType === "submittedDocsFilterTime"
      ? {
          with: "8%",
          title: "Documents",
          dataIndex: "docFillupCount",
          key: "docFillupCount",
          render: (
            docFillupCount,
            { id, updated_by, request_questions, request_documents, ...rest }
          ) => {
            const percent = updated_by
              ? 100
              : (docFillupCount * 100) / request_documents?.length;
            const statics = updated_by
              ? `${request_documents?.length}/${request_documents?.length}`
              : `${docFillupCount}/${request_documents?.length}`;
            return (
              <div
                tabIndex={0}
                onBlur={() => setDropDownId("")}
                className="d-flex align-items-center justify-content-between dor_bar position-relative"
              >
                {getProccessBar(percent, statics)}
                <div onClick={(e) => e.stopPropagation()}>
                  <img
                    style={{ padding: "0 5px" }}
                    src="/img/dots.png"
                    alt="dots"
                    onClick={(e) => {
                      setDropDownId(id);
                    }}
                  />
                </div>
                {dropDownId === id && (
                  <div className={`actions`}>
                    <ul onClick={(e) => e.stopPropagation()}>
                      <li
                        onClick={() =>
                          onUpdateStatus({
                            id,
                            status: "completed",
                            updated_by: "lawyer",
                          })
                        }
                      >
                        <CheckOutlined />
                        Mark as Completed
                      </li>
                      {getClosestDate(rest) === "No" ? (
                        <li
                          onClick={() => {
                            setModalVisible(id);
                            setDropDownId("");
                            setEdit(false);
                          }}
                        >
                          <BellOutlined />
                          Send a Reminder
                        </li>
                      ) : (
                        <li
                          onClick={() => {
                            setModalVisible({ id, request_questions, ...rest });
                            setEdit(true);
                            setDropDownId("");
                          }}
                        >
                          <BellOutlined />
                          View Reminder
                        </li>
                      )}
                      <li onClick={() => onDelete(id)}>
                        <DeleteOutlined style={{ color: "#E94614" }} />
                        Archive
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            );
          },
        }
      : {
          with: "15%",
          title: (
            <span>
              Overall <br />
              Completion %
            </span>
          ),
          dataIndex: "Overall",
          key: "Overall",
          render: (
            _,
            {
              id,
              quesFillupCount,
              docFillupCount,
              request_documents,
              request_questions,
              updated_by,
              ...rest
            }
          ) => {
            const documentPer = updated_by
              ? 100
              : Math.round((docFillupCount * 100) / request_documents?.length);

            const questionPer = updated_by
              ? 100
              : Math.round(
                  (request_questions?.filter(
                    (item) => item?.request_question_answers?.length > 0
                  )?.length *
                    100) /
                    request_questions?.length
                );

            return (
              <div
                tabIndex={0}
                onBlur={() => setDropDownId("")}
                className="d-flex align-items-center justify-content-between dor_bar position-relative"
              >
                {getProccessBar(
                  (questionPer + documentPer) / 2 || 0,
                  Math.round((questionPer + documentPer) / 2 || 0)
                )}
                <div onClick={(e) => e.stopPropagation()}>
                  <img
                    style={{ padding: "0 5px" }}
                    src="/img/dots.png"
                    alt="dots"
                    onClick={(e) => {
                      setDropDownId(id);
                    }}
                  />
                </div>
                {dropDownId === id && (
                  <div className={`actions`}>
                    <ul onClick={(e) => e.stopPropagation()}>
                      <li
                        onClick={() =>
                          onUpdateStatus({
                            id,
                            status: "completed",
                            updated_by: "lawyer",
                          })
                        }
                      >
                        <CheckOutlined />
                        Mark as Completed
                      </li>
                      {console.log(rest)}
                      {getClosestDate(rest) === "No" ? (
                        <li
                          onClick={() => {
                            setModalVisible(id);
                            setDropDownId("");
                            setEdit(false);
                          }}
                        >
                          <BellOutlined />
                          Send a Reminder
                        </li>
                      ) : (
                        <li
                          onClick={() => {
                            setModalVisible({ id, request_questions, ...rest });
                            setEdit(true);
                            setDropDownId("");
                          }}
                        >
                          <BellOutlined />
                          View Reminder
                        </li>
                      )}
                      <li onClick={() => onDelete(id)}>
                        <DeleteOutlined style={{ color: "#E94614" }} />
                        Archive
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            );
          },
        },
  ];

  const mobileOverallStat = (item) => {
    const documentPer = item?.updated_by
      ? 100
      : Math.round(
          (item?.docFillupCount * 100) / item?.request_documents?.length
        );

    const questionPer = item?.updated_by
      ? 100
      : Math.round(
          (item?.request_questions?.filter(
            (item) => item?.request_question_answers?.length > 0
          )?.length *
            100) /
            item?.request_questions?.length
        );

    return (questionPer + documentPer) / 2 || 0;
  };

  return (
    <Modal
      visible={visible}
      className="modal_dashboard"
      centered
      footer={null}
      title={null}
      onCancel={handleClose}
      style={{ borderRadius: 10 }}
      bodyStyle={{
        borderRadius: "0.625rem",
        padding:
          "clamp(8px , 5vw , 55px) clamp(8px , 5vw , 70px) clamp(8px , 5vw , 92px) clamp(8px , 5vw , 70px)",
        /* maxHeight: onlyWidth > 1024 && 538, */
      }}
      width={884}
    >
      <p
        style={{
          fontSize: 18,
          lineHeight: "24.55px",
          marginBottom: 28,
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        {type}
      </p>
      {onlyWidth > 1024 && contentList?.length > 0 && (
        <div
          className="client_list"
          /*      style={{ overflowY: "scroll", maxHeight: 350 }} */
        >
          {" "}
          <ScrollArea
            speed={1}
            className="area"
            style={{ maxHeight: 350 }}
            contentClassName="content"
            horizontal={false}
          >
            <Table
              className="table-hover"
              dataSource={list}
              columns={columns}
              loading={loading}
              /*    scroll={{ y: 350 }} */
              rowClassName={({ status }) =>
                status === "completed" ? "completed" : ""
              }
              rowKey={(rowKey) => rowKey.id}
              onRow={(record) => {
                return {
                  onClick: () => router.push(`/client/details/${record.id}`),
                };
              }}
              pagination={{ itemRender }}
            />
          </ScrollArea>
        </div>
      )}
      {onlyWidth <= 1024 && contentList?.length > 0 && (
        <>
          {contentList?.map((item) => (
            <div
              className="table_mobile_modal position-relative"
              style={{
                border: item?.status === "completed" && "1px solid #27ae60",
              }}
              onClick={() => router.push(`/client/details/${item.id}`)}
            >
              <>
                <div
                  tabIndex={0}
                  onBlur={() => setDropDownId("")}
                  className="d-flex align-items-center justify-content-between dor_bar position-absolute"
                  style={{ right: 12 }}
                >
                  {/*   {getProccessBar(percent, Math.round(percent))} */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <img
                      style={{ padding: "0 5px" }}
                      src="/img/dots.png"
                      alt="dots"
                      onClick={(e) => {
                        setDropDownId(item.id);
                      }}
                    />
                  </div>
                  {dropDownId === item.id && (
                    <div className={`actions_table_mobile`}>
                      <ul onClick={(e) => e.stopPropagation()}>
                        <li
                          onClick={() =>
                            onUpdateStatus({
                              id: item.id,
                              status: "completed",
                              updated_by: "lawyer",
                            })
                          }
                        >
                          <CheckOutlined />
                          Mark as Completed
                        </li>
                        {getClosestDate(item) === "No" ? (
                          <li
                            onClick={() => {
                              setModalVisible(item.id);
                              setDropDownId("");
                              setEdit(false);
                            }}
                          >
                            <BellOutlined />
                            Send a Reminder
                          </li>
                        ) : (
                          <li
                            onClick={() => {
                              setModalVisible({
                                id: item.id,
                                request_questions: item?.request_questions,
                                ...item,
                              });
                              setEdit(true);
                              setDropDownId("");
                            }}
                          >
                            <BellOutlined />
                            View Reminder
                          </li>
                        )}
                        <li onClick={() => onDelete(item.id)}>
                          <DeleteOutlined style={{ color: "#E94614" }} />
                          Archive
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
              <div className="table_mobile_grid_modal">
                <p style={{ fontSize: 14 }}>
                  {getCategoryAnswer(item.request_questions, "First name")}
                </p>
                <p style={{ fontSize: 14 }}>{item.client_id}</p>
                <p style={{ fontSize: 14 }}>
                  {getCategoryAnswer(item.request_questions, "Last name")}
                </p>
                <p style={{ fontSize: 14 }}>
                  {getCategoryAnswer(item.request_questions, "Email")}
                </p>
              </div>
              {(tableType === "unansweredQues" ||
                tableType === "submittedQuesFilterTime") && (
                <div className="table_mobile_grid_modal_two">
                  <p style={{ color: "#9D9D9D" }}>Questions</p>
                  <p>
                    {getProccessBar(
                      item?.updated_by
                        ? 100
                        : Math.round(
                            (item?.request_questions?.filter(
                              (item) =>
                                item?.request_question_answers?.length > 0
                            )?.length *
                              100) /
                              item?.request_questions?.length
                          ),
                      `${
                        item?.request_questions?.filter(
                          (item) => item?.request_question_answers?.length > 0
                        )?.length || 0
                      }/${item?.request_questions?.length || 0}`
                    )}
                  </p>
                </div>
              )}
              {(tableType === "unansweredDocs" ||
                tableType === "submittedDocsFilterTime") && (
                <div className="table_mobile_grid_modal_two">
                  <p style={{ color: "#9D9D9D" }}>Documents</p>
                  <p>
                    {getProccessBar(
                      item?.updated_by
                        ? 100
                        : (item?.docFillupCount * 100) /
                            item?.request_documents?.length,
                      item?.updated_by
                        ? `${item?.request_documents?.length}/${item?.request_documents?.length}`
                        : `${item?.docFillupCount}/${item?.request_documents?.length}`
                    )}
                  </p>
                </div>
              )}

              {(tableType === "JoinedClients" ||
                tableType === "CompletedFilesFilterTime" ||
                tableType === "ClientNotAccepted") && (
                <div className="table_mobile_grid_modal_two">
                  <p style={{ color: "#9D9D9D" }}>
                    Overall <br />
                    Completion %
                  </p>
                  <p>
                    {getProccessBar(
                      mobileOverallStat(item),
                      Math.round(mobileOverallStat(item))
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </>
      )}
      {contentList?.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
            color: "#9D9D9D",
            fontSize: 16,
          }}
        >
          No Clients that correspond to this filter
        </div>
      )}
    </Modal>
  );
};

export default ModalQuestionInfo;

function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return null;
  }
  if (type === "next") {
    return <a>Next Page</a>;
  }
  return originalElement;
}

const getStrockColor = (percent) => {
  if (percent < 50) return "#E94614";
  else if (percent < 80) return "#F2C94C";
  else return "#27AE60";
};

const getProccessBar = (percent, statics) => {
  if (percent === 100) {
    return (
      <div className="d-flex align-items-center">
        {/*       <CheckOutlined
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
        <p className="mb-0 ms-2">{statics}</p>
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
      <p className="mb-0 ms-2">{statics}</p>
    </div>
  );
};

const getClosestDate = ({
  id,
  remainderDate,
  createdAt,
  weeklyRemainder,
  threeRemainder,
  tenRemainder,
  status,
}) => {
  const createdAtMili = Date.parse(createdAt);
  const crntMili = Date.now();
  const comDays = Math.floor((crntMili - createdAtMili) / 86400000);
  const allDates = [];
  // three
  if (threeRemainder) {
    allDates.push(addDays(createdAt, comDays + (3 - (comDays % 3))));
  }
  // ten
  if (tenRemainder) {
    allDates.push(addDays(createdAt, comDays + (10 - (comDays % 10))));
  }
  // week
  if (weeklyRemainder) {
    var dayOfWeek = 5; //friday
    var date = new Date();
    date.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7));
    allDates.push(date);
  }
  // remainder date
  if (remainderDate) {
    allDates.push(new Date(remainderDate));
  }
  // checking nearest date
  let nearestDate;

  allDates.forEach((date) => {
    let diff = moment(date).diff(moment(new Date()), "days");
    if (diff >= 0) {
      if (nearestDate) {
        if (moment(date).diff(moment(nearestDate), "days") <= 0) {
          nearestDate = date;
        }
      } else {
        nearestDate = date;
      }
    }
  });

  if (nearestDate && status !== "completed") {
    return moment(nearestDate).format("D.M.YY");
  } else {
    return "No";
  }
};

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/* const DropDownMenuComponent = ({ item, setDropDownId, onUpdateStatus }) => {
  //Question
  const questionsLen = item?.request_questions?.filter(
    ({ type }) => type === "subcategory"
  )?.length;

  const percent = item?.updated_by
    ? 100
    : (item?.quesFillupCount * 100) / questionsLen;
  const statics = item?.updated_by
    ? `${questionsLen}/${questionsLen}`
    : `${item?.quesFillupCount}/${questionsLen}`;

  //Documents
  const percent = item?.updated_by
    ? 100
    : (item?.docFillupCount * 100) / item?.request_documents?.length;
  const statics = item?.updated_by
    ? `${item?.request_documents?.length}/${item?.request_documents?.length}`
    : `${item?.docFillupCount}/${item?.request_documents?.length}`;

  //Overall
  const questionsLen = item?.request_questions?.filter(
    ({ type }) => type === "subcategory"
  )?.length;

  const percent =
    (item?.updated_by
      ? 100
      : (item?.quesFillupCount + item?.docFillupCount) * 100) /
    (questionsLen + item?.request_documents?.length || 1);

  return (
    <div
      tabIndex={0}
      onBlur={() => setDropDownId("")}
      className="d-flex align-items-center justify-content-between dor_bar position-relative"
    >
      {getProccessBar(percent, Math.round(percent))}
      <div onClick={(e) => e.stopPropagation()}>
        <img
          style={{ padding: "0 5px" }}
          src="/img/dots.png"
          alt="dots"
          onClick={(e) => {
            setDropDownId(id);
          }}
        />
      </div>
      {dropDownId === id && (
        <div className={`actions`}>
          <ul onClick={(e) => e.stopPropagation()}>
            <li
              onClick={() =>
                onUpdateStatus({
                  id,
                  status: "completed",
                  updated_by: "lawyer",
                })
              }
            >
              <CheckOutlined />
              Mark as Completed
            </li>
            {getClosestDate(rest) === "No" ? (
              <li
                onClick={() => {
                  setModalVisible(id);
                  setDropDownId("");
                  setEdit(false);
                }}
              >
                <BellOutlined />
                Send a Reminder
              </li>
            ) : (
              <li
                onClick={() => {
                  setModalVisible({ id, request_questions, ...rest });
                  setEdit(true);
                  setDropDownId("");
                }}
              >
                <BellOutlined />
                View Reminder
              </li>
            )}
            <li onClick={() => onDelete(id)}>
              <DeleteOutlined style={{ color: "#E94614" }} />
              Archive
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
 */
