import React, { useState } from "react";
import { Spin } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { fileUploadDoc, UpdateSingleDocAnswer } from "../../store/actions";
import PreviewImage from "../Client/PreviewImage";
import { useDispatch } from "react-redux";

const UploadAttachment = ({ data, request, index }) => {
  const lastDoc = data?.request_document_answers?.length
    ? data?.request_document_answers[0]
    : {};
  const [fileName, setFileName] = useState(lastDoc.link || "");
  const [loading, setLoading] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const dispatch = useDispatch();

  // Bank Statement_'clientID'
  // file upload
  const fileUpload = async (info, reAsign) => {
    setFileUploadLoading(true);
    const formData = new FormData();

    const newNamedFile = new File(
      [info],
      `${data.name}_${request.client_id}.${
        info.name.split(".")[info.name.split(".").length - 1]
      }`,
      {
        type: info.type,
        lastModified: info.lastModified,
      }
    );
    console.log(newNamedFile);
    formData.append("singleFile", newNamedFile);
    const res = await fileUploadDoc(formData);
    if (res.success) {
      setFileName(res.fileName);
      handleSubmit(res.fileName, reAsign);
    }
    setFileUploadLoading(false);
  };

  const handleSubmit = async (fileName, reAsign) => {
    setLoading(true);
    await dispatch(
      UpdateSingleDocAnswer({
        id: data?.id,
        fileName: fileName,
        requestId: data?.requestId,
        reAsign,
      })
    );
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div
        className="d-flex align-items-center"
        style={{ marginBottom: "30px", gap: 10 }}
      >
        {/*       <p
          style={{
            color: "#455ECE",
            fontSize: 18,
          
          }}
        >
          {index + 1}.
        </p> */}
        {/*        {fileName ? (
          <img
            src="/img/check_icon_small.svg"
            className="completed_icon"
            style={{
              color: "#fff",
              background: "#27AE60",
              padding: "4px",
              borderRadius: "50%",
              fontSize: "12px",
              marginRight: "10px",
              height: 20,
              width: 20,
            }}
          />
        ) : (
          <img
            src="/img/close_icon_small.svg"
            className="completed_icon"
            style={{
              color: "#fff",
              background: "#E94614",
              padding: "4px",
              borderRadius: "50%",
              fontSize: "12px",
              marginRight: "10px",
              height: 20,
              width: 20,
            }}
          />
        )} */}
        <Spin spinning={fileUploadLoading}>
          <div
            className="file-name d-flex justify-content-between align-items-center"
            style={{
              padding: fileName || lastDoc?.link ? "0.7rem 1rem" : "0",
              fontSize: "1.125rem",
              border: fileName || lastDoc?.link ? "1px solid #afd2e9" : "none",
              width: "100%",
              borderRadius: "10px",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {fileName ? (
              <>
                <div
                  className="d-flex attachment_upload_input w-100"
                  style={{ padding: "2px 0" }}
                >
                  <PreviewImage link={fileName || lastDoc?.link} />
                  <p
                    style={{
                      marginLeft: "10px",
                      color: "#212121",
                      overflow: "hidden",
                      fontSize: "1.125rem",
                      textOverflow: "ellipsis",
                      maxWidth: "250px",
                    }}
                  >
                    {fileName?.split("^")[1] || lastDoc?.link?.split("^")[1]}
                  </p>
                </div>
                <div>
                  <div
                    htmlFor="docfile"
                    style={{
                      position: "relative",
                      color: "#455ece",
                      fontSize: "1.125rem",
                      cursor: "pointer",
                    }}
                  >
                    <p style={{ cursor: "pointer" }}>Edit</p>
                    <input
                      style={{
                        left: 0,
                        top: 0,
                        opacity: 0,
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                      type="file"
                      name="docfile"
                      onChange={(e) => {
                        // console.log({ files: e.target.files });
                        if (e.target.files?.length)
                          fileUpload(e.target.files[0], true);
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <React.Fragment>
                {fileName ? (
                  <React.Fragment>
                    <div className="d-flex align-items-center">
                      <PreviewImage link={fileName} />
                      <p
                        style={{
                          marginLeft: "10px",
                          color: "#212121",
                          overflow: "hidden",
                          fontSize: "1.125rem",
                          textOverflow: "ellipsis",
                          maxWidth: "250px",
                        }}
                      >
                        {fileName?.split("^")[1]}
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="attachment_upload_input w-100">
                    <Dragger
                      name="file"
                      action={fileUpload}
                      className="d-flex justify-content-between align-items-center"
                      style={{ padding: "2px 0" }}
                    >
                      <p className="drag-drop">{data?.name}</p>
                      <p className="upload-btn">Upload</p>
                    </Dragger>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </Spin>
      </div>
    </Spin>
  );
};

export default UploadAttachment;
