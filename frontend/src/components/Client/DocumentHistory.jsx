import { CloseCircleOutlined, DownloadOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getImage } from "../../util";
import { saveAs } from "file-saver";
import moment from "moment";

const DocumentHistory = ({ answers, id }) => { 
  const [visible, setVisible] = useState(false);
  const myRef = useRef();

  const handleClickOutside = (e) => {
    const data = myRef.current?.contains(e.target);
    if (!data && data !== undefined) {
      setVisible(false);
    }
  };
  // console.log(answers);
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
            <div className="suf_box">
              <div>
                <CloseCircleOutlined
                  onClick={() => setVisible(false)}
                  style={{ color: "#6767eb", fontSize: "20px" }}
                />
                {/* <img
                  src="/img/clock_icon.svg"
                  alt=""
                  // onClick={() => setVisible({ id, type: "history" })}
                /> */}
              </div>
            </div>
          </div>
          <ul onClick={(e) => e.stopPropagation()}>
            {answers.map((item, idx) => {
              const dowld = `${item?.link.split("^")[1]}`;
              // console.log({ dowld });
              //solved here. 
              // if (idx !== 0)
                return (
                  <li key={idx}>
                    <p>
                      {moment(new Date(item.createdAt)).format(
                        "DD MMMM, HH:mm"
                      )}
                    </p>
                    <div className="d-flex">
                      <p className="w-100">{dowld}</p>
                      <a download={dowld} href={getImage(item?.link)}>
                        <DownloadOutlined
                        // onClick={() => {
                        //   saveAs(getImage(item?.link), `${item?.link.split("^")[1]}`);
                        // }}
                        />
                      </a>
                    </div>
                  </li>
                );
            })}
            {answers.length == 0 && <li><p>No History to show!</p></li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentHistory;
