import React from "react";
import { Link } from "react-router-dom";
import "./category-list.scss";


const POPULAR_CATEGORY = [
  {
    img: "https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/c_limit,w_1100/v1/i/937db2ab_1c33.jpg",
    gender: "WOMEN'S",
    category: "Outerwear",
    link:"/women/outerwear"
  },
  {
    img: "https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/c_limit,w_1500/v1/i/34f52f3a_8880.jpg",
    gender: "WOMEN'S",
    category: "Sweaters",
    link:"/women/sweaters"
  },
  {
    img: "https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/c_limit,w_1500/v1/i/bf68d011_98e2.jpg",
    gender: "WOMEN'S",
    category: "Denim",
    link:"/women/denim"
  },
  {
    img: "https://media.everlane.com/image/upload/c_fill,dpr_2.0,f_auto,g_face,h_492,q_auto,w_auto:26:338/v1/i/22300343_140f.jpg",
    gender: "WOMEN'S",
    category: "Checky Jeans",
    link:"/women/pants"
  },
  {
    img: "https://media.everlane.com/image/upload/c_fill,dpr_2.0,f_auto,g_face,h_492,q_auto,w_auto:26:338/v1/i/c2c1eaca_42eb.jpg",
    gender: "WOMEN'S",
    category: "Sweatshirts",
    link:"/women/sweatshirts"
  },
];

const CategoryList = () => {
  return (
    <div className="category">
      {POPULAR_CATEGORY.map((item, index) => (
        <Link to={item.link} key={index}>
        <div key={index} className="category__item">
          <img src={item.img} alt="/" />
          <p className="gender">{item.gender}</p>
          <button>
            {item.category} <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
