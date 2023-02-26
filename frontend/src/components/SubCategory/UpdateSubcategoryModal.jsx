import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { updateSubcateogry } from "../../store/actions";

const UpdateSubcategoryModal = ({data, visible, setVisible }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  useEffect(() => {
    setName(data?.name || "");
  }, [visible, data]);
  const onChange = (e) => setName(e.target.value);
  const onClick = async () => {
    setLoading(true);
    dispatch(updateSubcateogry({name, id:data?.id, categoryId:data?.categoryId}))
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
      {/* <div className="d-flex justify-content-center">
        <p className="modal_title">{title1}</p>
      </div> */}
      <DrossierInput
        placeHolder="Sub-Category name"
        onChange={onChange}
        value={name}
      />
      <div className="d-flex justify-content-center">
        <div className="action_box">
          <DrossierButton
            text="Update Sub-Category"
            onClick={onClick}
            disabled={!name}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateSubcategoryModal;
