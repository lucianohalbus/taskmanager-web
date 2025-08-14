import { Outlet } from "react-router-dom";
import AuthInterceptorBridge from "../auth/AuthInterceptorBridge";

export default function AppRoot() {
  return (
    <>
      <AuthInterceptorBridge />
      <Outlet />
    </>
  );
}
