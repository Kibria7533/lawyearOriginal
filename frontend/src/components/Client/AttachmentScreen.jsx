import { Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import { DrossierButton, DrossierInput } from "..";
import ProcessBar from "./ProcessBar";

//Icons
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import UploadAttachment from "./UploadAttachment";

const AttachmentScreen = ({ step, setStep, selectedCategory }) => {
  //State
  const [attachmentName, setAttachmentName] = useState("");

  return (
    <div>
      <ProcessBar step={2} />
      {/* Header */}
      <div className="header_attachment_screen d-flex justify-content-between align-items-center">
        <p style={{ display: "flex", gap: 12 }}>
          <p className="attachment_title">Selected Category:</p>
          <p className="attachment_title_result">{selectedCategory?.name}</p>
        </p>
        <DrossierButton
          text="Continue"
          disabled={false}
          onClick={() => {
            setStep(step + 1);
          }}
        />
      </div>

      {/* Container No Attachment */}
      <div className="attachment_main_container">
        <div>
          <h1>Attach Documents</h1>
          <h2>Attach any supporting file(s) or document(s) for client</h2>
          <p>Attach Document</p>
        </div>
        <div>
          <h1>Notes</h1>
        </div>
      </div>
      {/* Container New Attachment */}
      <div
        className="attachment_main_container"
        style={{
          borderTop: "1px solid #BDD9EB",
          borderBottom: "1px solid #BDD9EB",
        }}
      >
        <div>
          <h1 style={{ marginBottom: 16 }}>Attach Documents</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <p style={{ marginTop: 22, fontWeight: 400 }}>1.</p>
            <DrossierInput
              className="add_attachment_input"
              placeHolder="Name of Document"
              type="text"
              onChange={(e) => setAttachmentName(e.target.value)}
              value={attachmentName}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <p style={{ marginTop: 22, fontWeight: 400, opacity: "0%" }}>1.</p>

            <UploadAttachment />
          </div>
        </div>
        <div>
          <h1 style={{ marginBottom: 16 }}>Notes</h1>
          <div className="d-flex" style={{ gap: 20 }}>
            <div style={{ width: "100%" }}>
              <label style={{ fontSize: 14, color: "#9D9D9D", marginLeft: 10 }}>
                Note
              </label>
              <TextArea
                style={inputStyle}
                className="add_attachment_input"
                placeHolder="Note"
                type="text"
                onChange={(e) => setAttachmentName(e.target.value)}
                value={attachmentName}
                autoSize={{ minRows: 1, maxRows: 15 }}
              />
            </div>
            <div className="d-flex" style={{ gap: 10 }}>
              <p style={{ marginTop: 22 }}>Save</p>
              <SvgDelete style={{ marginTop: 22, cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentScreen;

const inputStyle = {
  border: "1px solid #AFD2E9",
  fontSize: 16,
  color: "#1F295A",
  padding: "8px 20px",
  fontWeight: "400",
  borderRadius: 10,
  width: "100%",
};
