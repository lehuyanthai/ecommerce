import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { checkout } from "../../slice/cartSlice";
import "./checkout.scss";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(checkout(false));
  };
  return (
    <div className="checkout">
      <img
        src="https://www.clipartmax.com/png/full/179-1795386_patient-success-success-icon-png.png"
        alt=""
      />
      <div className="title">Thank you for your purchase!</div>
      <div className="group__button">
        <Link to="/" onClick={handleClick} className="button">
          Home
        </Link>
        <Link to="/women/all" onClick={handleClick} className="button">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
