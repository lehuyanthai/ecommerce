import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import BestSellers from "./components/best-sellers/BestSellers";
import Carousel, {
  CarouselItem,
  ICacouselItem
} from "./components/carousel/Carousel";
import CategoryList from "./components/category-list/CategoryList";
import HeroSlide from "./components/hero-slide/HeroSlide";

const Home = () => {

  const [data,setData ] = useState<Array<ICacouselItem>>([]);
  
  useEffect(() => {
    const getCarouselData = async (): Promise<Array<ICacouselItem>> => {
      const data: Array<any> = [];
      await getDocs(query(collection(db,"review"))).then((result) =>{
        result.forEach(
          (doc) => {
            data.push({
              id: doc.id,
              ...doc.data(),
            });
      })})
      setData(data)
      return data;
    };
    getCarouselData();
  }, []);

  return (
    <div>
      <HeroSlide />
      <CategoryList />
      <BestSellers />
      <Carousel amount={3}>
        {data.map((item, index) => (
          <CarouselItem
            key={index}
            author={item.author}
            comment={item.comment}
            img={item.img}
            shop={item.shop}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default Home;
