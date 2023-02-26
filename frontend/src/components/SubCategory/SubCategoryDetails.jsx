import React, { useEffect, useState } from "react";
import { Collapse, Input, Tooltip } from "antd";
import UpdateSubcategoryModal from "./UpdateSubcategoryModal";
import AddSubcategoryQuesModal from "./AddSubcategoryQuesModal";
import AddDocumentModal from "./AddDocumentModal";
import { ConfirmationModal } from "../Shared";
import { useDispatch } from "react-redux";
import {
  deleteDocument,
  deleteSubcategory,
  updateSubcateogry,
} from "../../store/actions";
import Question from "./Question";
import QuestionExisting from "./QuestionExisting";
import UpdateDocumentModal from "./UpdateDocumentModal";
import QuestionInputDocumentEdit from "./QuestionInputDocumentEdit";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import UpdateRelationCategories from "./UpdateRelationCategories";
import { updateSubcategory } from "../../services/subcategories";
import { getAuthData } from "../../util";

import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import { ReactComponent as SvgEdit } from "../../assets/edit.svg";

const { Panel } = Collapse;
const SubCategoryDetails = ({
  subcategoryData,
  setSubcategoryData,
  allData,
  mutate,
}) => {
  const [subCategoryEditVisible, setSubcategoryEditVisible] = useState(false);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [subCategoryQuesVisible, setSubcategoryQuesVisible] = useState(false);
  const [subCategoryDocuVisible, setSubcategoryDocuVisible] = useState(false);
  const [allCategoriesRelated, setAllCategoriesRelated] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputField, setInputField] = useState(false);

  const [deleteSubVisible, setDeleteSubVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const dispatch = useDispatch();

  // delete subcategory
  const handleDeleteSubCategory = async () => {
    try {
      const res = await dispatch(
        deleteSubcategory({
          subcategoryId: subcategoryData.id,
          categoryId: subcategoryData.categoryId,
        })
      );
      if (res.success) {
        setDeleteSubVisible(false);
        setSubcategoryData({});
        mutate();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // question delete
  const handleDeleteDocument = async (id) => {
    try {
      await dispatch(
        deleteDocument({
          id: id,
          subcategoryId: subcategoryData.id,
          categoryId: subcategoryData.categoryId,
        })
      );
      mutate();
    } catch (error) {}
  };
  const { name, questions, documents } = subcategoryData;
  // console.log({qu})

  const saveSubCategoryName = async () => {
    setLoading(true);

    await updateSubcategory(
      { name: subCategoryName, id: subcategoryData?.id },
      getAuthData().token
    );

    setSubcategoryEditVisible(false);
    mutate();
    setLoading(false);
  };

  useEffect(() => {
    if (subcategoryData?.name === "") {
      setSubcategoryEditVisible(true);
      setSubCategoryName("");
    } else {
      setSubCategoryName(subcategoryData?.name || "");
    }

    let newArr = [];
    for (let element of allData) {
      for (let subcategory of element.subcategories) {
        if (subcategory.id === subcategoryData.id) {
          newArr = [...newArr, element];
        }
      }
    }

    setAllCategoriesRelated(newArr);
  }, [subcategoryData]);

  return (
    <div style={{ width: "100%", paddingBottom: "10rem" }}>
      <div className="subcategory_header">
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ marginBottom: 28 }}
        >
          {subCategoryEditVisible ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 0,
                fontSize: 18,
                fontWeight: "400",
                maxWidth: 420,
                border: "1px solid #455ECE",
                padding: "16px 11px",
                height: 56,
                borderRadius: 10,
                width: "100%",
              }}
            >
              <Input
                placeholder="Sub-Category Name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                bordered={false}
                style={{ fontSize: 18 }}
                onPressEnter={saveSubCategoryName}
              />
              <p
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#455ECE",
                  cursor: "pointer",
                }}
                onClick={saveSubCategoryName}
              >
                Save
              </p>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <h3 className="mr-2" style={{ marginRight: "8px" }}>
                {name}
              </h3>
              <div>
                {/*      <img
                  src="/img/edit.svg"
                  alt="edit icon"
                  onClick={() => setSubcategoryEditVisible(true)}
                /> */}
                <SvgEdit onClick={() => setSubcategoryEditVisible(true)} />
              </div>
            </div>
          )}

          <div className="d-flex category_details_right">
            <p
              className="delete_category"
              onClick={() => setDeleteSubVisible(true)}
            >
              Delete Sub-Category
            </p>
          </div>
        </div>
        <div className="all_categories_container" style={{ marginBottom: 42 }}>
          <p className="all_categories_showed" style={{ marginRight: 4 }}>
            Main Category/Categories:{" "}
            <span className="all_categories_showed_result">
              {allCategoriesRelated.map((item, index) => (
                <>
                  {item?.name}
                  {index + 1 < allCategoriesRelated.length && ","}{" "}
                </>
              ))}
            </span>{" "}
          </p>
          {/*       <img
            src="/img/edit.svg"
            alt="fess"
            onClick={() => setCategoriesVisible(true)}
          /> */}
          <SvgEdit onClick={() => setCategoriesVisible(true)} />
        </div>
      </div>

      {/*       <UpdateSubcategoryModal
        visible={subCategoryEditVisible}
        setVisible={setSubcategoryEditVisible}
        data={subcategoryData}
      /> */}
      <AddSubcategoryQuesModal
        visible={subCategoryQuesVisible}
        setVisible={setSubcategoryQuesVisible}
        data={subcategoryData}
      />
      <UpdateRelationCategories
        visible={categoriesVisible}
        setVisible={setCategoriesVisible}
        data={allData}
        activeCategories={allCategoriesRelated}
        subcategoryData={subcategoryData}
        mutate={mutate}
      />

      <AddDocumentModal
        visible={subCategoryDocuVisible}
        setVisible={setSubcategoryDocuVisible}
        data={subcategoryData}
      />
      <ConfirmationModal
        visible={deleteSubVisible}
        setVisible={setDeleteSubVisible}
        onCancel={() => setDeleteSubVisible(false)}
        onOk={handleDeleteSubCategory}
        title="Delete Subcategry"
      />
      <div className={`category-collaps`}>
        <Collapse
          expandIconPosition="right"
          expandIcon={({ isActive }) =>
            isActive ? (
              <img
                style={{ height: 4, width: 8 }}
                alt="active"
                src="/img/arrow_up.svg"
              />
            ) : (
              <img
                style={{ height: 4, width: 8 }}
                alt="active"
                src="/img/arrow_down.svg"
              />
            )
          }
          ghost
        >
          <Panel
            header={
              <div className={`d-flex`}>
                <p>Questions</p>
                <p
                  style={{
                    margin: "0px 0px 10px 2px",
                    fontSize: 14,
                    color: "#455ECE",
                  }}
                >
                  {questions?.length || 0}
                </p>
              </div>
            }
            key="1"
            showArrow={questions?.length > 0 ? true : false}
          >
            <QuestionExisting
              questions={questions}
              data={subcategoryData}
              mutate={mutate}
            />
          </Panel>
          <Panel
            header={
              <div className="d-flex">
                <p>Document</p>
                <p
                  style={{
                    margin: "0px 0px 10px 2px",
                    fontSize: 14,
                    color: "#455ECE",
                  }}
                >
                  {documents?.length || 0}
                </p>
              </div>
            }
            key="3"
            showArrow={documents?.length > 0 ? true : false}
          >
            <div className="question-list" style={{ width: "100%" }}>
              {/*     <UpdateDocumentModal
                itemId={documentId}
                data={subcategoryData}
                visible={visible}
                setVisible={setVisible}
                documentName={documentName}
              /> */}
              {documents?.map((document, index) => (
                <div
                  key={document.id}
                  className="single-ques "
                  style={{ borderBottom: "1px solid white" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="indexing d-inline-block">
                      {index + 1}.
                    </span>
                    {documentId !== document.id ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div className="ques-title">{document?.name || ""}</div>
                        <div
                          className="action"
                          style={{ cursor: "pointer" }}
                          style={{ display: "flex", gap: 6 }}
                        >
                          <Tooltip
                            placement="bottom"
                            color="#DBF1FF"
                            title="Edit"
                            overlayInnerStyle={{
                              color: "#1F295A",
                              fontWeight: 600,
                            }}
                            overlayStyle={{ borderRadius: 4 }}
                          >
                            <div style={{ cursor: "pointer" }}>
                              <SvgEdit
                                onClick={() => {
                                  setVisible(true);
                                  setDocumentId(document.id);
                                  setDocumentName(document.name);
                                }}
                              />
                            </div>
                          </Tooltip>
                          <Tooltip
                            placement="bottom"
                            color="#DBF1FF"
                            title="Delete"
                            overlayInnerStyle={{
                              color: "#1F295A",
                              fontWeight: 600,
                            }}
                            overlayStyle={{ borderRadius: 4 }}
                          >
                            <div style={{ cursor: "pointer" }}>
                              <SvgDelete
                                onClick={() =>
                                  handleDeleteDocument(document.id)
                                }
                              />
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: "100%" }}>
                        <QuestionInputDocumentEdit
                          handleClose={() => setInputField(false)}
                          data={subcategoryData}
                          documentId={documentId}
                          documentName={documentName}
                          itemId={documentId}
                          setVisible={setVisible}
                          setDocumentId={setDocumentId}
                          mutate={mutate}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!inputField && (
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#455ECE",
                    paddingTop: 16,
                    cursor: "pointer",
                  }}
                  onClick={() => setInputField(true)}
                >
                  Add a Document
                </p>
              )}
              {inputField && (
                <QuestionInputDocumentEdit
                  handleClose={() => setInputField(false)}
                  data={subcategoryData}
                  mutate={mutate}
                />
              )}
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default SubCategoryDetails;
