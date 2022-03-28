import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductCard, {
  IProductCard
} from "../../components/product-card/ProductCard";
import { db } from "../../firebase";
import "./search.scss";

const POPULAR_CATEGORIES = [
  {
    name: "Women's Activewear",
    link: "/women/activewear",
    img: "https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/c_limit,w_1500/v1/i/d17f3a9d_fd1c.jpg",
  },
  {
    name: "Women's Denim",
    link: "/women/denim",
    img: "https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/c_limit,w_1500/v1/i/fb21648f_41e2.jpg",
  },
  {
    name: "Women's Shoes",
    link: "/women/shoes",
    img: "https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/c_limit,w_1500/v1/i/4166dc8e_2b73.jpg",
  },
  {
    name: "Men's Pants",
    link: "/men/pants",
    img: "https://media.everlane.com/image/upload/c_fill,dpr_1.0,f_auto,g_face,q_auto,w_auto:100:1200/v1/i/f91c77cd_63ca.jpg",
  },
];

const Search = () => {
  const [data, setData] = useState<Array<IProductCard>>([]);
  const [searchData, setSearchData] = useState<Array<IProductCard>>([]);
  const location = useLocation();
  const navigate = useNavigate()
  const search = useLocation().search
  const q = new URLSearchParams(search).get('q');
  const [searchInput, setSearchInput] = useState<string>(!q?"":q);

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
      setData(womenData.concat(menData));
      return womenData.concat(menData);
    };
    getProductData();
  }, []);

  useEffect(() => {
    const getData = () => {
      const searchedData: IProductCard[] = data.filter((product) => {
        if (searchInput === "") return false;
        else
          return product.name.toLowerCase().includes(searchInput.toLowerCase());
      });
      setSearchData(searchedData);
    };

    let timer = setTimeout(() => {
      if (searchInput) getData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, data]);

  const searchInputHandle = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {name, value} = e?.target;
     const params = new URLSearchParams({[name]: value });
     setSearchInput(value)
     navigate({ pathname: location.pathname, search: params.toString() },{replace:true});  
  }

  return (
    <div className="search">
      <div className="search__header">
        <input
          value={searchInput}
          name="q"
          placeholder="Search ..."
          onChange={searchInputHandle
          }
        />
        <button className="cancel" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
      {!searchInput && (
        <div className="category__popular">
          <div className="title">Popular Categories</div>
          <div className="list__category">
            {POPULAR_CATEGORIES.map((item) => (
              <Link to={item.link}>
                <div className="list__category--item">
                  <img src={item.img} alt={item.name} />
                  <div className="name">{item.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {!!searchInput && (
        <div>
          <div className="results">
            Showing {searchData.length} product results
          </div>
          <div className="productgrid grid">
            {searchData.map((item) => (
              <Link to={`/${item.gender}/all/${item.id}`} replace>
                <ProductCard
                  id={item.id}
                  category={item.category}
                  color={item.color}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  size={item.size}
                  key={item.id}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      {!!searchInput && !searchData.length && (
        <div>
          Sorry, we couldn’t find any matching results for this search.
          <br />
          These popular categories might interest you.
        </div>
      )}
    </div>
  );
};

export default Search;
