import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Filter, { IFilters } from "../../components/filter/Filter";
import ProductGird from "../../components/product-grid/ProductGird";
import SideBar, { ISideBar } from "../../components/side-bar/SideBar";
import "./collection.scss";


const womenSideBarData: ISideBar[] = [
  { name: "Women's All", link: "/women/all" },
  { name: "Denim", link: "/women/denim" },
  { name: "Sweaters", link: "/women/sweaters" },
  { name: "Pants", link: "/women/pants" },
  { name: "Shirts & Tops", link: "/women/shirts" },
  { name: "Outerwear", link: "/women/outerwear" },
  { name: "Sweatshirts & Sweatpants", link: "/women/sweatshirts" },
  { name: "Dresses & Jumpsuits", link: "/women/dresses" },
  { name: "T-Shirts & Bodysuits", link: "/women/tshirt" },
  { name: "Activewear", link: "/women/activewear" },
  { name: "Shorts & Skirts", link: "/women/shorts" },
  { name: "Underwear", link: "/women/underwear" },
  { name: "Swimwear", link: "/women/swimmwear" },
  { name: "Shoes & Boots", link: "/women/shoes" },
  { name: "Bags & Backpacks", link: "/women/bags" },
  { name: "Socks", link: "/women/socks" },
];

const menSlideBarData = [
  { name: "Men's All", link: "/men/all" },
  { name: "Sweaters", link: "/men/sweaters" },
  { name: "Denim", link: "/men/denim" },
  { name: "Pants & Shorts", link: "/men/pants" },
  { name: "Sweatshirts & Sweatpants", link: "/men/sweatshirts" },
  { name: "Shirts & Polos", link: "/men/shirts" },
  { name: "T-Shirts", link: "/men/tshirts" },
  { name: "Outerwear", link: "/men/outerwear" },
  { name: "Activewear", link: "/men/activewear" },
  { name: "Underwear", link: "/men/underwear" },
  { name: "Shoes", link: "/men/shoes" },
  { name: "Backpacks & Bags", link: "/men/bags" },
];

const Collection = () => {
  const { collection, category } = useParams();
  const [filters, setFilters] = useState<IFilters>({ color: [], size: [] });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const capitalize = (s: string | undefined) => {
    if (typeof s !== "undefined") return s[0].toUpperCase() + s.slice(1);
    return "";
  };

  return (
    <div className="collection">
      <div className="collection__url">
        <Link to="/">Home</Link> /{" "}
        <Link to={`/${collection}/all`}>
          {collection?.includes("women") ? "Women" : "Men"} /{" "}
        </Link>
        {capitalize(category)}
      </div>
      <div className="collection__content">
        <SideBar
          sideBarData={
            collection?.includes("women") ? womenSideBarData : menSlideBarData
          }
        />
        <div className="products">
          <div className="collection__title">{collection}'s {category}</div>
          <Filter key="asdad" filters={filters} setFilters={setFilters} />
          <ProductGird
            gender={collection as string}
            category={category as string}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
};

export default Collection;
