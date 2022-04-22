import React, { ChangeEvent, useEffect, useState } from "react";
import "./orders.scss";

import { collection, getDocs, query, updateDoc, doc } from "firebase/firestore";
import { AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { db } from "../../firebase";
import clsx from "clsx";

interface IOrderProduct {
  id: string;
  color: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface IOrder {
  id: string;
  userEmail: string;
  total: number;
  quantity: number;
  status: boolean;
  products: IOrderProduct[];
}

const Orders = () => {
  const [data, setData] = useState<Array<IOrder>>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchData, setSearchData] = useState<Array<IOrder>>([]);
  useEffect(() => {
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
      setData(data);
      return data;
    };
    getOrdersData();
  });

  const [detailToggle, setDetailToggled] = useState<boolean[]>(
    Array(1000).fill(false)
  );
  const handleToggle = (i: number) => {
    const tamp = detailToggle.map((item, index) => {
      return index === i ? !item : item;
    });
    setDetailToggled(tamp);
  };

  const handleOrder = async (id: string) => {
    await updateDoc(doc(db, "orders", `${id}`), { status: true });
  };

  useEffect(() => {
    const searchedData: IOrder[] = data.filter((order) => {
      if (searchQuery === "") return true;
      else
        return order.id
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
    });
    setSearchData(searchedData);
  }, [data, searchQuery]);

  return (
    <div className="orders">
      <div className="top__side">
        <div className="title">Order Management</div>
        <input
          className="search-order"
          placeholder="Search . . . "
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "5%" }}></th>
            <th style={{ width: "15%" }}>Order ID</th>
            <th style={{ width: "30%" }}>User Email</th>
            <th style={{ width: "6%" }}>Quanity</th>
            <th style={{ width: "9%" }}>Total</th>
            <th style={{ width: "10%" }}>Payment</th>
            <th style={{ width: "10%" }}>Fulfillment</th>
            <th style={{ width: "5%" }}>Action</th>
          </tr>
        </thead>
        
        <tbody>
          {searchData.map((item, index) => (
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
                <td>{item.userEmail}</td>
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
                <td>
                  <button onClick={() => handleOrder(item.id)}>
                    <BsCheckLg />
                  </button>
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
      {!searchData.length && <div>No order matching</div>}
    </div>
  );
};

export default Orders;
