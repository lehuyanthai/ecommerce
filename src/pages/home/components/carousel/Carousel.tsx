import "./carousel.scss";

import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

export interface ICacouselItem {
  author: string;
  comment: string;
  shop: string;
  img: string;
}

export const CarouselItem = ({
  author,
  comment,
  shop,
  img,
}: ICacouselItem) => {
  return (
    <div className="carousel-item" style={{ width: "100%" }}>
      <div className="content">
        <div style={{ fontWeight: "bold", paddingTop: "80px" }}>
          From The People
        </div>
        <div className="review-comment">{comment}</div>
        <div className="review-author">{`- ${author}, ${shop}`}</div>
      </div>
      <div className="img">
        <img src={img} alt="" />
        <div className="review-shop">{shop}</div>
      </div>
    </div>
  );
};

interface ICacousel {
  children: JSX.Element[];
  amount: number;
}

const Carousel = ({ children, amount }: ICacousel) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1),
    onSwipedRight: () => updateIndex(activeIndex - 1),
  });

  //React.Children.count(children)

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = amount - 1;
    } else if (newIndex >= amount) {
      newIndex = 0;
    }

    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pause) {
        updateIndex(activeIndex + 1);
      }
    }, 2000);

    return () => {
      if (interval) clearInterval(interval);
    };
  });

  return (
    <div
      {...swipeHandler}
      className="carousel"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <div
        className="inner"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child as any, { width: `${100}%` });
        })}
      </div>
      <div className="indicators">
        <button
          onClick={() => {
            updateIndex(activeIndex - 1);
          }}
        >
          <i className="fas fa-angle-left"/>
        </button>
        <button
          onClick={() => {
            updateIndex(activeIndex + 1);
          }}
        >
          <i className="fas fa-angle-right"/>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
