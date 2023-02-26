import { CloseCircleOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const History = ({ answers, id }) => {
  const [visible, setVisible] = useState(false);
  const myRef = useRef();

  const handleClickOutside = (e) => {
    const data = myRef.current?.contains(e.target);
    if (!data && data !== undefined) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 

  return (
    <div style={{ position: "relative" }} ref={myRef}>
      <img
        src="/img/clock_icon.svg"
        alt=""
        onClick={() => setVisible({ id, type: "history" })}
      />
      {visible && (
        <div
          className="custom_modal"
          tabIndex={0}
          //   onBlur={() => setVisible(false)}
        >
          <div className="d-flex justify-content-between">
            <h2>Answer History</h2>
            <div
              className="suf_box"
              style={{ position: "relative", top: -6, right: -6 }}
            >
              <div onClick={() => setVisible(false)}>
                <img src="/img/close_icon.svg" style={{ width: 14 }} />
              </div>
            </div>
          </div>
          {/* {console.log(answers)} */}
          {answers && answers[0] && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                <p
                  style={{ fontSize: 14, fontWeight: "400", color: "#1F295A" }}
                >
                  Latest Answer
                </p>
                <p
                  style={{ fontSize: 14, fontWeight: "400", color: "#9D9D9D" }}
                >
                  {" "}
                  {moment(new Date(answers[0].createdAt)).format(
                    "DD MMMM, HH:mm"
                  )}
                </p>
              </div>
              <p style={{ fontSize: 18, fontWeight: "400", color: "#1F295A" }}>
                {answers[0]?.ans?.replace("/", "")}
              </p>
            </div>
          )}

          <ul onClick={(e) => e.stopPropagation()}>
            {answers.map((item, idx) => {
              if (idx !== 0)
                return (
                  <li key={idx}>
                    <p>
                      {moment(new Date(item.createdAt)).format(
                        "DD MMMM, HH:mm"
                      )}
                    </p>
                    <p>{item?.ans?.replace("/", "")}</p>
                  </li>
                );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;
