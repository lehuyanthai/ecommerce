import React from "react";
import { ISideBar } from "../side-bar/SideBar";

interface groupCategory {
  name?: string;
  category1?: ISideBar;
  category2?: ISideBar;
  category3?: ISideBar;
  category4?: ISideBar;
  category5?: ISideBar;
  category6?: ISideBar;
  category7?: ISideBar;
  category8?: ISideBar;
  category9?: ISideBar;
}

interface IDropdown {
  data: groupCategory[];
}
const Dropdown = ({ data }: IDropdown) => {
  return (
    <div className="dropdown-content">
      <div className="row">
        {data.map((items, index) => (
          <div key={index} className="column">
            {Object.values(items).map((val:ISideBar, key) =>
              key === 0 ? (
                <h4 key={key}>{val}</h4>
              ) : (
                <a href={val.link} key={key}>
                  {val.name}
                </a>
              )
            )}
          </div>
        ))}
        <div className="column">
          <img
            src="https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/v1/i/96320459_439b.jpg"
            alt="/"
          />
          <div>Shop The ReLeather Sneaker   </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
