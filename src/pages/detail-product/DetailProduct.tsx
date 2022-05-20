import { doc, getDoc } from "firebase/firestore";
import { isNil, isNull } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addProduct, openCart } from "../../slice/cartSlice";
import "./detail-product.scss";

export interface IDetailProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string[];
  size: string[];
  image: string[];
}

const DetailProduct = () => {
  const [data, setData] = useState<IDetailProduct|null>(null);
  const [currentImg, setCurrentImg] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const dispatch = useAppDispatch();
  let { id } = useParams();
  
  const navigate = useNavigate()

  const addToCartHandle = () => {
    dispatch(
      addProduct({
        id: !isNil(id) ? id : '',
        name: !isNull(data)? data.name: '',
        size: selectedSize,
        color: selectedColor,
        price: !isNull(data)? data.price: 0,
        image: !isNull(data)? data.image[0]: '',
        quantity: 1,
      })
    );
    dispatch(openCart());
  };

  useEffect(() => {
    const getProductData = async (): Promise<IDetailProduct> => {
      let data: any = {};
      const path = window.location.pathname.split("/")[1];
      const ppRef = doc(db, `collection_${path}`, `${id}`);
      const docSnap = getDoc(ppRef);

      if ((await docSnap).exists()) {
        data = { ...(await docSnap).data() };
        setData(data);
        return data;
      } else {
        navigate("/")
        console.log("No such document!");
      }
      return data;
    };
    getProductData();
  }, [id]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    setCurrentImg(!isNull(data)? data.image[0]: '');
    setSelectedColor(!isNull(data)? data.color[0]: '');
    setSelectedSize(!isNull(data)? data.size[0]: '');
  }, [data]);

  return (
      <div className="detailproduct">
        <div className="image">
          <img className="current__img" src={currentImg} alt="" />
          <div className="list-smallImg">
            {data?.image?.map((item, index) => (
              <div
               key={index}
                className={
                  item === currentImg
                    ? "smallImg-wrap selected"
                    : "smallImg-wrap"
                }
                onClick={() => setCurrentImg(item)}
              >
                <img key={index} className="smallImg" src={item} alt="" />
              </div>
            ))}
          </div>
        </div>
        <div className="info">
          <div className="name__price">
            <div className="name">{data?.name}</div>
            <div className="price">
              {Number(data?.price).toLocaleString("en-us")}
            </div>
          </div>
          <div className="color">
            Color
            <div className="list__color">
              {data?.color?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(item)}
                  className={
                    item === selectedColor
                      ? "list__color--item selected"
                      : "list__color--item"
                  }
                  style={{ backgroundColor: item }}
                ></div>
              ))}
            </div>
          </div>
          <div className="size">
            Select a Size
            <div className="list__size">
              {data?.size?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSize(item)}
                  className={
                    item === selectedSize
                      ? "list__size--item selected"
                      : "list__size--item"
                  }
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <button className="info__btn" onClick={addToCartHandle}>
            Add To Cart
          </button>
        </div>
      </div>
  );
};

export default DetailProduct;
