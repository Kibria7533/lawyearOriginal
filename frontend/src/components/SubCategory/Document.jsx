import React, { useState } from "react";
import QuestionInputDocument from "../Category/QuestionInputDocument";
import SingleQuestionDocument from "../Category/SingleQuestionDocument";

const Document = ({ document, setDocuments }) => {
  const [inputField, setInputField] = useState(false);
  console.log(document);

  // delete single question
  const deleteSingleQues = (index) => {
    // const newData = document.filter((item) => item.ques !== ques);
    document.splice(index, 1);
    setDocuments([...document]);
  };
  const onEditQues = ({ ques, idx }) => {
    const newData = document.map((item, id) => {
      if (id === idx) item = { name: ques };
      return item;
    });
    console.log(newData, idx);
    // document.splice(index, 1);
    setDocuments([...newData]);
  };

  // add document
  const addQuestion = (data) => {
    const newData = [...document, { name: data }];
    setDocuments(newData);
    setInputField(false);
  };
  return (
    <React.Fragment>
      <div className="document-list mb-4">
        <p className="title">Documents</p>
      </div>
      <div className="document-list">
        <div>
          <div style={{ width: "24.125rem", marginBottom: "20px" }}>
            {document.map((item, index) => (
              <SingleQuestionDocument
                variant="create"
                key={index}
                idx={index + 1}
                // showAction={false}
                ques={item.name}
                deleteSingleQues={deleteSingleQues}
                onEditQues={onEditQues}
              />
            ))}
          </div>
          <div className="text-left" style={{ marginBottom: "2.625rem" }}>
            {!inputField && (
              <p
                style={{
                  color: "#455ECE",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setInputField(true)}
              >
                Add a Document
              </p>
            )}
            {inputField && (
              <QuestionInputDocument
                addQuestion={addQuestion}
                onClose={() => setInputField(false)}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Document;
