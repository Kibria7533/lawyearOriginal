import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Progress, Table } from "antd";
import {
  getClients,
  onDeleteClient,
  onUpdateClientStatus,
} from "../../store/actions";
import Filter from "./Filter";
import { PageHeader } from "..";

import { BellOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import moment from "moment";
import SetReminderModal from "./SetReminderModal";
import { Link } from "react-router-dom";

const ClientList = () => {
  const [filterBy, setFilterBy] = useState(defaultFilterOption);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [visible, setVisible] = useState("");
  const [modalVisible, setModalVisible] = useState("");
  const [list, setList] = useState([]);
  const history = useHistory();

  const onDelete = async (id) => {
    const data = await onDeleteClient(id);
    if (data) {
      const temp = list.filter((item) => item.id !== id);
      setList([...temp]);
      setVisible("");
    }
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
      setVisible("");
    }
  };

  const onUpdateRemainder = async (payload) => {
    const temp = list.map((item) => {
      if (item.id === payload.id) {
        item.remainderDate = payload.remainderDate;
        item.weeklyRemainder = payload.weeklyRemainder;
        item.threeRemainder = payload.threeRemainder;
        item.tenRemainder = payload.tenRemainder;
      }
      return item;
    });
    setList([...temp]);
    // setVisible("");
  };

  const onChangeFilter = ({ name, value }) => {
    setFilterBy({ ...filterBy, [name]: value });
  };
  // console.log(filterBy);
  // setting all category with subcategory, question and documents
  const GetClientList = async () => {
    setLoading(true);
    const data = await getClients(filterBy);
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    GetClientList();
  }, [filterBy]);
  const getCategoryAnswer = (arr, question) => {
    const data = arr?.find((item) => item.ques === question);
    return Array.isArray(data?.request_question_answers)
      ? data?.request_question_answers[0]?.ans
      : "-";
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
            {/*   <CheckOutlined
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
              alt="check_icon_small"
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
    {
      with: "25%",
      title: (
        <span>
          Next
          <br />
          Reminder
        </span>
      ),
      dataIndex: "request_questions",
      key: "reminder",
      render: (_, data) => getClosestDate(data),
    },
    {
      with: "8%",
      title: "Documents",
      dataIndex: "docFillupCount",
      key: "docFillupCount",
      render: (docFillupCount, { updated_by, request_documents }) => {
        const percent = updated_by
          ? 100
          : (docFillupCount * 100) / request_documents?.length;
        const statics = updated_by
          ? `${request_documents?.length}/${request_documents?.length}`
          : `${docFillupCount}/${request_documents?.length}`;

        return getProccessBar(percent, statics);
      },
    },
    {
      with: "8%",
      title: "Questionnaire",
      dataIndex: "quesFillupCount",
      key: "quesFillupCount",
      render: (quesFillupCount, { updated_by, request_questions }) => {
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

        return getProccessBar(percent || 0, statics || 0);
      },
    },
    {
      with: "25%",
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (data) => {
        // getCategoryAnswer(data, "Message")

        const handleClick = (event) => {
          event.stopPropagation();
        }

        return <Link to="/messages" onClick={handleClick}><p>M<sup>9+</sup></p></Link>
      },
    },
    {
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
          const quesCount = (request_questions?.filter(
                (item) => item?.request_question_answers?.length > 0
              )?.length ); 
          const totalReqQAndD = request_questions?.length +  request_documents?.length; 
        return (
          <div
            tabIndex={0}
            onBlur={() => setVisible("")}
            className="d-flex align-items-center justify-content-between dor_bar position-relative"
          >
            {getProccessBar(
              (questionPer + documentPer) / 2 || 0,
              Math.round(((docFillupCount + quesCount) / totalReqQAndD) *100 || 0)
            )}
            <div onClick={(e) => e.stopPropagation()}>
              <img
                style={{ padding: "0 5px" }}
                src="/img/dots.png"
                alt="dots"
                onClick={(e) => {
                  setVisible(id);
                }}
              />
            </div>
            {visible === id && (
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
                        setVisible("");
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
                        setVisible("");
                      }}
                    >
                      <BellOutlined />
                      View Reminder
                    </li>
                  )}
                  <li onClick={() => onDelete(id)}>
                    <DeleteOutlined style={{ color: "#E94614" }} />
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="custom_pagination">
      <SetReminderModal
        visible={modalVisible}
        setVisible={setModalVisible}
        edit={edit}
        setEdit={setEdit}
        getCategoryAnswer={getCategoryAnswer}
        updateRemainder={onUpdateRemainder}
      />

      <PageHeader title="Clients" />
      <div className="client_list">
        <Filter filterBy={filterBy} onChangeFilter={onChangeFilter} />

        <Table
          className="table-hover"
          dataSource={list}
          columns={columns}
          loading={loading}
          rowClassName={({ status }) =>
            status === "completed" ? "completed" : ""
          }
          rowKey={(rowKey) => rowKey.id}
          onRow={(record) => {
            return {
              onClick: () => history.push(`/client/details/${record.id}`),
            };
          }}
          pagination={{ itemRender }}
        />
      </div>
    </div>
  );
};

export default ClientList;

function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return null;
  }
  if (type === "next") {
    return <a>Next Page</a>;
  }
  return originalElement;
}

const defaultFilterOption = {
  sortBy: "missing_questions",
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
        {/*      <CheckOutlined
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
  console.log(id, allDates);
  console.log(nearestDate);
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
