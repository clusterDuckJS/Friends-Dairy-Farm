import React, { useState } from 'react'
import './header.css'
import LOGO from '../../assets/logo.webp'
import { LuMenu, LuUser, LuX } from 'react-icons/lu'
import { NavLink, useNavigate } from 'react-router-dom';

function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

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
          <LuUser />
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
          <p>Home</p>
          <p>About</p>
          <p>Products</p>
          <p>Gallery</p>
          <p>Contact</p>
          <p>FAQ</p>
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