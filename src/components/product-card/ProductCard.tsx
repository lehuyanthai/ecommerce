import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addProduct, openCart } from "../../slice/cartSlice";
import "./product-card.scss";


export interface IProductCard {
  id:string;
  image: string[];
  name: string;
  price: number;
  category:string;
  size:string[];
  color:string[];
  gender?:string;
}

const ProductCard = ({id, image, name,color,size, price,gender }: IProductCard) => {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleClick:(id:string)=>void = (id:string) => { 
    navigate(`${id}`)
  }
  const addToCartHandle = () => { 
    dispatch(addProduct({id,name,price,image:image[0],color:color[0],size:size[0],quantity:1}))
    dispatch(openCart())
  }
  return (
    <div className="productcard" >
      <div className="productcard__img">
        <img
          src={image[0]}
          alt=""
          onMouseLeave={(e) => (e.currentTarget.src = image[0])}
          onMouseEnter={(e) => (e.currentTarget.src = image[1])}
          onClick={()=>handleClick(id)}
        />
        <button className="btn" onClick={addToCartHandle}>Add to Cart</button>
      </div>
      <div className="productcard__des">
        <div className="name">{name}</div>
        <div className="price">{Number(price).toLocaleString("en-US")}</div>
      </div>
    </div>
  );
};

export default ProductCard;
