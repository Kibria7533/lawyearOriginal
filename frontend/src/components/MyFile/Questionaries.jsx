import React from "react";
import { DrossierInput } from "..";
import Documents from "./Documents";
import TypeOfFieldInput from "./TypeOfInputFieldCreate";

const Questionaries = ({
  title,
  questions,
  state,
  setState,
  documents,
  setDocState,
  docState,
  docFillupCount,
  setDocFillupCount,
  quesFillupCount,
  setQuesFillupCount,
}) => {
  console.log(state);

  const handleInput = (name, value) => {
    // const { name, value } = e.target;
    // setState({ ...state, [name]: value });
    /*   const { name, value } = e.target; */
    const data = [...state];
    const index = data.findIndex(
      (item) => Number(item.requestQuestionId) === Number(name)
    );
    if (!value) {
      if (quesFillupCount > 0) setQuesFillupCount(quesFillupCount - 1);
    }
    if (value && !data[index].ans) {
      setQuesFillupCount(quesFillupCount + 1);
    }

    data[index].ans = value;

    setState([...data]);
  };

  console.log(state);
  return (
    <div className="basic-information row grid-new-file">
      <div>
        <div className="title">{title}</div>
        <div className="mt-3"></div>
        {state?.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: 20, alignItems: "flex-start" }}
          >
            <p style={{ color: "#455ECE", marginTop: 36 }}>{index + 1}.</p>
            <TypeOfFieldInput
              data={item}
              ans={state[index].ans}
              setAns={handleInput}
              disabled={false}
            />
          </div>
        ))}
      </div>

      <div>
        <Documents
          title="Documents"
          documents={documents}
          docState={docState}
          setDocState={setDocState}
          docFillupCount={docFillupCount}
          setDocFillupCount={setDocFillupCount}
        />
      </div>
    </div>
  );
};

export default Questionaries;
