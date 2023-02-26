import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ModalQuestionInfo from "../components/Dashboard/ModalQuestionInfo";
import { getClients } from "../store/actions";
import moment from "moment";
import { Spin } from "antd";


const Dashboard = () => {
  const [type, setType] = useState(null);
  const [filter, setFilter] = useState("Monthly");
  const [filterBy, setFilterBy] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [array, setArray] = useState(null);
  const [filteredLists, setFilteredLists] = useState({
    allClients: [],
    unansweredQues: [],
    unansweredDocs: [],
    submittedQuesFilterTime: [],
    submittedDocsFilterTime: [],
    JoinedClients: [],
    CompletedFilesFilterTime: [],
    ClientNotAccepted: [],
  });

  useEffect(() => {
    if (filter === "Weekly") {
      var startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
      var endOfWeek = moment().endOf("week").format("YYYY-MM-DD");

      setStartingDate(startOfWeek);
      setEndingDate(endOfWeek);
    }
    if (filter === "Monthly") {
      var startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      var endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

      setStartingDate(startOfMonth);
      setEndingDate(endOfMonth);
    }
    if (filter === "Yearly") {
      var startOfYear = moment().startOf("year").format("YYYY-MM-DD");
      var endOfYear = moment().endOf("year").format("YYYY-MM-DD");

      setStartingDate(startOfYear);
      setEndingDate(endOfYear);
    }
  }, [filter]);

  useEffect(() => {
    let listsObj = {
      allClients: [],
      unansweredQues: [],
      unansweredDocs: [],
      submittedQuesFilterTime: [],
      submittedDocsFilterTime: [],
      JoinedClients: [],
      CompletedFilesFilterTime: [],
      ClientNotAccepted: [],
    };
    if (list && startingDate && endingDate) {
      for (let element of list) {
        //All clients
        listsObj.allClients = [...listsObj.allClients, element];
        //Array Unanswerd ques
        if (element?.statusQues === "pending") {
          listsObj.unansweredQues = [...listsObj.unansweredQues, element];
        }
        //Array Unanswerd DOCS
        if (element?.statusDoc === "pending") {
          listsObj.unansweredDocs = [...listsObj.unansweredDocs, element];
        }
        //Array last submited question
        if (
          element?.lastQuesSubmittedDate &&
          new Date(element?.lastQuesSubmittedDate) > new Date(startingDate) &&
          new Date(element?.lastQuesSubmittedDate) < new Date(endingDate)
        ) {
          listsObj.submittedQuesFilterTime = [
            ...listsObj.submittedQuesFilterTime,
            element,
          ];
        }
        //Array last submited docs
        if (
          element?.lastDocumentSubmittedDate &&
          new Date(element?.lastDocumentSubmittedDate) >
            new Date(startingDate) &&
          new Date(element?.lastDocumentSubmittedDate) < new Date(endingDate)
        ) {
          listsObj.submittedDocsFilterTime = [
            ...listsObj.submittedDocsFilterTime,
            element,
          ];
        }

        //Joined Clients
        if (
          element?.createdAt &&
          new Date(element?.createdAt) > new Date(startingDate) &&
          new Date(element?.createdAt) < new Date(endingDate)
        ) {
          listsObj.JoinedClients = [...listsObj.JoinedClients, element];
        }

        //Files completed this month
        if (
          element?.requestCompletedDate &&
          new Date(element?.requestCompletedDate) > new Date(startingDate) &&
          new Date(element?.requestCompletedDate) < new Date(endingDate)
        ) {
          listsObj.CompletedFilesFilterTime = [
            ...listsObj.CompletedFilesFilterTime,
            element,
          ];
        }

        if (element?.status === "pending") {
          listsObj.ClientNotAccepted = [...listsObj.ClientNotAccepted, element];
        }
      }

      setFilteredLists(listsObj);
    }
  }, [startingDate, endingDate, list]);

  console.log(filteredLists);

  const router = useHistory();

  const getString = (value) => {
    if (value === "Weekly") return "week";
    if (value === "Monthly") return "month";
    if (value === "Yearly") return "year";
  };

  const GetClientList = async () => {
    setLoading(true);
    const data = await getClients(filterBy);
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    GetClientList();
  }, []);

  const content = [
    {
      title: "All Clients",
      value: list?.length,
      onClick: () => {
        setArray("allClients");
        router.push("/client/list");
      },
    },
    {
      title: "Unanswered Question Requests",
      value: filteredLists?.unansweredQues?.length,
      onClick: () => {
        setType("Unanswered Question Requests");
        setArray("unansweredQues");
      },
    },
    {
      title: "Unanswered Document Requests",
      value: filteredLists?.unansweredDocs?.length,
      onClick: () => {
        setType("Unanswered Document Requests");
        setArray("unansweredDocs");
      },
    },
    {
      title: `Clients that have submitted answers to questions this ${getString(
        filter
      )}`,
      value: filteredLists?.submittedQuesFilterTime?.length,
      onClick: () => {
        setType("Clients that have submitted answers to questions this month");
        setArray("submittedQuesFilterTime");
      },
    },
    {
      title: `Clients that have submitted documents this ${getString(filter)}`,
      value: filteredLists?.submittedDocsFilterTime?.length,
      onClick: () => {
        setType("Clients that have submitted documents this month");
        setArray("submittedDocsFilterTime");
      },
    },
    {
      title: `Clients onboarded this ${getString(filter)}`,
      value: filteredLists?.JoinedClients?.length,
      onClick: () => {
        setType("Clients onboarded this month");
        setArray("JoinedClients");
      },
    },
    {
      title: `Files Completed this ${getString(filter)}`,
      value: filteredLists?.CompletedFilesFilterTime?.length,
      onClick: () => {
        setType("Files Completed this month");
        setArray("CompletedFilesFilterTime");
      },
    },
    {
      title: "Clients who have not yet accepted the invitation",
      value: filteredLists?.ClientNotAccepted?.length,
      onClick: () => {
        setType("Clients who have not yet accepted the invitation");
        setArray("ClientNotAccepted");
      },
    },
  ];

  const CollaboratorContent = [
    {
      title: "Collaboration Requests",
      value: "4",
      onClick: () => setType(),
    },
  ];

  return (
    <Spin spinning={loading}>
      <ModalQuestionInfo
        visible={Boolean(type)}
        handleClose={() => setType(null)}
        type={type}
        contentList={filteredLists[array]}
        tableType={array}
      />
      <div className="dashboard_container">
        <h2 className="big_title_dashboard">Dashboard</h2>
        <div className="filter_container">
          <p className="filter_title">Show statistics:</p>
          <div
            className="d-flex position-relative"
            style={{ gap: 4, cursor: "pointer" }}
            onClick={() => setOpen(!open)}
          >
            <p className="filter_content"> {filter}</p>
            {open ? (
              <img src="/img/arrow_up.svg" />
            ) : (
              <img src="/img/arrow_down.svg" />
            )}
            {/* DROPDOWN */}
            {open && (
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  left: 0,
                  background: "white",
                  zIndex: "999",
                  border: "1px solid #AFD2E9",
                  fontSize: 16,
                  color: "#1F295A",
                  overflow: "hidden",
                  fontWeight: "400",
                  borderRadius: 10,
                  marginBottom: 50,
                  width: 150,
                }}
              >
                {["Weekly", "Monthly", "Yearly"]?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      cursor: "pointer",
                      height: 50,
                      padding: "4px 10px",
                      flexWrap: "wrap",
                    }}
                    className="dropdown_item_months d-flex align-items-center justify-content-between"
                    onClick={() => {
                      setFilter(item);
                      setOpen(!open);
                    }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: 8 }}
                    >
                      {/*      <img
                      src="/img/checkbox.svg"
                      style={{ height: 16, width: 16 }}
                    /> */}
                      <p>{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* DROPDOWN */}
          </div>
        </div>
        <div className="container_content">
          {content.map((item, index) => (
            <BoxContainer
              key={index}
              title={item.title}
              value={item.value}
              onClick={item.onClick}
            />
          ))}
        </div>
        <h1 className="collaboration_title">Collaborations</h1>
        <div className="container_content">
          {CollaboratorContent.map((item, index) => (
            <BoxContainer
              key={index}
              title={item.title}
              value={item.value}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    </Spin>
  );
};

export default Dashboard;

const BoxContainer = ({ title, value, onClick }) => {
  return (
    <div className="box_container" onClick={onClick}>
      <p className="box_title">{title}</p>
      <p className="box_value">{value}</p>
    </div>
  );
};
