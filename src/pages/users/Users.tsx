import { DialogTitle } from "@mui/material";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
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
  const [open, setOpen] = React.useState(false);
  const [waitDeleteID, setWaitDeleteID] = useState<string|null>()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUserHandle = async () => {
    await deleteDoc(doc(db, "users", `${waitDeleteID}`));
    setCountRefresh(Math.random());
    handleClose()
  };
  
  const handleDeleteClick = (id:string) =>{
    setWaitDeleteID(id)
    handleClickOpen()
  }

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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
        Are you sure you want to delete this product ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteUserHandle} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
                    onClick={()=>handleDeleteClick(item.id)}
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
