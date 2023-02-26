import React from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const SettingsLayout = ({
  children,
  navbar,
  titleTop = "Settings",
  backButton
}) => {
  const router = useHistory();

  const style = link => {
    return {
      color: router.location.pathname === link && "#1F295A",
      borderBottom: router.location.pathname === link && "1px solid #AFD2E9",
      cursor: "pointer",
      paddingBottom: 2
    };
  };

  return (
    <>
      <div className="settings_container">
        {!navbar && (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="title-settings" style={{ margin: 0 }}>
                Settings
              </h1>
              <Link to="/notifications">
                <img src="/img/bell.svg" style={{ width: 24, height: 24 }} />
              </Link>
            </div>

            <div
              className="d-flex align-items-center"
              style={{ gap: 4, marginBottom: 24 }}
            >
              <img src="/img/arrow_left.svg" style={{ width: 13, height: 6 }} />
              <p
                onClick={() => router.goBack()}
                style={{ color: "#455ECE", fontSize: 16, cursor: "pointer" }}
              >
                Back
              </p>
            </div>

            <div className="nav_bar_settings">
              <p
                style={style("/profile-settings")}
                onClick={() => router.push("/profile-settings")}
              >
                Profile Settings
              </p>
              <p
                style={style("/subscription")}
                onClick={() => router.push("/subscription")}
              >
                Subscription
              </p>
              <p style={style("/company")}>Company</p>
              <p
                style={style("/billing")}
                onClick={() => router.push("/billing")}
              >
                Billing
              </p>
              <p style={style("/users")}>Users</p>
              <p style={style("/permissions")}>Permissions</p>
            </div>
          </>
        )}
        {navbar && (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="title-settings" style={{ marginBottom: 4 }}>
                {titleTop}
              </h1>
              <Link to="/notifications">
                <img src="/img/bell.svg" style={{ width: 24, height: 24 }} />
              </Link>
            </div>
            <div
              className="d-flex align-items-center"
              style={{ gap: 4, marginBottom: 34 }}
            >
              <img src="/img/arrow_left.svg" style={{ width: 13, height: 6 }} />
              <p
                onClick={() => router.goBack()}
                style={{ color: "#455ECE", fontSize: 16, cursor: "pointer" }}
              >
                {navbar}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="logo_class_mobile">
        <img src="/img/logo_mobile.svg" />
        <div
          className="d-flex align-items-center"
          style={{ gap: 4, marginBottom: 24, marginTop: 12 }}
        >
          <img src="/img/arrow_left.svg" style={{ width: 13, height: 6 }} />
          <p
            onClick={() => router.goBack()}
            style={{ color: "#455ECE", fontSize: 16, cursor: "pointer" }}
          >
            Back
          </p>
        </div>
      </div>
      {children}
    </>
  );
};

export default SettingsLayout;
