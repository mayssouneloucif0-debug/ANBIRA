import { Navigate } from "react-router-dom";

function ProtectedManagerRoute({ children }) {
  const token = localStorage.getItem("managerToken");

  if (!token) {
    return <Navigate to="/manager/login" replace />;
  }

  return children;
}

export default ProtectedManagerRoute;