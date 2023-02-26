import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../store/actions";
import { Link, Router, useHistory, useLocation } from "react-router-dom";
import { clientsMenu, lawyerMenu } from "./sidemenu";
import useSWR from "swr";
import { getAuthData } from "../util/session";
import { BASE_URL } from "../config";
import { fetcherAuth } from "../services/fetcher";

const { Content, Sider } = Layout;
const PrivateLayout = ({ children }) => {
  const [activeKey, setActiveKey] = useState("20");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth || {});
  const { pathname } = useLocation();

  const { data: userQuery } = useSWR(
    [`${BASE_URL}user/my-details`, getAuthData().token],
    fetcherAuth
  );

  const handleLogout = () => {
    dispatch(LogoutUser());
  };
  // console.log(user);
  const onClickMenu = (data) => {
    // if (
    //   data.key === "1" ||
    //   data.key === "10" ||
    //   data.key === "40" ||
    //   data.key === "90"
    // )
    //   return;
    // else
    setActiveKey(data.key);
  };

  const sideMenu = user?.role === "lawyer" ? lawyerMenu : clientsMenu;
  const location = useLocation();

  const router = useHistory();

  console.log(location.pathname);
  return (
    <Layout id="sice_bar" className="side-bar" style={{ minHeight: "100vh" }}>
      <div
        className="side-nav"
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          height: "100vh",
          position: "fixed",
          left: 0,
          background: "#1F295A",
        }}
      >
        <div>
          <div className="logo">
            <Link to="/category/list">
              <img alt="logo" src="/img/logo.svg" />
            </Link>
          </div>

          <div key="hj" style={{ height: "auto" }}></div>
          <div
            className="profile_pic_item"
            onClick={() => router.push("/profile-settings")}
            style={{ cursor: "pointer" }}
          >
            <div className="img_profile" style={{ width: 30, height: 30 }}>
              <img
                src={userQuery?.profile_pic || "/img/no_profile_pic.svg"}
                style={{ width: 30, height: 30 }}
                className="img_profile"
              />
            </div>
            <h3
              style={{
                color: "#fff",
                fontSize: 14,
                margin: 0,
                fontWeight: "500",
              }}
            >
              {userQuery?.user_id}
            </h3>
          </div>
          <h4
            className="profile_pic_item"
            style={{
              fontSize: 12,
              color: "white",
              marginTop: 4,
              cursor: "pointer",
            }}
            onClick={() => router.push("/profile-settings")}
          >
            {userQuery?.email}
          </h4>

          <p
            className="profile_pic_item"
            style={{ marginTop: 6, fontSize: 12, color: "#A0A0A0" }}
          >
            {/*        Manager, Finance, Admin{" "} */}
            {userQuery?.lawyer_categories?.map(
              (item, index) =>
                `${item}${
                  index + 1 < userQuery?.lawyer_categories?.length ? "," : ""
                } `
            )}
          </p>
          <div style={{ marginTop: 24 }}>
            {sideMenu?.map((menu, index) => (
              <Link to={`${menu.path}`} key={index}>
                <div
                  className={` ${
                    location?.pathname === menu.path
                      ? "side_nav_icon_hovered"
                      : "side_nav_item"
                  }`}
                >
                  <img src={menu.img} style={{ width: 17 }} />
                  {menu.title !== "Manage Sub-Categories" ? (
                    <p>{menu.title}</p>
                  ) : (
                    <div>
                      <p>Manage</p>
                      <p>Sub-Categories</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bottom-menu">
          <Link to={`/profile-settings`}>
            <div
              className={`side_nav_item ${
                (location?.pathname === "/profile-settings" ||
                  location?.pathname === "/subscription" ||
                  location?.pathname === "/billing") &&
                "side_nav_icon_hovered"
              }`}
            >
              <img src="/img/settings.png" style={{ width: 17 }} />
              <p> Settings</p>
            </div>
          </Link>

          <Link to={`/profile-settings`}>
            <div className="side_nav_item">
              <img src="/img/HelpCenter.svg" style={{ width: 17 }} />
              <p> Help Center</p>
            </div>
          </Link>
          <div onClick={handleLogout}>
            <div className="side_nav_item">
              <img src="/img/log-out.svg" style={{ width: 17 }} />
              <p> Log Out</p>
            </div>
          </div>
        </div>
      </div>
      <Content className="private-content">
        <div className="container-fluid">{children}</div>
      </Content>
    </Layout>
  );
};

export default PrivateLayout;

const activeStyle = { color: "#1f295a", fontWeight: "bold" };
