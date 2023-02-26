import React from "react";
import { DrossierInput } from "..";
import TypeOfFieldInput from "./TypeOfInputFieldCreate";

const BasicInformation = ({ title, setState, state }) => {
  const handleInput = (name, value) => {
    /*   const { name, value } = e.target; */
    {
      console.log({ name, value });
    }
    const data = [...state];
    const index = data.findIndex(
      (item) => Number(item.requestQuestionId) === Number(name)
    );
    data[index].ans = value;
    setState([...data]);
  };

  return (
    <div className="basic-information col-md-8">
      <div className="title">{title}</div>
      <div className="mt-3"></div>
      {state?.map((item, index) => (
        <div key={index} className="mt-3">
          {console.log(item)}
          {/*      <DrossierInput
            placeHolder={item.ques}
            value={state[index].ans || ""}
            name={item.requestQuestionId}
            onChange={handleInput}
          /> */}
          <TypeOfFieldInput
            data={item}
            ans={state[index].ans}
            setAns={handleInput}
            disabled={false}
          />
        </div>
      ))}
    </div>
  );
};

export default BasicInformation;
