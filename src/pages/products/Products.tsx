import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { ChangeEvent, useEffect, useState } from "react";
import { IProductCard } from "../../components/product-card/ProductCard";
import { db } from "../../firebase";
import { ImBin } from "react-icons/im";
import { AiOutlineEdit } from "react-icons/ai";
import "./products.scss";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState<Array<IProductCard>>([]);
  const [countChange, setCountChange] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchData,setSearchData] = useState<Array<IProductCard>>([])
  const navigate = useNavigate();

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
      if (countChange) setData(womenData.concat(menData));
      return womenData.concat(menData);
    };
    getProductData();
  }, [countChange]);

  useEffect(()=>{
    const searchedData: IProductCard[] = data.filter((product) => {
      if (searchQuery === "") return true;
      else
        return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setSearchData(searchedData);
  },[data,searchQuery])

  const deleteProductHandle = async (id: string, gender: string) => {
    await deleteDoc(doc(db, `collection_${gender}`, `${id}`));
    setCountChange(Math.random());
  };

  return (
    <div className="products__ad">
      <div className="side__top">
        <div className="title">Product Management</div>
        <input className="search-product" placeholder="Search . . . " value={searchQuery} onChange={(e:ChangeEvent<HTMLInputElement>)=>setSearchQuery(e.target.value)} />
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
                      deleteProductHandle(item.id, item?.gender as string)
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
