import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { ChangeEvent, useEffect, useState } from "react";
import { IProductCard } from "../../components/product-card/ProductCard";
import { db } from "../../firebase";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { ImBin } from "react-icons/im";
import { AiOutlineEdit } from "react-icons/ai";
import "./products.scss";
import { useNavigate } from "react-router-dom";
import { DialogTitle } from "@mui/material";

const Products = () => {
  const [data, setData] = useState<Array<IProductCard>>([]);
  const [countChange, setCountChange] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchData, setSearchData] = useState<Array<IProductCard>>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [waitDeleteID, setWaitDeleteID] = useState<{
    id: string;
    gender: string;
  } | null>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClick = (id: string, gender: string) => {
    setWaitDeleteID({ id, gender });
    handleClickOpen();
  };

  const deleteProductHandle = async () => {
    await deleteDoc(
      doc(db, `collection_${waitDeleteID?.gender}`, `${waitDeleteID?.id}`)
    );
    setCountChange(Math.random());
    handleClose();
  };

  useEffect(() => {
    const getProductData = async (): Promise<Array<IProductCard>> => {
      const womenData: Array<any> = [];
      const menData: Array<any> = [];
      const collectionWomen = collection(db, `collection_women`);
      let womenQuery = query(collectionWomen, orderBy("name"));
      const collectionMen = collection(db, `collection_men`);
      let menQuery = query(collectionMen, orderBy("name"));

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
      if (countChange) setData(menData.concat(womenData));
      return menData.concat(womenData);
    };
    getProductData();
  }, [countChange]);

  useEffect(() => {
    const searchedData: IProductCard[] = data.filter((product) => {
      if (searchQuery === "") return true;
      else
        return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setSearchData(
      searchedData.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      })
    );
  }, [data, searchQuery]);

  return (
    <div className="products__ad">
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
          <Button onClick={deleteProductHandle} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <div className="side__top">
        <div className="title">Product Management</div>
        <input
          className="search-product"
          placeholder="Search . . . "
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
        <button
          className="add-product"
          onClick={() => {
            navigate("/addproduct");
          }}
        >
          Add product
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Name</th>
            <th style={{ width: "5%" }}>Category</th>
            <th style={{ width: "10%" }}>Price</th>
            <th style={{ width: "20%" }}>Color</th>
            <th style={{ width: "25%" }}>Size</th>
            <th style={{ width: "10%" }}>Image</th>
            <th style={{ width: "10%" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {!searchData.length && <tr>No product matching</tr>}
          {searchData.map((item, index) => (
            <>
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{Number(item.price).toLocaleString("en-us")}</td>
                <td>
                  <div className="list__color">
                    {item?.color?.map((item, index) => (
                      <div
                        key={index}
                        className="list__color--item"
                        style={{ backgroundColor: item }}
                      ></div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="list__size">
                    {item?.size?.map((item, index) => (
                      <div key={index} className="list__size--item">
                        {item}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ width: "100px" }}>
                    <img src={item.image[0]} alt="" />
                  </div>
                </td>
                <td>
                  <button
                    className="edit"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    <AiOutlineEdit size={22} />
                  </button>
                  <button
                    className="delete"
                    onClick={() =>
                      handleDeleteClick(item.id, item?.gender as string)
                    }
                  >
                    <ImBin size={22} color="white" />
                  </button>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
