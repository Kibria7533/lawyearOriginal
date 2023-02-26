import React, { useEffect, useState } from "react";
import { Spin, Input, Checkbox, Select, Radio } from "antd";

import { DrossierInput } from "..";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { UpdateSingleQuestionAnswer } from "../../store/actions";
import { useDispatch } from "react-redux";

const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

const TypeOfFieldInput = ({ data, ans, setAns, disabled }) => {
  if (data.questionType === "Short Answer")
    return (
      <DrossierInput
        className="file_details_input"
        placeHolder={data?.ques}
        value={ans}
        style={{
          width: "100%",
          marginBottom: "10px",
        }}
        onChange={(e) => setAns(data.ques, e.target.value)}
        disabled={disabled}
      />
    );
  if (data.questionType === "Paragraph")
    return (
      <div style={{ width: "100%" }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: "400",
            color: "#9D9D9D",
            marginBottom: 2,
          }}
        >
          {data?.ques}
        </p>
        <TextArea
          style={{ borderRadius: 16, borderColor: "#AFD2E9" }}
          rows={4}
          value={ans}
          onChange={(e) => setAns(data.ques, e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  if (data.questionType === "Multiple Choice")
    return (
      <MultipleChoice
        data={data}
        ans={ans}
        setAns={setAns}
        disabled={disabled}
      />
    );
  if (data.questionType === "Checkboxes")
    return (
      <Checkboxes data={data} ans={ans} setAns={setAns} disabled={disabled} />
    );
  if (data.questionType === "Dropdown")
    return (
      <DropDown data={data} ans={ans} setAns={setAns} disabled={disabled} />
    );
  if (data.questionType === "Date")
    return (
      <Birthday data={data} ans={ans} setAns={setAns} disabled={disabled} />
    );
  if (data.questionType === "Time")
    return <Time data={data} ans={ans} setAns={setAns} disabled={disabled} />;

  return <></>;
};

export default TypeOfFieldInput;

const MultipleChoice = ({ data, ans, setAns, disabled }) => {
  return (
    <div style={{ width: "100%", marginTop: 32 }}>
      <p
        style={{
          fontSize: 18,
          fontWeight: "400",
          color: "#1F295A",
          marginBottom: 16,
        }}
      >
        {data?.ques}
      </p>

      {data?.options?.map((item, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <Radio
            color="#455ECE"
            value={ans}
            onChange={() => setAns(data.ques, item)}
            checked={ans === item}
            disabled={disabled}
            style={{ color: "#1F295A", fontSize: 16 }}
          >
            {item}
          </Radio>
        </div>
      ))}
    </div>
  );
};

const Checkboxes = ({ data, ans, setAns, disabled }) => {
  //Multiple Choices
  const [multipleChoices, setMultipleChoices] = useState([]);
  const onChangeMultiChoices = (item) => {
    if (multipleChoices.find((element) => element === item)) {
      const arr = multipleChoices.filter((element) => element !== item);
      setMultipleChoices(arr);

      setAns(data.ques, arr.join("/"));
    } else {
      const arr = [...multipleChoices, item];
      setMultipleChoices(arr);
      setAns(data.ques, arr.join("/"));
    }
  };

  useEffect(() => {
    setMultipleChoices(ans.split("/"));
  }, [ans]);

  return (
    <div style={{ width: "100%", marginTop: 32 }}>
      <p
        style={{
          fontSize: 18,
          fontWeight: "400",
          color: "#1F295A",
          marginBottom: 16,
        }}
      >
        {data?.ques}
      </p>

      {data?.options?.map((item, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <Checkbox
            checked={multipleChoices.find((element) => element === item)}
            onChange={() => onChangeMultiChoices(item)}
            disabled={disabled}
            style={{ color: "#1F295A", fontSize: 16 }}
          >
            {item}
          </Checkbox>
        </div>
      ))}
    </div>
  );
};

const DropDown = ({ ans, setAns, disabled, data }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: "100%", marginTop: 32 }}>
      <p
        style={{
          fontSize: 18,
          fontWeight: "400",
          color: "#1F295A",
          marginBottom: 16,
        }}
      >
        {data.ques}
      </p>
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          position: "relative",
        }}
        onClick={() => {
          !disabled && setOpen(!open);
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#black",
            cursor: "pointer",
            height: 46,
            border: "1px solid #AFD2E9",
            borderRadius: 10,
            padding: "16px 11px 16px 11px",
            width: "100%",
          }}
        >
          <p style={{ color: "black", opacity: disabled ? "50%" : "100%" }}>
            {ans}
          </p>
          {open ? (
            <img src="/img/arrow_up.svg" style={{ height: 8, width: 12 }} />
          ) : (
            <img src="/img/arrow_down.svg" style={{ width: 10 }} />
          )}
        </div>
        {open && (
          <div
            style={{
              position: "absolute",
              top: 46,
              right: 0,
              background: "white",
              zIndex: "999",
              border: "1px solid #AFD2E9",
              fontSize: 16,
              color: "#1F295A",
              overflow: "hidden",
              fontWeight: "400",
              borderRadius: 10,
              marginBottom: 50,
              minWidth: 172,
              width: "100%",
            }}
          >
            {data?.options?.map((item, index) => (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  height: 56,
                  padding: "4px 20px",
                  flexWrap: "wrap",
                }}
                className="dropdown_item_months d-flex align-items-center justify-content-between"
                onClick={() => {
                  setAns(data.ques, item);
                  setOpen(!open);
                }}
              >
                <div className="d-flex align-items-center" style={{ gap: 8 }}>
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
      </div>
    </div>
  );
};

const Birthday = ({ data, ans, setAns, disabled }) => {
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(1990);

  const [openDay, setOpenDay] = useState(false);
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  const [runOnce, setRunOnce] = useState(false);

  function range(start, end) {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  }

  const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    //Every state change update ans
    setAns(data.ques, `${day}/${month}/${year}`);
  }, [day, month, year]);

  useEffect(() => {
    //Only run once and put date on state
    if (!runOnce && ans) {
      const arr = ans.split("/");
      console.log(arr);
      setDay(Number(arr[0]));
      setMonth(arr[1]);
      setYear(Number(arr[2]));
      setRunOnce(true);
    }
  }, [ans]);

  return (
    <div style={{ width: "100%", marginTop: 32 }}>
      <p
        style={{
          fontSize: 18,
          fontWeight: "400",
          color: "#1F295A",
          marginBottom: 16,
        }}
      >
        {data?.ques}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "20%" }}>
          <p style={{ color: "#9d9d9d" }}>Day</p>
          {/*         <Select
            className="Select_dates"
            style={{
              width: "100%",
              backgroundColor: "red",
              borderRadius: 16,
            }}
            onChange={(value) => setDay(value)}
            value={day}
            disabled={disabled}
            suffixIcon={<img width={"10px"} src="/img/arrow-blue.png" />}
          >
            {range(1, 31)?.map((item, index) => (
              <Option key={index} value={item}>
                {item}
              </Option>
            ))}
          </Select> */}
          <DropDownDates
            options={range(1, 31)}
            ans={day}
            setAns={setDay}
            open={openDay}
            setOpen={setOpenDay}
            disabled={disabled}
          />
        </div>
        <div style={{ width: "50%" }}>
          <p style={{ color: "#9d9d9d" }}>Month</p>
          {/*        <Select
              style={{ width: "100%" }}
              onChange={(value) => setMonth(value)}
              value={month}
              disabled={disabled}
              suffixIcon={<img width={"10px"} src="/img/arrow-blue.png" />}
            >
              {Months?.map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select> */}
          <DropDownDates
            options={Months}
            ans={month}
            setAns={setMonth}
            open={openMonth}
            setOpen={setOpenMonth}
            disabled={disabled}
          />
        </div>
        <div style={{ width: "20%" }}>
          <p style={{ color: "#9d9d9d" }}>Year</p>
          {/*       <Select
              style={{ width: "100%" }}
              onChange={(value) => setYear(value)}
              value={year}
              disabled={disabled}
              suffixIcon={<img width={"10px"} src="/img/arrow-blue.png" />}
            >
              {range(1900, 2022)?.map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select> */}
          <DropDownDates
            options={range(1900, 2022)}
            ans={year}
            setAns={setYear}
            open={openYear}
            setOpen={setOpenYear}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

const Time = ({ data, ans, setAns, disabled }) => {
  return (
    <div style={{ width: "100%", marginTop: 32 }}>
      <p
        style={{
          fontSize: 18,
          fontWeight: "400",
          color: "#1F295A",
          marginBottom: 16,
        }}
      >
        {data?.ques}
      </p>
      <DrossierInput
        className="file_details_input"
        placeHolder="hh:mm"
        value={ans}
        style={{
          width: "100%",
          marginBottom: "10px",
        }}
        onChange={(e) => setAns(data.ques, e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

const DropDownDates = ({ open, setOpen, ans, setAns, disabled, options }) => {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          position: "relative",
        }}
        onClick={() => {
          !disabled && setOpen(!open);
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#black",
            cursor: "pointer",
            height: 46,
            border: "1px solid #AFD2E9",
            borderRadius: 10,
            padding: "16px 11px 16px 11px",
            width: "100%",
          }}
        >
          <p style={{ color: "black", opacity: disabled ? "50%" : "100%" }}>
            {ans}
          </p>
          {open ? (
            <img src="/img/arrow_up.svg" style={{ height: 8, width: 12 }} />
          ) : (
            <img src="/img/arrow_down.svg" style={{ width: 10 }} />
          )}
        </div>
        {open && (
          <div
            style={{
              position: "absolute",
              top: 46,
              right: 0,
              background: "white",
              zIndex: "999",
              border: "1px solid #AFD2E9",
              fontSize: 16,
              color: "#1F295A",
              overflow: "hidden",
              fontWeight: "400",
              borderRadius: 10,
              marginBottom: 50,
              width: "100%",
              maxHeight: 200,
              overflowY: "scroll",
            }}
          >
            {options?.map((item, index) => (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  height: 30,
                  padding: "4px 10px",
                  flexWrap: "wrap",
                }}
                className="dropdown_item_months d-flex align-items-center justify-content-between"
                onClick={() => {
                  setAns(item);
                  setOpen(!open);
                }}
              >
                <div className="d-flex align-items-center" style={{ gap: 8 }}>
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
      </div>
    </div>
  );
};
