import { Draft, ClientDetails } from "../components";
import {
  Signin,
  CategoryManagement,
  Signup,
  RegistrationConfirmation,
  ForgotPassword,
  RestorePassword,
  SubCategoryManagement,
  ClientManagement,
  FilePage,
  Request,
  Billing,
  Subscription,
  AddPaymentMethod,
  ProfileSettings,
  Dashboard,
  Management,
} from "../pages";
import Messages from "../pages/Messages";
import Notifications from "../pages/Notifications";

// Authentication
export const Auth = [
  { path: "/", exact: true, component: Signin },
  { path: "/signup", exact: true, component: Signup },
  {
    path: "/reg-confirmation",
    exact: true,
    component: RegistrationConfirmation,
  },
  { path: "/recovery-password", exact: true, component: ForgotPassword },
  { path: "/restore-password/:id", component: RestorePassword },
];

export const PrivatePagesCommon = [
  // { path: "/requests", component: FilePage },
];

export const LawerPages = [
  { path: "/category", component: CategoryManagement },
  { path: "/subcategory", component: SubCategoryManagement },
  { path: "/client", component: ClientManagement },
  { path: "/draft", component: Draft },
  { path: "/billing", component: Billing },
  { path: "/subscription", component: Subscription },
  { path: "/payment-method", component: AddPaymentMethod },
  { path: "/profile-settings", component: ProfileSettings },
  { path: "/dashboard", component: Dashboard },
  { path: "/management", component: Management },
  { path: "/messages", component: Messages },
  { path: "/notifications", component: Notifications },
];

export const ClientsPages = [
  { path: "/draft-client", component: Draft },
  { path: "/file", component: FilePage },
  { path: "/requests", component: Request },
];
