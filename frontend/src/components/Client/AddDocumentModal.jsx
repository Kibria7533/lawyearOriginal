import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { addDocumentSubcategory } from "../../store/actions";
import { ConfirmationModal } from "../Shared";

const AddDocumentModal = ({
  data,
  visible,
  setVisible,
  addDocumentOnSubcategory,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  console.log(data);
  const onAddDocument = async (flag) => {
    setLoading(true);
    if (flag) {
      const returnData = await dispatch(
        addDocumentSubcategory({
          name: data.name,
          subcategoryId: data.id,
          shouldDispatch: false,
        })
      );
      if (returnData) {
        addDocumentOnSubcategory(returnData);
      }
    } else {
      addDocumentOnSubcategory({
        id: Date.now(),
        name: data.name,
        subcategoryId: data.id,
      });
    }

    // dispatch(
    //   addDocumentSubcategory({
    //     name,
    //     subcategoryId: data?.id,
    //     categoryId: data?.categoryId,
    //   })
    // );
    setLoading(false);
    setVisible(false);
  };
  return (
    <>
      <ConfirmationModal
        visible={visible}
        setVisible={setVisible}
        onCancel={() => {
          onAddDocument();
        }}
        onOk={() => {
          onAddDocument(true);
        }}
        title="Do you want to add this document to this subcategory for all clients?"
        okText="Yes"
        cencelText="No, For this client only"
        className="client_confirmation"
      />
    </>
  );
};

export default AddDocumentModal;
