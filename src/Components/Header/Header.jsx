import React, { useState } from 'react'
import './header.css'
import LOGO from '../../assets/logo.webp'
import { LuLogOut, LuMenu, LuUser, LuX } from 'react-icons/lu'
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../utils/auth';
import { useCart } from '../../Context/CartContext';
import CartModal from '../Modal/CartModal';

function Header() {
  const [open, setOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate()
  const { items } = useCart();

  async function handleLogout() {
    try {
      // disable UI or show spinner here if you want
      await logoutUser();
      console.log("Logged out successfully");
      navigate("/login");
    } catch (err) {
      // show the real error in console and to user
      console.error("Logout error:", err);
      alert("Logout failed: " + (err?.message || JSON.stringify(err)));
      // fallback: redirect to login anyway so user isn't stuck
      navigate("/login");
    }
  }

  return (
    <>
      <header className="header">
        <img src={LOGO} alt="logo" className="logo" />

        {/* Desktop nav */}
        <nav className="nav-desktop">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
          <NavLink to="/gallery" className="nav-link">
            Gallery
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
          <NavLink to="/faq" className="nav-link">
            FAQ
          </NavLink>
        </nav>

        {/* Desktop user icon */}
        <div className="user-desktop">
          <LuUser onClick={() => navigate('/profile')} />
          <LuLogOut onClick={handleLogout} />

          <button onClick={() => setShowCart(true)}>Cart ({items.length})</button>
          <CartModal open={showCart} onClose={() => setShowCart(false)} onCompleted={() => {/* refresh UI if needed */ }} />

        </div>

        {/* Burger icon */}
        <button
          className="burger"
          onClick={() => setOpen(true)}
        >
          <LuMenu />
        </button>
      </header>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>
          <LuX />
        </button>

        <nav className="nav-mobile">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
          <NavLink to="/gallery" className="nav-link">
            Gallery
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
          <NavLink to="/faq" className="nav-link">
            FAQ
          </NavLink>
        </nav>

        <div className="mobile-user">
          <LuUser />
          <span> My Account</span>
        </div>
      </div>
    </>
  )
}

export default Header