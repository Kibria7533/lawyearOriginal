import React, { useState } from "react";
import { Modal, Spin } from "antd";
import { DrossierButton } from "..";
import { getImage } from "../../util";
import { DeleteOutlined } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";
import { fileUploadDoc, UpdateSingleDocAnswer } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const DocumentModal = ({
  setDocumentModal,
  documentModal,
  data,
}) => {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [imageErr, setImageErr] = useState(false);
  const history = useHistory();

  // file upload
  const fileUpload = async (info) => {
    setFileUploadLoading(true);
    const formData = new FormData();
    formData.append("singleFile", info);
    const res = await fileUploadDoc(formData);  
    if (res.success) {
      setFileName(res.fileName);
    }
    setFileUploadLoading(false);
  };

  const dispatch = useDispatch()
  const handleSubmit = async () => {
    setLoading(true);
    await dispatch(UpdateSingleDocAnswer({id: data?.id, fileName, requestId: data?.requestId}));
    history.push(`/file/details/${data?.requestId}`)
    setLoading(false);
    setDocumentModal(false);
    setImageErr(false)
  };

  //close modal
  const closeModal = ()=>{
    setImageErr(false)
    setDocumentModal(false)
  }

  return (
    <Modal
      className="add_question_modal my-file"
      id="my-file"
      visible={documentModal}
      bodyStyle={{ borderRadius: "0.625rem", padding: "3.438rem" }}
      centered
      footer={null}
      title={null}
      onCancel={closeModal}
      closable={false}
    >
      <div className="d-flex justify-content-center">
        <p className="modal_title">Upload The Document</p>
      </div>
      <div className="upload-input">
        <div className="input-item mb-3">
          <label
            htmlFor=""
            style={{ color: "#9D9D9D", fontSize: "14px", marginLeft: "10px" }}
          >
            {data?.name}
          </label>
          {fileName ? (
            <div className="uploaded-file d-flex justify-content-between align-items-center">
              <div className="file-name d-flex align-items-center">
                {!imageErr && (
                  <img
                    src={getImage(fileName)}
                    alt="image"
                    width="70"
                    height="40"
                    onError={() => setImageErr(true)}
                  />
                )}

                <p
                  style={{
                    marginLeft: "10px",
                    color: "#212121",
                    fontSize: "1.125rem",
                    maxWidth: "200px",
                  }}
                >
                  {fileName?.split('^')[1]}
                </p>
              </div>
              <div className="file-delete">
                <DeleteOutlined
                  style={{
                    color: "#9D9D9D",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                  onClick={() => setFileName("")}
                />
              </div>
            </div>
          ) : (
            <Spin spinning={fileUploadLoading}>
              <Dragger
                name="file"
                action={fileUpload}
                className="d-flex justify-content-between align-items-center"
              >
                <p className="drag-drop">Drag & Drop</p>
                <p className="upload-btn">Upload</p>
              </Dragger>
            </Spin>
          )}
        </div>
      </div>
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "1rem" }}
      >
        <div className="action_box text-center">
          <DrossierButton
            text="Upload"
            onClick={handleSubmit}
            disabled={!fileName || loading}
            loading={loading}
          />
          <button
            style={{
              border: "none",
              background: "none",
              fontSize: "1rem",
              color: "#9d9d9d",
              marginTop: "0.978rem",
            }}
            onClick={() => setDocumentModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentModal;