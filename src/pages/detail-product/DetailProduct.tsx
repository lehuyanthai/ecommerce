import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addProduct, openCart } from "../../slice/cartSlice";
import "./detail-product.scss";

interface IDetailProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string[];
  size: string[];
  image: string[];
}

const DetailProduct = () => {
  const [data, setData] = useState<IDetailProduct>();
  const [currentImg, setCurrentImg] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const dispatch = useAppDispatch();
  let { id } = useParams();

  const addToCartHandle = () => {
    dispatch(
      addProduct({
        id: id as string,
        name: data?.name as string,
        size: selectedSize,
        color: selectedColor,
        price: data?.price as number,
        image: data?.image[0] as string,
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
    setCurrentImg(data?.image[0] as string);
    setSelectedColor(data?.color[0] as string);
    setSelectedSize(data?.size[0] as string);
  }, [data]);

  return (
    <div>
      <div className="detailproduct">
        <div className="image">
          <img className="current__img" src={currentImg} alt="" />
          <div className="list-smallImg">
            {data?.image?.map((item, index) => (
              <div
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
            Add To Bag
          </button>
        </div>
      </div>
      <div className="recommend">
        
      </div>
    </div>
  );
};

export default DetailProduct;
