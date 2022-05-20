import clsx from "clsx";
import React, { useState } from "react";
import {
  IoIosArrowDown
} from "react-icons/io";
import { IoCloseOutline } from 'react-icons/io5';
import "./filter.scss";

export interface IFilters {
  color: string[];
  size: string[];
}

interface IFiltersProp {
  filters: IFilters;
  setFilters: React.Dispatch<React.SetStateAction<IFilters>>;
}

const Filter = ({ filters, setFilters }: IFiltersProp) => {
  const [toggledFilter, setToggledFilter] = useState<boolean>(false);
  const toggleFilter = () => {
    setToggledFilter(!toggledFilter);
  };

  const filtersColorHandler = (color: string) => {
    const check = filters?.color?.includes(color);
    if (!check) {
      setFilters({
        ...filters,
        color: filters?.color?.concat(color),
      });
    } else {
      setFilters({
        ...filters,
        color: filters?.color?.filter((item) => item !== color),
      });
    }
  };

  const filtersSizeHandler = (size: string) => {
    const check = filters?.size?.includes(size);
    if (!check) {
      setFilters({
        ...filters,
        size: filters?.size?.concat(size),
      });
    } else {
      setFilters({
        ...filters,
        size: filters?.size?.filter((item) => item !== size),
      });
    }
  };

  const filtersCheck = (type: "size" | "color", prop: string): boolean => {
    const check =
      type === "size"
        ? filters?.size?.includes(prop)
        : filters?.color?.includes(prop);
    return check as boolean;
  };

  return (
    <div className="FilterComponent">
      <div className="group__btn">
        <button onClick={toggleFilter} className="btn">
          Filters{" "}
          <IoIosArrowDown className={toggledFilter ? "btn--up" : "btn--down"} />
        </button>
        {!!filters.color?.length && filters.color?.map((item,index) => (<div key={index} className="chip" onClick={()=>filtersColorHandler(item)}>{item} <IoCloseOutline className="btn--up" /></div>))}
        {!!filters.size?.length && filters.size?.map((item,index) => (<div key={index} className="chip" onClick={()=>filtersSizeHandler(item)}>{item} <IoCloseOutline className="btn--up" /></div>))}
        {(!!filters.color?.length || !!filters.size?.length) && (
          <button
            onClick={() => {
              setFilters({ color: [], size: [] });
            }}
            className="clear"
          >
            Clear All 
          </button>
        )}
      </div>
      <div className={toggledFilter ? "filters" : "filters__none"}>
        <div className="filters__item color">
          Color
          <div className="list__color">
            {[
              "black",
              "blue",
              "grey",
              "orange",
              "purple",
              "green",
              "yellow",
              "darkblue",
              "steelblue",
              "bisque",
              "red",
              "brown","burlywood","aquamarine","lightblue","white"
            ].map((item) => (
              <div
                key={item}
                className={clsx(
                  "list__color--item",
                  filtersCheck("color", item) && "selected"
                )}
                style={{ backgroundColor: item }}
                onClick={() => filtersColorHandler(item)}
              ></div>
            ))}
          </div>
        </div>
        <div className="filters__item size">
          Size
          <div className="list__size">
            {[
              "XS",
              "S",
              "M",
              "L",
              "XL",
              "XXL",
              "24",
              "25",
              "26",
              "27",
              "28",
              "29",
              "30",
              "31",
              "32",
              "33",
              "34",
              "35",
            ].map((item) => (
              <div
                key={item}
                className={clsx(
                  "list__size--item",
                  filtersCheck("size", item) && "selected"
                )}
                onClick={() => filtersSizeHandler(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
