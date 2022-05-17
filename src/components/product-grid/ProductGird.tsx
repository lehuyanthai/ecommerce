import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { IFilters } from "../filter/Filter";
import ProductCard, { IProductCard } from "../product-card/ProductCard";
import "./product-grid.scss";

interface IProductGrid {
  gender: string;
  category: string;
  filters: IFilters | undefined;
}

const ProductGird = ({ gender, category, filters }: IProductGrid) => {
  const [data, setData] = useState<Array<IProductCard>>([]);
  const [filtersData, setFiltersData] = useState<Array<IProductCard>>(data);
  useEffect(() => {
    const getProductData = async (): Promise<Array<IProductCard>> => {
      const data: Array<any> = [];
      const collectionRef = collection(db, `collection_${gender}`);
      let q = query(collectionRef);
      if (category !== "all") {
        q = query(collectionRef, where("category", "==", `${category}`));
      }

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
    getProductData();
  }, [gender, category]);

  useEffect(() => {
    const getData = (): IProductCard[] => {
      let filterData: IProductCard[] = [];
      if (!!filters?.color?.length && !!filters?.size?.length) {
        filterData = data.filter((item) =>
          filters.color?.every((color) => item.color?.includes(color)) && filters.size?.every((size) => item.size?.includes(size))
        );
        return filterData;
      }
      if (!!filters?.color?.length) {
        filterData = data.filter((item) =>
          filters.color?.every((color) => item.color?.includes(color))
        );
        return filterData;
      }
      if (!!filters?.size?.length) {
        filterData = data.filter((item) =>
          filters.size?.every((size) => item.size?.includes(size))
        );
        return filterData;
      }
      return data  
    };
    setFiltersData(getData)
  }, [data, filters]);

  if(!filtersData.length){
    return (<div>
      No products found
    </div>)
  }
  return (
    <div className="productgrid">
      {filtersData.map((item:IProductCard) => (
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
      ))}
    </div>
  );
};

export default ProductGird;
