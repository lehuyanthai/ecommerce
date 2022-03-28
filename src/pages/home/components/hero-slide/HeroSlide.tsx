import React from "react";
import { Link } from "react-router-dom";
import "./hero-slide.scss";


const HeroSlide = () => {
  return (
    <div className="hero">
      <img
        src="https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/c_limit,w_900/v1/i/4faf9535_17fd.jpg"
        alt=""
      />
      <div className="hero__content">
        <h1>The Long Weekend Sale</h1>
        <p>Psst! Our best-sellers are up to 60% off.</p>
        <div className="group-button">
          <Link to="/women/all">
            <button
              className="button"
            >Shop Women's</button>
          </Link>
          <Link to='/men/all'>
          <button
              className="button"
            >Shop Men's</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSlide;
