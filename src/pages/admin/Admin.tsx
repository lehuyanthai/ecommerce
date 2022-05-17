import { signOut } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { FiCompass, FiShoppingBag } from "react-icons/fi";
import { MdOutlineGridView, MdPeopleOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { setUserLogOutState } from "../../slice/userSlice";
import "./admin.scss";

const sidebarNavItems = [
  {
    display: "Dashboard",
    icon: <MdOutlineGridView />,
    to: "/",
    section: "",
  },
  {
    display: "Products",
    icon: <FiShoppingBag />,
    to: "/products",
    section: "products",
  },
  {
    display: "Users",
    icon: <MdPeopleOutline />,
    to: "/users",
    section: "users",
  },
  {
    display: "Orders",
    icon: <FiCompass />,
    to: "/orders",
    section: "orders",
  },
];

const Admin = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef<HTMLInputElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth
      .signOut()
      .then(async () => {
        await signOut(auth);
        dispatch(setUserLogOutState());
        navigate("/");
      })
      .catch((error) => alert(error.message));
  };
  useEffect(() => {
    setTimeout(() => {
      const sidebarItem = sidebarRef?.current?.querySelector(
        ".sideBar__menu__item"
      );
      indicatorRef!.current!.style.height = `${
        (sidebarItem?.clientHeight as number) - 5
      }px`;
      setStepHeight(sidebarItem?.clientHeight as number);
    }, 50);
  }, []);

  // change active index
  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    if (curPath === "addproduct" || curPath === "editproduct") {
      const activeItem = sidebarNavItems.findIndex(
        (item) => item.section === "products"
      );
      setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    } else {
      const activeItem = sidebarNavItems.findIndex(
        (item) => item.section === curPath
      );
      setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }
  }, [location]);

  return (
    <div className="admin">
      <div className="sideBar">
        <div className="sideBar__logo">Adminstrator</div>
        <div ref={sidebarRef} className="sideBar__menu">
          <div
            ref={indicatorRef}
            className="sideBar__menu__indicator"
            style={{
              transform: `translateX(-50%) translateY(${
                activeIndex * stepHeight
              }px)`,
            }}
          ></div>
          {sidebarNavItems.map((item, index) => (
            <Link to={item.to} key={index}>
              <div
                className={`sideBar__menu__item ${
                  activeIndex === index ? "active" : ""
                }`}
              >
                <div className="sideBar__menu__item__icon">{item.icon}</div>
                <div className="sideBar__menu__item__text">{item.display}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="sideBar__logout" onClick={handleLogout}>
          Log out
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Admin;
