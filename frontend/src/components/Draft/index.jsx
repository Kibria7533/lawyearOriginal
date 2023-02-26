import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import { PageHeader } from "..";
import { DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { useHistory } from "react-router";
import { deleteDraft, getDraflist } from "../../store/actions";
import { SET_DRAFT_LIST } from "../../store/constants";

const ClientList = () => {
  const [loading, setLoading] = useState(false);
  const [draftList, setDraftList] = useState([]);
  const dispatch = useDispatch();

  const setDraftData = async () => {
    setLoading(true);
    const list = await getDraflist();
    // console.log(list);
    dispatch({ type: SET_DRAFT_LIST, payload: { list } });
    setDraftList(list);
    setLoading(false);
  };

  useEffect(() => {
    setDraftData();
  }, []);

  const onDelete = async (id) => {
    const data = draftList.filter((item) => item.id !== id);
    const isSuccess = await deleteDraft({ id });
    if (isSuccess) {
      setDraftList([...data]);
    }
  };

  const getCategoryAnswer = (arr, question) => {
    const data = arr.find((item) => item.ques === question);
    return data?.ans || "-";
  };

  const columns = [
    {
      with: "20%",
      title: "Created At",
      dataIndex: "tempId",
      key: "tempId",
      render: (_, { createdAt }) => {
        return format(createdAt ? Date.parse(createdAt) : Date.now(), "PPpp");
      },
    },
    {
      with: "30%",
      title: "First Name",
      dataIndex: "First name",
      key: "First name",
      render: (_, { value }) => {
        const parsedData = value ? JSON.parse(value) : {};
        const questions = Array.isArray(parsedData.questions)
          ? parsedData.questions
          : [];
        return (
          parsedData["First name"] || getCategoryAnswer(questions, "First name")
        );
      },
    },
    {
      with: "30%",
      title: "Last name",
      dataIndex: "Last name",
      key: "Last name",
      render: (_, { value }) => {
        const parsedData = value ? JSON.parse(value) : {};
        const questions = Array.isArray(parsedData.questions)
          ? parsedData.questions
          : [];
        return (
          parsedData["Last name"] || getCategoryAnswer(questions, "Last name")
        );
      },
    },
    {
      with: "25%",
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      render: (_, { value }) => {
        const parsedData = value ? JSON.parse(value) : {};
        const questions = Array.isArray(parsedData.questions)
          ? parsedData.questions
          : [];
        return parsedData["Email"] || getCategoryAnswer(questions, "Email");
      },
    },
    {
      with: "15%",
      title: <span>Action</span>,
      dataIndex: "tempId",
      key: "tempId",
      render: (_, { id }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DeleteOutlined
            style={{ color: "red" }}
            onClick={() => onDelete(id)}
          />
        </div>
      ),
    },
  ];
  const history = useHistory();
  const user = useSelector((state) => state?.auth || {});
  return (
    <div className="custom_pagination">
      <PageHeader title="Draft Files" />
      <div className="client_list">
        <Table
          className="table-hover"
          loading={loading}
          dataSource={draftList}
          columns={columns}
          rowClassName={({ status }) =>
            status === "completed" ? "completed" : ""
          }
          onRow={(record) => {
            return {
              onClick: () => {
                if (user.role === "client") {
                  history.push(`/file/open?id=${record.id}`);
                } else history.push(`/client/create?id=${record.id}`);
              },
            };
          }}
          pagination={{ itemRender }}
          rowKey={(item) => item.id}
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
    return <a href="javascript:void(0)">Next Page</a>;
  }
  return originalElement;
}
