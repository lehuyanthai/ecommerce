import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import "./best-sellers.scss";

export interface IPopularCategory {
  price:number,
  name:string,
  img: string[]
}

const BestSellers = () => {
  const [data,setData ] = useState<Array<IPopularCategory>>([]);
  
  useEffect(() => {
    const getPopularCategory = async (): Promise<Array<IPopularCategory>> => {
      const data: Array<any> = [];
      await getDocs(query(collection(db,"popular_catelogy"))).then((result) =>{
        result.forEach(
          (doc) => {
            data.push({
              id: doc.id,
              ...doc.data(),
            });
      })}).catch(error=>console.log(error))
      setData(data)
      return data;
    };
    getPopularCategory();
  }, []);
  
  return (
    <div className="BestSellerComponent">
      <div className="title">This Month’s Best Sellers</div>
      <div className="list">
        {data.map((item, index) => (
          <div key={index} className="list__item">
            <img
              src={item.img[0]}
              alt="/"
              onMouseLeave={(e) => (e.currentTarget.src = item.img[0])}
              onMouseEnter={(e) =>
                (e.currentTarget.src =item.img[1])
              }
            />
            <div className="detail">
              <div className="product">
                <div>{`${item.name} 'S`}</div>
              </div>
              <div className="price">{Number(item.price).toLocaleString('en-us')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
