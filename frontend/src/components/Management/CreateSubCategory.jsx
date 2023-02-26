import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DrossierButton, DrossierInput } from "..";
import { fetchCategories, newSubcategory } from "../../store/actions";
import Document from "./Document";
import SelectCategories from "./SelectCategories";
const CreateSubcategory = () => {
  const [questions, setQuestion] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [categoriesId, setCategoriesId] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setSubcategoryLoading] = useState(false);
  const [selectCategory, setSelectCategory] = useState({});
  const dispatch = useDispatch();
  // fetch all categories
  const GetAllCategories = async () => {
    setSubcategoryLoading(true);
    await dispatch(fetchCategories());
    setSubcategoryLoading(false);
  };
  useEffect(() => {
    GetAllCategories();
  }, []);

  const CreateSubCategoryFunction = async () => {
    setLoading(true);
    const data = {
      categoryId: categoriesId,
      name: subcategoryName,
      documents: documents,
      questions: questions,
    };
    try {
      const res = await newSubcategory(data);
      if (res.success) {
        notification.success({
          message: res.message,
          placement: "bottomRight",
        });
        setQuestion([]);
        setDocuments([]);
        setCategoriesId([]);
        setSubcategoryName("");
        setSelectCategory({});
      } else {
      }
      setLoading(false);
    } catch (error) {}
  };

  return (
    <div className="create-category">
      <div
        className="dashboard-subsection d-block"
        style={{ marginBottom: "2rem" }}
      >
        <h3>Create new Sub-Category</h3>
      </div>
      <div className="row">
        <SelectCategories
          categoryLoading={categoryLoading}
          categoriesId={categoriesId}
          setQuestion={setQuestion}
          questions={questions}
          setCategoriesId={setCategoriesId}
          selectCategory={selectCategory}
          setSelectCategory={setSelectCategory}
        />
        <div className="col-md-1"></div>
        <div className="col-md-5">
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#9d9d9d",
                marginLeft: "10px",
                marginTop: "-25px",
                opacity: subcategoryName ? 1 : 0,
              }}
            >
              Sub-Category Name
            </p>
            <DrossierInput
              labelShow
              placeHolder="Sub-Category Name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
            />
          </div>
          <Document setDocuments={setDocuments} document={documents} />
        </div>

        <div>
          <DrossierButton
            text="Create Sub-Category"
            loading={loading}
            disabled={!subcategoryName || categoriesId?.length === 0 || loading}
            onClick={CreateSubCategoryFunction}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSubcategory;
