import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import MainRoutes from "./Routes/MainRoutes";

function App() {
  const isSuccess = useAppSelector((state) => state.cart.isSuccess);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/checkout");
      }, 300);
    }
  }, [isSuccess, navigate, dispatch]);

  return (
    <div className="app">
      <MainRoutes />
    </div>
  );
}
// test commit branch
//new branch
export default App;
