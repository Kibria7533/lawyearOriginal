import React, { useEffect, useState } from "react";

//Antd
import { Input, Spin, Tooltip } from "antd";

//Icons
import { ReactComponent as SvgDelete } from "../../assets/delete.svg";
import { ReactComponent as SvgEdit } from "../../assets/edit.svg";
import SubCategoryDetails from "./SubCategoryDetails";
import { deleteSubcategory } from "../../store/actions";
import { useDispatch } from "react-redux";
import { updateSubcategory } from "../../services/subcategories";
import { getAuthData, setCategoriesData } from "../../util";
import EditSubCategoryName from "./EditSubCategoryName";
import DeleteSubCategoryName from "./DeleteSubCategoryName";
import { ConfirmationModal } from "../Shared";

const AllSubCategories = ({
  categoryId,
  mutate,
  subcategoryData,
  setSubcategoryData,
  allData,
}) => {
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editElement, setEditElement] = useState(null);
  const [visibleDeleteElement, setVisibleDeleteElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  console.log(allData);

  useEffect(() => {
    if (categoryId) {
      const element = allData?.find(
        (item) => Number(item?.id) === Number(categoryId)
      );
      setSubCategories([element]);
    } else {
      setSubCategories(allData);
    }

    let arr = [];
    for (let element of allData) {
      arr = [...arr, ...element.subcategories];
    }

    setSubcategoryData(arr?.find((item) => item?.id === subcategoryData?.id));
  }, [allData, categoryId]);

  // delete subcategory
  const handleDeleteSubCategory = async (id, categoryId) => {
    try {
      const res = await dispatch(
        deleteSubcategory({
          subcategoryId: id,
          categoryId,
        })
      );
      if (res.success) {
        setVisibleDeleteElement(null);
        setSubcategoryData({});
        mutate();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <EditSubCategoryName
        editElement={editElement}
        setEditElement={setEditElement}
        mutate={mutate}
      />
      <ConfirmationModal
        visible={visibleDeleteElement}
        setVisible={setVisibleDeleteElement}
        onCancel={() => {
          setVisibleDeleteElement(null);
        }}
        onOk={async () => {
          handleDeleteSubCategory(
            visibleDeleteElement?.subcategoryId,
            visibleDeleteElement?.categoryId
          );
        }}
        title="Are you sure you want to delete “Sub-Category Name” and all Questions and Documents in this sub-Category?"
        okText="Yes, Delete"
        cencelText="Cancel"
        deleteButton={true}
      />
      {subcategoryData?.id ? (
        <SubCategoryDetails
          subcategoryData={subcategoryData}
          setSubcategoryData={setSubcategoryData}
          allData={allData}
          mutate={mutate}
        />
      ) : (
        <div className="all_subcategories_container">
          <h1 style={{ marginBottom: 28 }}>All Sub-Categories</h1>
          <div>
            {subCategories?.map((item, index) => (
              <section key={item?.id}>
                <h2>{item?.name}</h2>
                <div className="management_all_subcategories">
                  {item?.subcategories?.map((element) => (
                    <div
                      key={element.id}
                      className="management_box_subcategory"
                      onClick={() => setSubcategoryData(element)}
                    >
                      <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ marginBottom: 20, gap: 10 }}
                      >
                        <h3>{element?.name}</h3>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
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
                            <SvgEdit
                              style={{
                                height: 14,
                                width: 14,
                                cursor: "pointer",
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSubCategoryName(element.name);
                                setEditElement(element);
                              }}
                            />
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
                            <SvgDelete
                              style={{
                                height: 14,
                                width: 14,
                                cursor: "pointer",
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                                setVisibleDeleteElement({
                                  subcategoryId: element.id,
                                  categoryId: item.id,
                                });
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                      <div className="d-flex" style={{ gap: 6 }}>
                        <p style={{ fontWeight: "700" }}>
                          {element?.questions?.length}
                        </p>
                        <p>Questions</p>
                      </div>
                      <div className="d-flex" style={{ gap: 6 }}>
                        <p style={{ fontWeight: "700" }}>
                          {element?.documents?.length}
                        </p>
                        <p>Documents</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AllSubCategories;

const inputStyle = {
  border: "1px solid #AFD2E9",
  fontSize: 16,
  color: "#1F295A",
  padding: "4px 12px",
  fontWeight: "400",
  borderRadius: 10,
  marginBottom: 4,
};
