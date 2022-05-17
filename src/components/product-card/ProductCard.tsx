import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addProduct, openCart } from "../../slice/cartSlice";
import "./product-card.scss";

export interface IProductCard {
  id: string;
  image: string[];
  name: string;
  price: number;
  category: string;
  size: string[];
  color: string[];
  gender?: string;
}

const ProductCard = ({ id, image, name, color, size, price }: IProductCard) => {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentThumbnail, setCurrentThumbNail] = useState<string>(image[0]);

  const onMouseLeave = () => {
    setCurrentThumbNail(image[0]);
  };

  const onMouseEnter = () => {
    setCurrentThumbNail(image[1]);
  };

  const handleClick = (event:React.MouseEvent) => {
    event.stopPropagation()

    navigate(`${id}`);
  };
  const addToCartHandle = () => {
    dispatch(
      addProduct({
        id,
        name,
        price,
        image: image[0],
        color: color[0],
        size: size[0],
        quantity: 1,
      })
    );
    dispatch(openCart());
  };
  return (
    <div className="productcard">
      <div
        className="productcard__img"
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        onClick={handleClick}
      >
        <img src={currentThumbnail} alt="" />
        <button className="btn" onClick={addToCartHandle}>
          Add to Cart
        </button>
      </div>
      <div className="productcard__des">
        <div className="name">{name}</div>
        <div className="price">{Number(price).toLocaleString("en-US")}</div>
      </div>
    </div>
  );
};

export default ProductCard;
