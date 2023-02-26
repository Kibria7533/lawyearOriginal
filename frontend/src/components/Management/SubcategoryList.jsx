import { Collapse, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { DrossierInput } from "..";
import { BASE_URL } from "../../config";
import { fetcher, fetcherAuth } from "../../services/fetcher";
import { fetchAllSubcategoryWithCategory } from "../../store/actions";
import { SET_SUBCATEGORY_LIST } from "../../store/constants";
import { getAuthData } from "../../util";
import SubCategoryDetails from "./SubCategoryDetails";
import AddNewSubCategoryModal from "./AddNewSubCategoryModal";
import AddNewCategoryModal from "./AddNewCategoryModal";
import AllSubCategories from "./AllSubCategories";
import EditCategoryName from "./EditCategoryName";
import { ConfirmationModal } from "../Shared";
import { deleteCategory } from "../../services/category";

const { Panel } = Collapse;

const SubcategoryList = ({ location }) => {
  const [searchValue, setSerachVale] = useState("");
  const [loading, setLoading] = useState(false);
  const [subcategoryData, setSubcategoryData] = useState({});
  const [openModalNewSubCategory, setOpenModalNewSubCategory] = useState(false);
  const [modalCreateNewCategory, setModalCreateNewCategory] = useState(false);
  const [editElement, setEditElement] = useState(null);
  const [deleteElement, setDeleteElement] = useState(null);
  const [dropDownCategoryId, setDropDownCategoryId] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [allData, setAllData] = useState([]);
  //When redirect from created category
  const search = new URLSearchParams(location.search);
  const categoryCreatedId = search.get("createdCategoryId");
  useEffect(() => {
    if (categoryCreatedId) {
      setActiveItem(Number(categoryCreatedId));
      setOpenModalNewSubCategory(true);
    }
  }, [categoryCreatedId]);

  const { data, mutate } = useSWR(
    [`${BASE_URL}subcategory/list-with-category`, getAuthData().token],
    fetcherAuth
  );

  console.log(deleteElement);

  useEffect(() => {
    if (data) {
      setAllData(data.category);
      console.log(data.category);

      let arr = [];
      for (let element of data.category) {
        arr = [...arr, ...element.subcategories];
      }
      /*   if (subcategoryId)
        setSubcategoryData(arr.find((item) => item.id === subcategoryId)); */
    }
  }, [data]);

  const onSearch = (e) => {
    const value = e.target.value;
    setSerachVale(value);
  };

  const handleDeleteCategory = async () => {
    setLoading(true);

    await deleteCategory({ categoryId: deleteElement.id }, getAuthData().token);
    setDeleteElement(null);
    mutate();
    setLoading(false);
  };

  return (
    <>
      <Spin spinning={loading}>
        <div className="category_subsection">
          <div className="row align-items-center">
            <div className="col-md-5">
              <DrossierInput
                labelShow={true}
                className="category_search_input"
                onChange={onSearch}
                value={searchValue}
                prefix={
                  <img
                    src="/img/search-logo.png"
                    alt="search logo"
                    style={{ paddingRight: "7px" }}
                  />
                }
                placeHolder="Search"
                style={{ height: 40 }}
              />
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-3 text-right">
              <a onClick={() => setOpenModalNewSubCategory(true)}>
                Create a Sub-Category
              </a>
            </div>
          </div>
        </div>

        <div className="container_all_categories">
          <div style={{ width: "100%" }}>
            <div className="category-collaps ant_active_background management_collapse">
              <Collapse
                accordion
                expandIconPosition="right"
                onChange={(value) => {
                  setSubcategoryData({});
                  setActiveItem(value);
                }}
                expandIcon={({ isActive }) => <></>}
                ghost
                activeKey={Number(activeItem)}
              >
                <div
                  className={`management_box_subcategory sub_category_name ${
                    activeItem === null && "marked"
                  }`}
                  style={{
                    marginBottom: 8,
                    padding: "12px 16px",
                    fontSize: 18,
                  }}
                  onClick={() => {
                    setSubcategoryData({});
                    setActiveItem(null);
                  }}
                >
                  All Categories
                </div>
                {allData?.map((category) => (
                  <Panel
                    header={
                      <div className="d-flex justify-content-between w-100 position-relative">
                        <div className="d-flex" style={{ gap: 6 }}>
                          {Number(activeItem) === Number(category.id) ? (
                            <img src="/img/arrow_down.svg" />
                          ) : (
                            <img src="/img/arrow_right.svg" />
                          )}
                          <p>{category?.name}</p>
                        </div>
                        <img
                          src="/img/threePointsSvg.svg"
                          style={{ padding: "0px 10px" }}
                          onClick={(event) => {
                            setDropDownCategoryId(category.id);
                            event.stopPropagation();
                          }}
                        />
                        {dropDownCategoryId === category?.id && (
                          <DropDown
                            handleClose={() => setDropDownCategoryId(false)}
                            editElement={editElement}
                            setEditElement={setEditElement}
                            category={category}
                            setDeleteElement={setDeleteElement}
                          />
                        )}
                      </div>
                    }
                    key={Number(category.id)}
                    className={`sub_category_name ${
                      Number(activeItem) === Number(category.id) && "marked"
                    }`}
                  >
                    <div className="subcategory-list">
                      {category?.subcategories
                        /*     ?.sort(function (a, b) {
                          return b.name.length - a.name.length;
                        }) */
                        ?.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => {
                              setSubcategoryData(subcategory);
                              setSubcategoryId(subcategory.id);
                            }}
                            style={{
                              color:
                                subcategoryData?.id === subcategory?.id
                                  ? "#1F295A"
                                  : "",
                              fontWeight:
                                subcategoryData?.id === subcategory?.id
                                  ? "700"
                                  : "",
                            }}
                          >
                            {subcategory?.name || "New Sub-Category"}
                          </button>
                        ))}
                    </div>
                    {category?.subcategories?.length === 0 && (
                      <div className="text_no_sub">
                        <p style={{ marginTop: 12, marginBottom: 12 }}>
                          No Sub-Categories created yet.
                        </p>
                        <p style={{ marginBottom: 20 }}>
                          Press button in up-right corner to Create New
                          Sub-Category
                        </p>
                      </div>
                    )}
                  </Panel>
                ))}
              </Collapse>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: "21.82px",
                  fontWeight: "700",
                  marginTop: 20,
                  color: "#455ECE",
                  cursor: "pointer",
                }}
                onClick={() => setModalCreateNewCategory(true)}
              >
                Create a new Category
              </p>
            </div>
          </div>

          <AllSubCategories
            allData={allData}
            categoryId={activeItem}
            mutate={mutate}
            subcategoryData={subcategoryData}
            setSubcategoryData={setSubcategoryData}
          />
        </div>
      </Spin>
      <AddNewSubCategoryModal
        visible={openModalNewSubCategory}
        setVisible={setOpenModalNewSubCategory}
        data={allData}
        mutate={mutate}
        setActiveItem={setActiveItem}
        setSubcategoryId={setSubcategoryId}
        setSubcategoryData={setSubcategoryData}
        categoryCreatedId={categoryCreatedId}
      />
      <AddNewCategoryModal
        visible={modalCreateNewCategory}
        setVisible={setModalCreateNewCategory}
        mutate={mutate}
        setActiveItem={setActiveItem}
      />
      <EditCategoryName
        editElement={editElement}
        setEditElement={setEditElement}
        mutate={mutate}
      />
      <ConfirmationModal
        visible={deleteElement}
        setVisible={setDeleteElement}
        onCancel={() => setDeleteElement(null)}
        onOk={handleDeleteCategory}
        title={`Are you sure you want to delete ${deleteElement?.name} Category?`}
      />
    </>
  );
};

export default SubcategoryList;

const DropDown = ({
  handleClose,
  setEditElement,
  category,
  setDeleteElement,
}) => {
  const myRef = useRef();
  const handleClickOutside = (e) => {
    const data = myRef.current?.contains(e.target);
    if (!data && data !== undefined) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="drop_down_category"
      ref={myRef}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className="d-flex justify-content-between rename_delete_container"
        onClick={(event) => {
          event.stopPropagation();
          setEditElement(category);
          handleClose();
        }}
      >
        <p style={{ marginRight: 16 }}>Rename Category</p>
        <img src="/img/arrow_up.svg" />
      </div>
      <p
        className="rename_delete_container"
        style={{ color: "#E94614" }}
        onClick={(event) => {
          event.stopPropagation();
          setDeleteElement(category);
          handleClose();
        }}
      >
        Delete Category
      </p>
    </div>
  );
};
