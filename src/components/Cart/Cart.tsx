import clsx from "clsx";
import { addDoc, collection } from "firebase/firestore";
import React from "react";
import * as AiIcons from "react-icons/ai";
import { AiFillLock } from 'react-icons/ai';
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { db } from "../../firebase";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  checkout,
  closeCart,
  decreaseAmount,
  ICartProduct,
  increaseAmount,
  removeProduct,
  reset
} from "../../slice/cartSlice";
import "./cart.scss";

interface ICart {
  products: ICartProduct[];
  quantity: number;
  total: number;
}

const Cart = ({ products, quantity, total }: ICart) => {
  const dispatch = useAppDispatch();
  const cartOpen = useAppSelector((state) => state.cart.isOpen);
  const userEmail = useAppSelector(state => state.user.userEmail) 

  let emptyCart: boolean = products.length === 0 ? true : false;

  const handleOrder =  () => {
    addDoc(collection(db,"orders"),{
      userEmail:userEmail,
      total:total,
      quantity:quantity,
      status:false,
      products:products
    })
  }

  const handletoken = (token: any) => {
    console.log(token);
    if (token) {
      handleOrder()
      dispatch(checkout(true));
      dispatch(reset());
    }
  };
  if (emptyCart) {
    return (
      <>
        <div
          className={cartOpen ? "cart-wrapper active" : "cart-wrapper"}
          onClick={() => dispatch(closeCart())}
        ></div>
        <div className={cartOpen ? "cart active" : "cart"}>
          <div className="cart__header">
            <div>Your Cart</div>
            <div
              onClick={() => dispatch(closeCart())}
              style={{ cursor: "pointer" }}
            >
              &times;
            </div>
          </div>
          <div style={{ fontSize: "25px", margin: "20px" }}>
            Your cart is empty.
            <br />
            Not sure where to start?
          </div>
          <div className="link">
            <Link to="/women/all">Shop Best Sellers</Link>
          </div>
          <img
            className="empty-cart__img"
            src="https://cdn.builder.io/api/v1/image/assets%2F444142b2cae54a19aeb8b5ba245feffe%2F88a6aaa3ca6e4e40a90da397075cd420?format=webp&width=2000"
            alt=""
          />
        </div>
      </>
    );
  }
  return (
    <>
      <div
        className={cartOpen ? "cart-wrapper active" : "cart-wrapper"}
        onClick={() => dispatch(closeCart())}
      ></div>
      <div className={cartOpen ? "cart active" : "cart"}>
        <div className="cart__header">
          <div>Your Cart</div>
          <div
            onClick={() => dispatch(closeCart())}
            style={{ cursor: "pointer" }}
          >
            &times;
          </div>
        </div>
        <div className="cart__content">
          {products.map((item, index) => (
            <div className="cart__content--item" key={index}>
              <img src={item.image} alt="" />
              <div className="cart__info">
                <div className="remove">
                  <div>{item.name}</div>
                  <RiDeleteBin6Line
                    onClick={() => dispatch(removeProduct(item))}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className="color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="size">{item.size}</div>
                </div>
                <div style={{ display: "flex" }}>
                  <div>
                    {`${Number(item.price).toLocaleString("en-US")} x ${
                      item.quantity
                    } `}
                  </div>
                  <div>
                    ={" "}
                    {Number(item.price * item.quantity).toLocaleString("en-US")}
                  </div>
                </div>
              </div>
              <div className="group__button">
                <AiIcons.AiOutlineMinus
                  onClick={() => dispatch(decreaseAmount(item))}
                />
                {item.quantity}
                <AiIcons.AiOutlinePlus
                  onClick={() => dispatch(increaseAmount(item))}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="cart__footer">
          <div className="total">
            <div>Subtotal ({quantity} Items)</div>
            <div>{Number(total).toLocaleString("en-US")}</div>
          </div>
          <div style={{ fontSize: "12px", color: "grey" }}>
            Return within 45 days of purchase.
          </div>
          <StripeCheckout
            stripeKey="pk_test_51K97WlDc9pidVchyPdZnDXvUVgsjrfQolhv5W0Rsjke4JhofWFzbOfCaODkncKfxZlYMoLnZgbagBhPobadt18sK008dG0CnjI"
            token={handletoken}
            billingAddress
            shippingAddress
            name="N A B O A T"
            amount={total/230}
          >
            <button className={clsx("checkout__btn",!userEmail && "disable")} disabled={!userEmail}>{!userEmail&&<AiFillLock/>} Checkout</button>
          </StripeCheckout>
        </div>
      </div>
    </>
  );
};

export default Cart;
