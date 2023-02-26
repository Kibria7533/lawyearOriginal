import { Collapse, Spin } from "antd";
import React, { useEffect, useState } from "react";
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

const { Panel } = Collapse;

const SubcategoryList = ({ location }) => {
  const [searchValue, setSerachVale] = useState("");
  const [loading, setLoading] = useState(false);
  const [subcategoryData, setSubcategoryData] = useState({});
  const [openModalNewSubCategory, setOpenModalNewSubCategory] = useState(false);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [allData, setAllData] = useState([]);
  /* const allData = useSelector((state) => state.subcategories.list); */

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
  console.log(subcategoryData);
  useEffect(() => {
    if (data) {
      setAllData(data.category);

      let arr = [];
      for (let element of data.category) {
        arr = [...arr, ...element.subcategories];
      }
      if (subcategoryId)
        setSubcategoryData(arr.find((item) => item.id === subcategoryId));
    }
  }, [data]);

  const dispatch = useDispatch();
  const onSearch = (e) => {
    const value = e.target.value;
    setSerachVale(value);

    // const list = categories.filter((item) => {
    //   console.log(item.name);
    //   return item?.name?.includes(value);
    // });
    // if (list.length > 0) {
    //   setSelectCategory(list[0]);
    // } else setSelectCategory({});
    // dispatch({
    //   type: SET_CATEGORY_LIST,
    //   payload: list,
    // });
  };

  //   const handleSelectSubcategory = (item) => {
  //     setSubcategoryData(item);
  //   };

  const GetAllSubcategories = async () => {
    setLoading(true);
    const data = await fetchAllSubcategoryWithCategory();
    dispatch({
      type: SET_SUBCATEGORY_LIST,
      payload: data?.category,
    });
    setLoading(false);
  };
  useEffect(() => {
    GetAllSubcategories();
  }, []);

  return (
    <>
      <Spin spinning={loading}>
        <div className="category_subsection">
          <div className="row align-items-center">
            <div className="col-md-3">
              <h3>All Categories</h3>
            </div>
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
            <div className="col-md-1"></div>
            <div className="col-md-3 text-right">
              <a onClick={() => setOpenModalNewSubCategory(true)}>
                Create a Sub-Category
              </a>
            </div>
          </div>
        </div>

        <div className="container_all_categories">
          <div style={{ width: "100%" }}>
            <div className="category-collaps ant_active_background">
              <Collapse
                accordion
                expandIconPosition="right"
                onChange={(value) => setActiveItem(value)}
                expandIcon={({ isActive }) =>
                  isActive ? (
                    <img
                      style={{ height: 4, width: 8 }}
                      src="/img/arrow_up.svg"
                    ></img>
                  ) : (
                    <img
                      style={{ width: "10px" }}
                      src="/img/arrow_down.svg"
                    ></img>
                  )
                }
                ghost
                activeKey={Number(activeItem)}
              >
                {allData?.map((category) => (
                  <Panel
                    header={category?.name}
                    key={Number(category.id)}
                    className={`sub_category_name ${
                      Number(activeItem) === Number(category.id) && "marked"
                    }`}

                    /*   showArrow={category?.subcategories?.length > 0 ? true : false} */
                  >
                    {/*   {console.log(Number(activeItem) === Number(category.id))} */}
                    <div className="subcategory-list">
                      {category?.subcategories
                        ?.sort(function (a, b) {
                          return b.name.length - a.name.length;
                        })
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
            </div>
          </div>
          {subcategoryData?.id && (
            <SubCategoryDetails
              subcategoryData={subcategoryData}
              setSubcategoryData={setSubcategoryData}
              allData={allData}
              mutate={mutate}
            />
          )}
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
    </>
  );
};

export default SubcategoryList;
