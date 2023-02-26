import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DrossierInput } from "..";
import { fetchCategories } from "../../store/actions";
import { SET_CATEGORY_LIST } from "../../store/constants";
import SingleCategoryDetails from "./SingleCategoryDetails";

const CategoriesList = () => {
  const [searchValue, setSerachVale] = useState("");
  const [selectCategory, setSelectCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const categoryList = useSelector((state) => state?.categories?.list || []);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  // fetch all categories
  const GetAllCategories = async () => {
    setLoading(true);
    const data = await dispatch(fetchCategories());
    if (data?.length > 0) {
      setCategories(data);
      setSelectCategory(data[0]);
    } else setSelectCategory({});
    setLoading(false);
    setSerachVale("");
  };
  useEffect(() => {
    GetAllCategories();
  }, []);

  const onSearch = (e) => {
    const value = e.target.value;
    setSerachVale(value);
    const list = categories.filter((item) => {
      console.log(item.name);
      return item?.name?.includes(value);
    });
    if (list.length > 0) {
      setSelectCategory(list[0]);
    } else setSelectCategory({});
    dispatch({
      type: SET_CATEGORY_LIST,
      payload: list,
    });
  };
  const onSelectCategory = (category) => setSelectCategory(category);
  return (
    <Spin spinning={loading}>
      <div className="category_subsection">
        <div className="row align-items-center">
          <div className="col-md-3">
            <h3>All Categories</h3>
          </div>
          <div className="col-md-5" style={{ borderRadius: 10 }}>
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
              style={{ height: 40, fontSize: 16, color: "#9D9D9D" }}
            />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3 text-right">
            <Link to="/category/create">Create a Category</Link>
          </div>
        </div>
      </div>
      {categoryList.length === 0 &&
        (searchValue ? (
          <p className="no_category_title">No Categorie found</p>
        ) : (
          <p className="no_category_title">No Categories Created Yet</p>
        ))}
      <div className="row">
        <div className="col-md-3 category_item">
          {categoryList?.map((category) => (
            <DrossierInput
              onClick={onSelectCategory}
              obj={category}
              className={`category_name ${
                selectCategory.id === category.id && "marked"
              }`}
              key={category.id}
              value={category.name}
              readOnly={true}
              labelShow={true}
            />
          ))}
        </div>
        {categoryList.length !== 0 && (
          <SingleCategoryDetails category={selectCategory} />
        )}
      </div>
    </Spin>
  );
};

export default CategoriesList;
