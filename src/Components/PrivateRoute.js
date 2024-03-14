import React from "react";
import { Route, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authSession } = useAuth();
  const navigate = useNavigate();
  return (
    <Route
      {...rest}
      render={(props) =>
        authSession ? <Component {...props} /> : navigate("/connexion")
      }
    />
  );
};

export default PrivateRoute;
