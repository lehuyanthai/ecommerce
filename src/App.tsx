import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
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
  }, [isSuccess, navigate,dispatch]);

  return (
    <div className="App" style={{ position: "relative" }}>
      {/* <div style={{ height: "30px", backgroundColor: "black" }}></div> */}
      <Header />
      <MainRoutes />
      <Footer />
    </div>
  );
}

export default App;
