import React, { useState } from "react";
import { DrossierButton, DrossierInput } from "../components";
import SettingsLayout from "../components/Settings/SettingsLayout";
import { useWindowWidth } from "@react-hook/window-size";
import useSWR from "swr";
import { BASE_URL } from "../config";
import { fetcherAuth } from "../services/fetcher";
import { getAuthData } from "../util";
import { useEffect } from "react";
import { Form, notification, Spin } from "antd";
import { checkExistingUser, fileUploadDoc } from "../store/actions";
import { uploadProfilePic } from "../services/upload";
import { uploadMyUserProfile } from "../services/user";
import { useRef } from "react";
import UpdatePasswordModal from "../components/Profile/UpdatePasswordModal";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [userIdExist, setUserIdExist] = useState(false);
  const [userId, setUserId] = useState(null);
  const [fields, setFields] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    lawyer_categories: [],
    profile_pic: "",
  });
  const [userUpdated, setUserUpdated] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const form = useRef();

  const Categories = ["Civil Law", "Estate Law", "Corporate Law"];

  const { data: user, mutate } = useSWR(
    [`${BASE_URL}user/my-details`, getAuthData().token],
    fetcherAuth
  );

  useEffect(() => {
    if (!user?.lawyer_categories) {
      setFields({ ...user, lawyer_categories: [] });
      setUserUpdated({ ...user, lawyer_categories: [] });
    } else {
      setFields(user);
      setUserUpdated(user);
    }
    setUserId(user?.user_id);
  }, [user]);

  useEffect(() => {
    form.current.resetFields();
  }, [userUpdated]);

  //Handlers
  const fileUpload = async (info) => {
    setFileUploadLoading(true);
    const formData = new FormData();

    const newNamedFile = new File(
      [info],
      `image-${Date.now()}.${
        info.name.split(".")[info.name.split(".").length - 1]
      }`,
      {
        type: info.type,
        lastModified: info.lastModified,
      }
    );

    formData.append("singleFile", newNamedFile);
    const res = await uploadProfilePic(formData, getAuthData()?.token);
    console.log(res);
    if (res?.data?.success) {
      setFields({ ...fields, profile_pic: res?.data?.fileName });
    }
    setFileUploadLoading(false);
  };

  const handleUpdateUser = async () => {
    if (userIdExist) return;
    setLoading(true);
    const res = await uploadMyUserProfile(fields, getAuthData()?.token);

    if (res?.status === 200) {
      notification.success({
        message: res.data,
        placement: "bottomRight",
      });
      mutate();
    }
    setLoading(false);
  };

  const checkUserExist = async (userId) => {
    try {
      const res = await checkExistingUser(userId);
      if (!res.isAbailable) {
        setUserIdExist(true);
      } else {
        setUserIdExist(false);
      }
    } catch (error) {}
  };

  return (
    <SettingsLayout navbar={false} backButton="Back">
      <Spin spinning={!user}>
        <h1
          style={{
            color: "#1F295A",
            fontWeight: "700",
            fontSize: 18,
            marginBottom: 24,
          }}
        >
          Profile Information
        </h1>

        <div className="profile_main_container">
          <div>
            <Spin spinning={fileUploadLoading}>
              <div className="profile_pic_container">
                <div className="img_profile">
                  <img
                    src={fields?.profile_pic || "/img/no_profile_pic.svg"}
                    className="img_profile"
                  />
                </div>

                <div>
                  <span
                    onClick={() =>
                      document.querySelector("#upload-pic").click()
                    }
                  >
                    <p
                      style={{
                        lineHeight: "16px",
                        color: "#455ECE",
                        textAlign: "center",
                        marginTop: 11,
                        fontWeight: "700",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      Upload <br className="hidden_small_screen" /> New Photo
                    </p>
                  </span>
                  <input
                    onChange={(e) => fileUpload(e.target.files[0])}
                    id="upload-pic"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </Spin>
          </div>
          <Form
            ref={form}
            onFinish={handleUpdateUser}
            style={{ width: "100%" }}
            initialValues={fields}
          >
            <div className="inputs_grid_profile">
              <div>
                <DrossierInput
                  className="create_category_input"
                  placeHolder="First Name"
                  type="text"
                  value={fields?.first_name}
                  onChange={(e) =>
                    setFields({ ...fields, first_name: e.target.value })
                  }
                  style={{ fontSize: 18, height: 56 }}
                />
              </div>
              <DrossierInput
                className="create_category_input"
                placeHolder="Last Name"
                type="text"
                value={fields?.last_name}
                onChange={(e) =>
                  setFields({ ...fields, last_name: e.target.value })
                }
                style={{ fontSize: 18, height: 56 }}
              />

              <Form.Item
                name={["user_id"]}
                rules={[{ required: true, message: "the User ID is required" }]}
                style={{ margin: 0 }}
              >
                <DrossierInput
                  className="create_category_input"
                  placeHolder="User ID"
                  type="text"
                  value={fields?.user_id}
                  onChange={(e) => {
                    checkUserExist(e.target.value);
                    setFields({ ...fields, user_id: e.target.value });
                  }}
                  style={{
                    fontSize: 18,
                    height: 56,
                    border:
                      userId === fields?.user_id
                        ? ""
                        : userIdExist
                        ? "1px solid #e94614"
                        : "1px solid #8CE445",
                    boxShadow: userId !== fields?.user_id && "none",
                  }}
                />

                {fields?.user_id?.length > 0 && userId !== fields?.user_id && (
                  <>
                    {userIdExist ? (
                      <div className="exist-userid-text-profile text-right">
                        <p>A user with this ID already exists</p>
                      </div>
                    ) : (
                      <div className="exist-userid-text-profile text-right">
                        <p style={{ color: "#8CE445" }}>
                          This id is available!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Form.Item>

              <Form.Item
                name={["email"]}
                rules={[{ required: true, type: "email" }]}
                style={{ margin: 0 }}
              >
                <DrossierInput
                  className="create_category_input"
                  placeHolder="Email Address"
                  type="text"
                  value={fields?.email}
                  onChange={(e) =>
                    setFields({ ...fields, email: e.target.value })
                  }
                  style={{ fontSize: 18, height: 56 }}
                />
              </Form.Item>
            </div>
            <div className="categories_profile">
              {user?.role === "lawyer" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div>
                    {fields?.lawyer_categories?.length > 0 && (
                      <p style={{ marginLeft: 2, color: "#9D9D9D" }}>
                        Categories
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {fields?.lawyer_categories?.map((item) => (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                            padding: "7px 11px",
                            border: "1px solid #455ECE",
                            borderRadius: 10,
                            marginBottom: 2,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 18,
                              color: "#212121",
                              lineHeight: "24.55px",
                              minHeight: "24.55px",
                            }}
                          >
                            {item}
                          </p>

                          <div
                            onClick={() => {
                              const arr = fields?.lawyer_categories?.filter(
                                (element) => item !== element
                              );
                              setFields({ ...fields, lawyer_categories: arr });
                            }}
                          >
                            <img
                              className="icon_hover"
                              src="/img/close_gray_icon.svg"
                              style={{
                                padding: 2,
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DropDown
                    open={openDropDown}
                    setOpen={setOpenDropDown}
                    options={Categories?.filter(
                      (item) =>
                        !fields?.lawyer_categories?.find(
                          (element) => element === item
                        )
                    )}
                    fields={fields}
                    setFields={setFields}
                  />
                </div>
              ) : (
                <div></div>
              )}
              <DrossierButton
                text="Save Changes"
                disabled={
                  fields?.user_id === user?.user_id &&
                  fields?.email === user?.email &&
                  fields?.first_name === user?.first_name &&
                  fields?.last_name === user?.last_name &&
                  fields?.profile_pic === user?.profile_pic &&
                  fields?.lawyer_categories === user?.lawyer_categories
                }
                loading={loading}
                type="submit"
                style={{
                  opacity:
                    fields?.user_id === user?.user_id &&
                    fields?.email === user?.email &&
                    fields?.first_name === user?.first_name &&
                    fields?.last_name === user?.last_name &&
                    fields?.profile_pic === user?.profile_pic &&
                    fields?.lawyer_categories === user?.lawyer_categories &&
                    "50%",
                }}
              />
            </div>
          </Form>
        </div>

        <span
          style={{
            color: "#455ECE",
            fontWeight: "700",
            fontSize: 16,
            marginTop: 16,
            cursor: "pointer",
          }}
          onClick={() => setOpenModal(true)}
        >
          Change Password
        </span>
      </Spin>
      <UpdatePasswordModal visible={openModal} setVisible={setOpenModal} />
    </SettingsLayout>
  );
};

export default ProfileSettings;

const DropDown = ({ open, setOpen, fields, setFields, disabled, options }) => {
  return (
    <div style={{ marginTop: fields?.lawyer_categories?.length > 0 && 22 }}>
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          position: "relative",
          minWidth: 150,
        }}
        onClick={() => {
          !disabled && setOpen(!open);
        }}
      >
        {options?.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#455ECE",
              fontSize: 16,
              fontWeight: "700",
              cursor: "pointer",
              opacity: open && "0%",
              minHeight: 40.55,
              marginLeft: 10,
            }}
          >
            Add Category
          </div>
        )}

        {open && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "white",
              zIndex: "999",
              border: "1px solid #455ECE",
              fontSize: 16,
              color: "#1F295A",
              overflow: "hidden",
              fontWeight: "400",
              borderRadius: 10,
              width: "100%",
            }}
          >
            {options?.map((item, index) => (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  height: 40.55,
                  padding: "4px 10px",
                  flexWrap: "wrap",
                  minWidth: 150,
                }}
                className="dropdown_item_months d-flex align-items-center justify-content-between"
                onClick={() => {
                  setFields({
                    ...fields,
                    lawyer_categories: [...fields?.lawyer_categories, item],
                  });
                  setOpen(!open);
                }}
              >
                <div className="d-flex align-items-center" style={{ gap: 8 }}>
                  <p>{item}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
