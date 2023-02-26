import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuthLayout from "./AuthLayout";
import PrivateLayout from "./PrivateLayout";
import { useMediaQuery } from 'react-responsive';
import MobilePrivateLayout from "./MobilePrivateLayout"


const Layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.token);
  // const [matchMobileView, setMatchMobileView] = useState(window.matchMedia("(max-width: 500px)").matches)
  const isMobileView = useMediaQuery({ query: '(max-width: 500px)' });

  return (
    <div>
      {isAuthenticated && !isMobileView && (
        <PrivateLayout>{children}</PrivateLayout>
      )}

      {isAuthenticated && isMobileView && (
        <MobilePrivateLayout>{children}</MobilePrivateLayout>
      )}

      {!isAuthenticated && (
        <AuthLayout>{children}</AuthLayout>
      )}
    </div>
  );
};

export default Layout;
