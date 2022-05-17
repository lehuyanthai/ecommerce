import clsx from "clsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiFillMinusSquare, AiFillPlusSquare } from "react-icons/ai";
import { db } from "../../firebase";
import { useAppSelector } from "../../hooks/useAppSelector";
import { IOrder } from "../orders/Orders";
import './purchase-history.scss';


const PurchaseHistory = () => {
    const user = useAppSelector(state=>state.user.userEmail)
  const [data, setData] = useState<Array<IOrder>>([]);
  const [detailToggle, setDetailToggled] = useState<boolean[]>(
    Array(1000).fill(false)
  );
  useEffect(() => {
    const getOrdersData = async (): Promise<Array<IOrder>> => {
      const data: Array<any> = [];
      const collectionRef = collection(db, "orders");
      let q = query(collectionRef,where("userEmail","==",`${user}`));

      await getDocs(q).then((result) => {
        result.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
      setData(data);
      return data;
    };
    getOrdersData();
  });
  const handleToggle = (i: number) => {
    const tamp = detailToggle.map((item, index) => {
      return index === i ? !item : item;
    });
    setDetailToggled(tamp);
  };
  
  return (
    <div className="purchase-history">
        <div className="title">
            Purchase History
        </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "5%" }}></th>
            <th style={{ width: "15%" }}>Order ID</th>
            <th style={{ width: "65%" }}>Order Detail</th>
            <th style={{ width: "6%" }}>Quanity</th>
            <th style={{ width: "9%" }}>Total</th>
            <th style={{ width: "9%" }}>Payment</th>
            <th style={{ width: "9%" }}>Fulfilled</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <>
              <tr className={!!detailToggle[index] ? "active-row" : ""}>
                <td onClick={() => handleToggle(index)}>
                  {!detailToggle[index] ? (
                    <AiFillPlusSquare size={27} />
                  ) : (
                    <AiFillMinusSquare size={27} />
                  )}
                </td>
                <td>{item.id}</td>
                <td> </td>
                <td>{item.quantity}</td>
                <td>{Number(item.total).toLocaleString("en-us")}</td>
                <td style={{color: "#009107", fontWeight: "500"}}>Fully Paid</td>
                <td
                  style={
                    item.status
                      ? { color: "#009107", fontWeight: "500" }
                      : { color: "red", fontWeight: "500" }
                  }
                >
                  {item.status ? "Fulfilled" : "Unfulfilled"}
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td
                  colSpan={21}
                  className={clsx(
                    "order__detail",
                    !!detailToggle[index] && "active"
                  )}
                >
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <td>Product</td>
                        <td>Price</td>
                        <td>Quantity</td>
                        <td>Size</td>
                        <td>Color</td>
                      </tr>
                    </thead>
                    <tbody>
                      {item?.products.map((item) => (
                        <tr>
                          <td>{item.name}</td>
                          <td>{Number(item.price).toLocaleString("en-us")}</td>
                          <td>{item.quantity}</td>
                          <td>{item.size}</td>
                          <td>
                            <div
                              className="color"
                              style={{ backgroundColor: item.color }}
                            ></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseHistory;
