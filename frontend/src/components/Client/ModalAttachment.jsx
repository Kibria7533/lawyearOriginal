import React from "react";
import { ConfirmationModal } from "../Shared";

const ModalAttachement = ({ step, setStep, visible, setVisible }) => {
  return (
    <>
      <ConfirmationModal
        visible={visible}
        setVisible={setVisible}
        onCancel={() => {
          setStep(step + 2);
          setVisible(false);
        }}
        onOk={() => {
          setStep(step + 1);
          setVisible(false);
        }}
        title="Would you like to attach any files to share with clients?"
        okText="Attach Files"
        cencelText="Continue without attachments"
        className="client_confirmation"
      />
    </>
  );
};

export default ModalAttachement;
