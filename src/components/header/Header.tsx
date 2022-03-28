import { signOut } from "firebase/auth";
import React,{useEffect} from "react";
import { BsSearch } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../firebase";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { openCart, reset } from "../../slice/cartSlice";
import { setUserLogOutState } from "../../slice/userSlice";
import Cart from "../Cart/Cart";
import { ISideBar } from '../side-bar/SideBar';
import Dropdown from "./Dropdown";
import "./header.scss";


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
  category10?: ISideBar;
}

const HEADER_ITEM_WOMEN: groupCategory[] = [
  {
    name: "FEATURES",
    category1: {name:"New Arrivals",link:"/women/all"},
    category2: {name:"Best-Sellers",link:"/women/all"},
    category3: {name:"Back In Stock",link:"/women/all"},
    category4: {name:"The Track Collection",link:"/women/all"},
    category5: {name:"Cashmere Collection",link:"/women/all"},
    category6: {name:"100% Human Collection",link:"/women/all"},
    category7: {name:"Denim Guide",link:"/women/all"},
  },
  {
    name: "APPAREL",
    category1: {name:"Denim",link:"/women/denim"},
    category2: {name:"Sweaters",link:"/women/sweaters"},
    category3: {name:"Pants",link:"/women/pants"},
    category4: {name:"Shirts & Tops",link:"/women/shirts"},
    category5: {name:"Outerwear",link:"/women/outerwear"},
    category6: {name:"Sweatshirts & Sweatpants",link:"/women/sweatshirts"},
    category7: {name:"T-Shirts",link:"/women/"},
    category8: {name:"Bodysuits",link:"/women/bodysuits"},
    category9: {name:"Dresses & Jumpsuits",link:"/women/dresses"},
    category10: {name:"Underwear",link:"/women/underwears"},
  },
  {
    name: "SHOES & ACCESSORIES",
    category1: {name:"Shoes & Boots",link:"/women/shoes"},
    category2: {name:"Bags & Backpacks",link:"/women/bags"},
    category3: {name:"Socks",link:"/women/socks"},
  },
];
const HEADER_ITEM_MEN: groupCategory[] = [
  {
    name: "FEATURES",
    category1: {name:"New Arrivals",link:"/men/all"},
    category2: {name:"Best-Sellers",link:"/men/all"},
    category3: {name:"Back In Stock",link:"/men/all"},
    category4: {name:"The Track Collection",link:"/men/all"},
    category7: {name:"Denim Guide",link:"/men/all"},
  },
  {
    name: "APPAREL",
    category1: {name:"Denim",link:"/men/denim"},
    category2: {name:"Sweaters",link:"/men/sweaters"},
    category3: {name:"Pants",link:"/men/pants"},
    category4: {name:"Shirts & Tops",link:"/men/shirts"},
    category5: {name:"Outerwear",link:"/men/outerwear"},
    category6: {name:"Sweatshirts & Sweatpants",link:"/men/sweatshirts"},
    category7: {name:"Shirts & Polos",link:"/men/shirts"},
    category8: {name:"Underwear",link:"/men/underwears"},
  },
  {
    name: "SHOES & ACCESSORIES",
    category1: {name:"Shoes & Boots",link:"/men/shoes"},
    category2: {name:"Bags & Backpacks",link:"/men/bags"},
    category3: {name:"Socks",link:"/men/socks"},
  },
];

const Header = () => {
  const dispatch = useAppDispatch()
  const userName = useAppSelector(state => state.user.userName);
  const userEmail = useAppSelector(state => state.user.userEmail)
  const cartOpen = useAppSelector(state => state.cart.isOpen)
  
  const cartTotal = useAppSelector((state) => state.cart.total);
  const cartQuantity = useAppSelector((state) => state.cart.quantity);
  const cartProducts = useAppSelector((state) => state.cart.products);
  
  const handleLogout = () => {
    dispatch(reset())
    auth.signOut().then(async ()=>{
      await signOut(auth)
      dispatch(setUserLogOutState())
    }).catch((error)=>alert(error.message))
  }
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [cartOpen])
  
  const {pathname} = useLocation();
   if (window.location.pathname === '/signup'||window.location.pathname === '/login') return null;

  return (
    <div className="header">
      <div className="header__link">
        <div className="dropdown">
          <div className="header__link--item">
            <Link to="/women/all">Women</Link>
          </div>
          <Dropdown data={HEADER_ITEM_WOMEN} />
        </div>
        <div className="dropdown">
          <div className="header__link--item">
            <Link to="/men/all">Men</Link>
          </div>
          <Dropdown data={HEADER_ITEM_MEN} />
        </div>
        <div className="header__link--item about">
          <Link to="/about">About</Link>
        </div>
      </div>
      <h3 className="header__title">
        <Link to="/">N A B O A T</Link>
      </h3>
      <ul className="header__feature">
        <li className="header__feature--item">
          <Link to="/search"><BsSearch/> Search</Link>
        </li>
        {!userEmail ? (
          <>
            <li
              className="header__feature--item"
            >
              <Link to="login">Log in</Link>
            </li>
            <li
              className="header__feature--item"
            >
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        ) : (
          <>
          <li className="header__feature--item">
           <GoPrimitiveDot style={{color:"green",marginBottom:"-3px",fontSize:"15px"}}/> Hi, {userName||userEmail}
          </li>
          <li className="header__feature--item" onClick={handleLogout}>
            Log out
          </li>
          
          </>
        )}
        <li className="header__feature--item">
          <div className="cart__btn" onClick={() => dispatch(openCart())}>
            <i className="fas fa-shopping-cart" />{" "}
            {cartQuantity > 1
              ? `${cartQuantity} items`
              : cartQuantity === 1
              ? `${cartQuantity} items`
              : ""}
          </div>
        </li>
      </ul>
      <Cart
        products={cartProducts}
        quantity={cartQuantity}
        total={cartTotal}
      />
    </div>
  );
};

export default Header;
