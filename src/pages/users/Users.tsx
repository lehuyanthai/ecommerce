import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ImBin } from "react-icons/im";
import { db } from "../../firebase";
import "./users.scss";

export interface IUser {
  id: string;
  userEmail: string;
  password?: string | null;
}

const Users = () => {
  const [data, setData] = useState<Array<IUser>>([]);
  const [searchQuery, setsearchQuery] = useState<string>("");
  const [searchData, setSearchData] = useState<Array<IUser>>([]);
  const [countRefresh, setCountRefresh] = useState<number>(1);

  const deleteUserHandle = async (id: string) => {
    await deleteDoc(doc(db, "users", `${id}`));
    setCountRefresh(Math.random());
  };

  useEffect(() => {
    const getProductData = async (): Promise<Array<IUser>> => {
      const usersData: Array<any> = [];
      const collectionUsers = collection(db, `users`);
      let usersQuery = query(collectionUsers);

      await getDocs(usersQuery).then((result) => {
        result.forEach((doc) => {
          usersData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
      if (!!countRefresh) {
        setData(usersData);
      }
      return usersData;
    };
    getProductData();
  }, [countRefresh]);

  useEffect(() => {
    const searchedData: IUser[] = data.filter((user) => {
      if (searchQuery === "") return true;
      else
        return user.userEmail
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
    });
    setSearchData(searchedData);
  }, [data, searchQuery]);

  return (
    <div className="users">
      <div className="top__side">
        <div className="title">User Management</div>
        <input
          className="search-user"
          placeholder="Search . . . "
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setsearchQuery(e.target.value)
          }
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>ID</th>
            <th style={{ width: "40%" }}>Email</th>
            <th style={{ width: "30%" }}>Password</th>
            <th style={{ width: "20%" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchData.map((item, index) => (
            <>
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.userEmail}</td>
                <td style={{ fontWeight: "700", fontSize: "20px" }}>
                  {item.password ? item.password : "**********"}
                </td>
                <td>
                  <button
                    className="delete"
                    onClick={() => deleteUserHandle(item.id)}
                  >
                    <ImBin size={22} color="white" />
                  </button>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      {!searchData.length && <div>No user matching</div>}
    </div>
  );
};

export default Users;
