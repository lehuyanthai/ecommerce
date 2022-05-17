import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IProductCard } from "../../components/product-card/ProductCard";
import { db } from "../../firebase";
import { IOrder } from "../orders/Orders";
import "./dashboard.scss";
import graph from "./graph.png";

const Dashboard = () => {
  const navigate = useNavigate()

  const [products, setProducts] = useState<Array<IProductCard>>([]);
  const [orders, setOrders] = useState<Array<IOrder>>([]);

  useEffect(() => {
    const getProductData = async (): Promise<Array<IProductCard>> => {
      const womenData: Array<any> = [];
      const menData: Array<any> = [];
      const collectionWomen = collection(db, `collection_women`);
      let womenQuery = query(collectionWomen);
      const collectionMen = collection(db, `collection_men`);
      let menQuery = query(collectionMen);

      await getDocs(womenQuery).then((result) => {
        result.forEach((doc) => {
          womenData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });

      await getDocs(menQuery).then((result) => {
        result.forEach((doc) => {
          menData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
      setProducts(womenData.concat(menData));
      return womenData.concat(menData);
    };
    
    const getOrdersData = async (): Promise<Array<IOrder>> => {
      const data: Array<any> = [];
      const collectionRef = collection(db, "orders");
      let q = query(collectionRef);

      await getDocs(q).then((result) => {
        result.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
      setOrders(data);
      return data;
    };
    getOrdersData();
    getProductData();
  }, []);

  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    return date + " - " + month + " - " + year; //format: dd-mm-yyyy;
  };

  return (
    <div className="dashboard">
      <div className="group__card">
        <div className="card date">
          <div className="top__side">
            <div>
              <div style={{ fontSize: "30px" }}>{getCurrentDate()}</div>
              <div style={{ fontSize: "20px", fontWeight: "300" }}>Date</div>
            </div>
            <BiTimeFive color="white" size={35} />
          </div>
        </div>
        <div className="card order" onClick={()=>navigate("/orders")}>
          <div className="top__side">
            <div>
              <div style={{ fontSize: "30px" }}>{orders.length}</div>
              <div style={{ fontSize: "20px", fontWeight: "300" }}>
                Total Orders
              </div>
            </div>
            <AiOutlineFileText color="white" size={35} />
          </div>
        </div>
        <div className="card revenue">
          <div className="top__side">
            <div>
              <div style={{ fontSize: "30px" }}>
                {Number(
                  orders
                    .filter((item) => item.status)
                    .map((item) => item.total)
                    .reduce((item, total) => item + total, 0)
                ).toLocaleString("en-us")}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "300" }}>Revenue</div>
            </div>
            <RiMoneyDollarCircleLine color="white" size={35} />
          </div>
        </div>
        <div className="card product" onClick={()=>navigate("/products")}>
          <div className="top__side">
            <div>
              <div style={{ fontSize: "30px" }}>{products.length}</div>
              <div style={{ fontSize: "20px", fontWeight: "300" }}>
                Products
              </div>
            </div>
            <MdOutlineAddShoppingCart color="white" size={35} />
          </div>
        </div>
      </div>
      <div className="graph">
        <img src={graph} alt="" />
      </div>
    </div>
  );
};

export default Dashboard;
