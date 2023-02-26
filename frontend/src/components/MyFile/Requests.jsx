import React, { useState } from "react";
import { List } from "antd";
import AnswerModal from "./AnswerModal";
import DocumentModal from "./DocumentModal";

const Request = () => {
  const [ansModal, setAnsModal] = useState(false);
  const [documentModal, setDocumentModal] = useState(false);
  const data = [
    { ques: "First Name", id: 1 },
    { ques: "Last Name", id: 2 },
    { ques: "Age", id: 3 },
  ];
  return (
    <div className="fillup-form row" style={{ marginBottom: "2.5rem" }}>
      <div className="basic-information col-md-6">
        <div className="title">Questions</div>
        <div className="mt-3"></div>
        <div className="mt-3">
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <p className="answer" onClick={() => setAnsModal(true)}>
                    Answer
                  </p>,
                ]}
              >
                <p className="single-ques">
                  <span className="serial">{item.id}.</span> {item.ques}
                </p>
              </List.Item>
            )}
          />
        </div>
      </div>
      <div className="col-md-2"></div>
      <div className="basic-information col-md-4">
        <div className="title">Documents</div>
        <div className="mt-3"></div>
        <div className="mt-3">
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <p className="answer" onClick={() => setDocumentModal(true)}>
                    Upload
                  </p>,
                ]}
              >
                <p className="single-ques">
                  <span className="serial">{item.id}.</span> {item.ques}
                </p>
              </List.Item>
            )}
          />
        </div>
      </div>
      <AnswerModal setAnsModal={setAnsModal} ansModal={ansModal} />
      <DocumentModal
        setDocumentModal={setDocumentModal}
        documentModal={documentModal}
      />
    </div>
  );
};

export default Request;
