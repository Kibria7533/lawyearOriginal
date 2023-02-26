import { CloseCircleOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { DrossierInput } from "..";
import { fetcherAuth } from "../../services/fetcher";
import {
  addDocumentNameSubCategory,
  updateDocumentNameSubCategory,
} from "../../services/subcategories";
import {
  addDocumentSubcategory,
  fetchAllSubcategoryWithCategory,
  fetchQuesSuggestions,
} from "../../store/actions";
import { updateDocument } from "../../store/actions";
import { SET_SUBCATEGORY_LIST } from "../../store/constants";
import { getAuthData } from "../../util";
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import { ReactComponent as SvgEdit } from "../../assets/edit.svg";

const QuestionInputDocument = ({
  addQuestion,
  placeHolder,
  handleClose,
  documentId,
  documentName: defaultDocumentName,
  data,
  itemId,
  setVisible,
  setDocumentId,
  mutate,
}) => {
  const [show, setShow] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [suggetions, setSuggestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentName, setDocumentName] = useState("");

  const dispatch = useDispatch();

  const handleQuestion = async (e) => {
    setQuestionText(e.target.value);
    const res = await fetchQuesSuggestions({ name: e.target.value });
    setSuggestion(res);
  };
  const onEnter = () => {
    if (documentName) {
      addDocument();
    }
  };

  useEffect(() => {
    if (defaultDocumentName) {
      setDocumentName(defaultDocumentName);
    }
  }, [defaultDocumentName]);

  const addDocument = async () => {};

  const updateOrAddDocument = async () => {
    if (itemId) {
      setLoading(true);

      await updateDocumentNameSubCategory(
        {
          name: documentName,
          categoryId: data?.categoryId,
          subcategoryId: data?.id,
          id: itemId,
        },
        getAuthData().token
      );

      setVisible(false);
      mutate();
      setLoading(false);
      setDocumentId(null);
    } else {
      setLoading(true);

      await addDocumentNameSubCategory(
        {
          name: documentName,
          subcategoryId: data?.id,
          categoryId: data?.categoryId,
        },
        getAuthData().token
      );

      handleClose();
      mutate();
      setDocumentName("");
      setLoading(false);
    }
  };

  return (
    <div className="input_add_document">
      <DrossierInput
        labelShow
        onFocus={() => setShow(true)}
        onEnter={updateOrAddDocument}
        // onBlur={() => setShow(false)}
        style={{ padding: "0.5rem 1.25rem" }}
        placeHolder={placeHolder || "Document"}
        onChange={(e) => setDocumentName(e.target.value)}
        value={documentName}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <p
          style={{
            color: "#455ECE",
            fontWeight: "700",
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={updateOrAddDocument}
        >
          Save
        </p>
        <Tooltip
          placement="bottom"
          color="#DBF1FF"
          title="Delete"
          overlayInnerStyle={{ color: "#1F295A", fontWeight: 600 }}
          overlayStyle={{ borderRadius: 4 }}
        >
          {/*          <img
            src="/img/delete.svg"
            alt="fess"
            onClick={handleClose}
            style={{ height: 14, width: 14, cursor: "pointer" }}
          /> */}
          <SvgDelete
            onClick={handleClose}
            style={{ height: 14, width: 14, cursor: "pointer" }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default QuestionInputDocument;
