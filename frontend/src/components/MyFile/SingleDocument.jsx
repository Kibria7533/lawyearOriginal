import { DeleteOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import React from "react";
import { getImage } from "../../util/helper";
import PreviewImage from "../Client/PreviewImage";

const SingleDocument = ({ onChange, data, deleteDoc, idx, loadingId }) => {
  return (
    <div className="input-item mb-3">
      <label
        htmlFor=""
        style={{ color: "#9D9D9D", fontSize: "14px", marginLeft: "30px" }}
      >
        {data?.name}
      </label>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <p style={{ color: "#455ECE" }}> {idx + 1}.</p>
        {data?.link ? (
          <div
            className="uploaded-file"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div className="file-name d-flex align-items-center">
              <PreviewImage link={data?.link} />
              <p
                style={{
                  marginLeft: "10px",
                  color: "#212121",
                  fontSize: "1.125rem",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {data?.link?.split("^")[1]}
              </p>
            </div>
            <div className="file-delete">
              <DeleteOutlined
                style={{
                  color: "#9D9D9D",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={() => deleteDoc(idx)}
              />
            </div>
          </div>
        ) : (
          <Spin spinning={loadingId === idx}>
            <Dragger
              name="file"
              action={(file) => onChange(file, idx)}
              className="d-flex justify-content-between align-items-center"
            >
              <p className="drag-drop">Drag & Drop</p>
              <p className="upload-btn">Upload</p>
            </Dragger>
          </Spin>
        )}
      </div>
    </div>
  );
};

export default SingleDocument;
