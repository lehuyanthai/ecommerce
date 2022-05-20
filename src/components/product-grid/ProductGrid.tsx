import { collection, getDocs, query, where } from "firebase/firestore";
import { intersection, uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { IFilters } from "../filter/Filter";
import ProductCard, { IProductCard } from "../product-card/ProductCard";
import "./product-grid.scss";

interface IProductGrid {
  gender: string;
  category: string;
  filters: IFilters;
}

const ProductGrid = ({ gender, category, filters }: IProductGrid) => {
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
      const isEmptyFilter = !filters.color.length && !filters.size.length;
      const colorSource = filters.color || [];
      const sizeSource = filters.size || [];
      let filterData: IProductCard[] = [];
      let filterBySize: IProductCard[] = [];
      let filterByColor: IProductCard[] = [];

      if (isEmptyFilter) return data;
      else {
        if (!!filters.color.length && !!filters.size.length) {
          colorSource.forEach((colorSelected) => {
            const productsByColor = data.filter(({ color }) =>
              color?.includes(colorSelected)
            );

            filterByColor = [...filterByColor, ...productsByColor];
          });

          sizeSource.forEach((colorSelected) => {
            const productsBySize = data.filter(({ size }) =>
              size?.includes(colorSelected)
            );

            filterBySize = [...filterBySize, ...productsBySize];
          });

          filterData = intersection(filterByColor, filterBySize);
        } else if (!!filters?.size?.length) {
          sizeSource.forEach((colorSelected) => {
            const productsBySize = data.filter(({ size }) =>
              size?.includes(colorSelected)
            );

            filterBySize = [...filterBySize, ...productsBySize];
          });
          filterData = uniq(filterBySize);
        } else {
          colorSource.forEach((colorSelected) => {
            const productsByColor = data.filter(({ color }) =>
              color?.includes(colorSelected)
            );

            filterByColor = [...filterByColor, ...productsByColor];
          });
          filterData = uniq(filterByColor);
        }
        return filterData;
      }
    };
    setFiltersData(getData);
  }, [data, filters]);

  if (!filtersData.length) {
    return <div>No products found</div>;
  }
  return (
    <div className="productgrid">
      {filtersData.map((item: IProductCard) => (
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

export default ProductGrid;
