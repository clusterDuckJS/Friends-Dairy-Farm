import React, { useState } from 'react'
import './header.css'
import LOGO from '../../assets/logo.webp'
import { LuLogOut, LuMenu, LuUser, LuX, LuShoppingCart } from 'react-icons/lu'
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../utils/auth';
import { useCart } from '../../Context/CartContext';
import CartModal from '../Modal/CartModal';
import useIsAdmin from "../../hooks/useIsAdmin";
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../Context/ToastContext';

function Header() {
  const [open, setOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate()
  const { items } = useCart();
  const { isAdmin, isLoading } = useIsAdmin();
  const user = useAuth();
  const fullName = user?.user_metadata?.full_name || "";
  const firstName = fullName.split(" ")[0];
  const toast = useToast();

  async function handleLogout() {
    try {
      // disable UI or show spinner here if you want
      await logoutUser();
      console.log("Logged out successfully");
      navigate("/login");
    } catch (err) {
      // show the real error in console and to user
      console.error("Logout error:", err);
      toast.error("Logout failed: " + (err?.message || JSON.stringify(err)));
      // fallback: redirect to login anyway so user isn't stuck
      navigate("/login");
    }
  }


  return (
    <>
      <header className="header">
        <div className="logo-wrapper flex align-center gap-1 pointer" onClick={() => navigate("/")}>
          <img src={LOGO} alt="logo" className="logo" />
          <p className='bold'>Friends Dairy Farm</p>
        </div>


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
          {isAdmin && (
            <NavLink to="/admin" end className="nav-link">
              Dashboard
            </NavLink>
          )}

        </nav>

        <div className="user-desktop flex">
          {/* IF NOT LOGGED IN */}
          {!user && (
            <button className="primary" onClick={() => navigate("/login")}>
              Login / Sign Up
            </button>
          )}
          {/* IF LOGGED IN */}
          {user && (
            <div className='account-cart-wrapper flex align-center gap-2'>
              <p className='color-primary' onClick={() => navigate("/profile")}>Hello, {firstName}</p>
              <div className="shopping-cart-wrapper flex align-center">
                <LuShoppingCart onClick={() => setShowCart(true)} />
                <span className="badge">{items.length}</span>
              </div>
              <LuLogOut onClick={handleLogout} />
            </div>
          )}
        </div>

        {/* Burger icon */}
        <LuMenu className="burger" onClick={() => setOpen(true)} />
        <CartModal open={showCart} onClose={() => setShowCart(false)} onCompleted={() => {/* refresh UI if needed */ }} />
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
          {isAdmin && (
            <NavLink to="/admin" end className="nav-link">
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="mobile-user">
          <LuUser onClick={() => navigate('/profile')} />
          <LuLogOut onClick={handleLogout} />
          <LuShoppingCart onClick={() => setShowCart(true)} />
        </div>
      </div>
    </>
  )
}

export default Header