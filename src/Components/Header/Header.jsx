import React from 'react'
import './header.css'
import LOGO from '../../assets/logo.webp'
import { LuUser } from 'react-icons/lu'

function Header() {
  return (
    <header className='flex align-center'>
      <img src={LOGO} alt="logo" />
      <nav className='flex gap-1'>
        <p className='bold'>Home</p>
        <p className='bold'>About</p>
        <p className='bold'>Products</p>
        <p className='bold'>Gallery</p>
        <p className='bold'>Contact</p>
        <p className='bold'>FAQ</p>
      </nav>
      <LuUser/>
    </header>
  )
}

export default Header