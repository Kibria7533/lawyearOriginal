import React, { useState, useEffect } from "react";
import MobilePrivateHeader from "./MobilePrivateHeader";
import { CloseOutlined } from "@ant-design/icons";
import { Space, Divider } from "antd";
import { Link, useLocation } from "react-router-dom";

const menuList = [
  {
    title: "Dashboard",
    path: "/dashboard",
    img: "/img/dashboard.svg"
  },
  {
    title: "Draft Files",
    path: "/draft/list",
    img: "/img/draft_files.svg"
  },
  {
    title: "Clients",
    path: "/client/list",
    img: "/img/Clients.svg"
  },
  {
    title: "Data Bank",
    path: "/category/list",
    img: "/img/categories.svg"
  }
];

const MobilePrivateLayout = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setOpenMenu(false);
  };

  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openMenu]);

  return (
    <div id="mobile_private_layout">
      <MobilePrivateHeader open={() => setOpenMenu(true)} />
      <div className={`menu ${!openMenu && "menu_hidden"}`}>
        <div className="d-flex justify-content-between align-items-center my-3 mx-3">
          <div></div>
          <Link to="/" onClick={closeMenu}>
            <img
              src="/img/logo.svg"
              alt="Dossier Direct"
              style={{ height: 18, width: 145 }}
            />
          </Link>
          <CloseOutlined style={{ fontSize: 24 }} onClick={closeMenu} />
        </div>

        <div>
          <div className="profile_overview" style={{ padding: "0 32px" }}>
            <div className="d-flex align-items-center">
              <img src="/img/no_profile_pic.svg" alt="Me" />
              <h3>Profile</h3>
            </div>
            <h5>shoaibirshadch@gmail.com</h5>
            <h6>Manager, Finance, Admin</h6>
          </div>

          <Link to={`/notifications`} onClick={closeMenu}>
            <div className={`side_nav_item ${(location.pathname ===
                "/notifications" ) &&
                "side_nav_icon_hovered"}`}>
              <img src="/img/bell.svg" style={{ width: 17 }} />
              <p> Notifications</p>
              <p
                className="d-flex justify-content-center align-items-center"
                style={{
                  minWidth: 16,
                  minHeight: 16,
                  fontSize: 12,
                  background: "#fff",
                  borderRadius: "50%",
                  color: "#1F295A"
                }}
              >
                4
              </p>
            </div>
          </Link>

          <div className="divider" />

          <div>
            {menuList.map((menu, index) => (
              <Link to={`${menu.path}`} key={index} onClick={closeMenu}>
                <div
                  className={`side_nav_item ${location.pathname === menu.path &&
                    "side_nav_icon_hovered"}`}
                >
                  <img src={menu.img} style={{ width: 17 }} />
                  <p>{menu.title}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="divider" />

          <Link to={`/profile-settings`} onClick={closeMenu}>
            <div
              className={`side_nav_item ${(location.pathname ===
                "/profile-settings" ) &&
                "side_nav_icon_hovered"}`}
            >
              <img src="/img/settings.png" style={{ width: 17 }} />
              <p> Settings</p>
            </div>
          </Link>

          <Link to={`/profile-settings`} onClick={closeMenu}>
            <div className="side_nav_item">
              <img src="/img/HelpCenter.svg" style={{ width: 17 }} />
              <p> Help Center</p>
            </div>
          </Link>
          <div onClick={() => {}} onClick={closeMenu}>
            <div className="side_nav_item">
              <img src="/img/log-out.svg" style={{ width: 17 }} />
              <p> Log Out</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">{children}</div>
    </div>
  );
};

export default MobilePrivateLayout;
