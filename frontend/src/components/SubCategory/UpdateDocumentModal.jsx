import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { updateDocument } from "../../store/actions";

const UpdateDocumentModal = ({
  itemId,
  visible,
  setVisible,
  data,
  documentName
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setName(documentName);
  }, [visible]);
  const onChange = (e) => setName(e.target.value);
  const onClick = async () => {
    setLoading(true);
    await dispatch(
      updateDocument({
        name,
        categoryId: data?.categoryId,
        subcategoryId: data?.id,
        id: itemId
      })
    );
    setLoading(false);
    setVisible(false);
  };
  return (
    <Modal
      visible={visible}
      className="add_question_modal"
      centered
      footer={null}
      title={null}
      onCancel={() => setVisible(false)}
      bodyStyle={{ borderRadius: "0.625rem", padding: "3.438rem" }}
    >
      <div className="d-flex justify-content-center">
        <p className="modal_title">{data?.name}</p>
      </div>
      <DrossierInput placeHolder="Document" onChange={onChange} value={name} />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Update Document"
            onClick={onClick}
            disabled={!name}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateDocumentModal;
