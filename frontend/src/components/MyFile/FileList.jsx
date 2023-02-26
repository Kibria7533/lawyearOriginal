import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Progress, Table } from "antd";
import {
  getClients,
  onDeleteClient,
  onUpdateClientStatus,
} from "../../store/actions";
// import Filter from "./Filter";

import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  EyeFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const FileList = () => {
  const [filterBy, setFilterBy] = useState(defaultFilterOption);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState("");
  const [list, setList] = useState([]);

  // console.log(filterBy);
  // setting all category with subcategory, question and documents
  const GetClientList = async () => {
    setLoading(true);
    const data = await getClients();
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    GetClientList();
  }, []);
  const getCategoryAnswer = (arr, question) => {
    const data = arr.find((item) => item.ques === question);
    return data?.request_question_answers[0]?.ans || "-";
  };
  const columns = [
    {
      with: "7%",
      title: "Client ID",
      dataIndex: "client_id",
      key: "client_id",
      render: (client_id) => (
        <div className="position-relative">
          <span>{client_id}</span>
          {/* <CheckOutlined
            className="completed_icon"
            style={{
              position: "absolute",
              color: "#fff",
              background: "#27AE60",
              padding: "5px",
              borderRadius: "50%",
              fontSize: "12px",
              left: "-48px",
            }}
          /> */}
        </div>
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
        const questionsLen = request_questions?.filter(
          ({ type }) => type === "subcategory"
        )?.length;

        const percent = updated_by
          ? 100
          : (quesFillupCount * 100) / questionsLen;
        const statics = updated_by
          ? `${questionsLen}/${questionsLen}`
          : `${quesFillupCount}/${questionsLen}`;

        return getProccessBar(percent, statics);
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
          quesFillupCount,
          docFillupCount,
          request_documents,
          request_questions,
          updated_by,
        }
      ) => {
        const questionsLen = request_questions?.filter(
          ({ type }) => type === "subcategory"
        )?.length;

        const percent = updated_by
          ? 100
          : ((quesFillupCount + docFillupCount) * 100) /
            (questionsLen + request_documents.length || 1);
        // const statics = updated_by
        //   ? `${questionsLen + docFillupCount}/${questionsLen + docFillupCount}`
        //   : `${quesFillupCount + docFillupCount}/${
        //       questionsLen + request_documents.length
        //     }`;

        return getProccessBar(percent, `${Math.round(percent)}`);
      },
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <div>
            <Link to={`/file/details/${record.id}`}>
              <EyeFilled />
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div id="client_management">
      <div className="custom_pagination" id="">
        <div className="client_list">
          {/* <Filter filterBy={filterBy} onChangeFilter={onChangeFilter} /> */}

          <Table
            className="table-hover"
            rowKey={(row) => row.id}
            bordered
            dataSource={list}
            columns={columns}
            loading={loading}
            rowClassName={({ status }) =>
              status === "completed" ? "completed" : ""
            }
            pagination={{ itemRender }}
          />
        </div>
      </div>
    </div>
  );
};

export default FileList;

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
        {/*        <CheckOutlined
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
