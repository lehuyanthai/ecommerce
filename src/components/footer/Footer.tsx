import "./footer.scss";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const {pathname} = useLocation();
  console.log(pathname)
  if (
    window.location.pathname === "/signup" ||
    window.location.pathname === "/login" ||
    window.location.pathname === "/search"
  )
    return null;
  return (
    <div className="footer">
      <div className="footer__menus">
        <div className="footer__menus--menu">
          <div className="menu-header">Account</div>
          <Link to="/">Manage Account</Link>
          <Link to="/">Saved Items</Link>
          <Link to="/">Orders & Returns</Link>
          <Link to="/">Redeem a Gift card</Link>
        </div>
        <div className="footer__menus--menu">
          <div className="menu-header">Company</div>
          <Link to="/about">About</Link>
          <Link to="/about">Environmental Initiatives</Link>
          <Link to="/about">Factories</Link>
          <Link to="/about">DEI</Link>
          <Link to="/about">Carrers</Link>
          <Link to="/about">International</Link>
          <Link to="/about">Accessibility</Link>
        </div>
        <div className="footer__menus--menu">
          <div className="menu-header">Connect</div>
          <Link to="/">Contact & FAQ</Link>
          <Link to="/">Instagram</Link>
          <Link to="/">Twitter</Link>
          <Link to="/">Bulk Orders</Link>
        </div>
        <div className="footer__menus--menu">
          <div className="menu-header">Visit Us</div>
          <Link to="/">Find a location nearest you</Link>
        </div>
      </div>
      <div className="footer__adv">
        <div className="adv">Sign up to receive 10% off your first order.</div>
        <input placeholder="Email Address" />
      </div>
    </div>
  );
};

export default Footer;
