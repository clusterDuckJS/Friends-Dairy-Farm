import React from 'react'
import './footer.css'
import LOGO from '../../assets/logo.webp'
import { LuFacebook, LuInstagram, LuMail, LuMapPin, LuPhone, LuX } from 'react-icons/lu'

function Footer() {
  return (
    <footer>
      <div className="text-wrapper">
        <div className="column-1 flex-column mb-2">
          <img src={LOGO} alt="logo" />
          <small>Pure A2 milk and dairy products from our farm to your home. Quality you can trust.</small>
        </div>
        <div className="column-2 mb-2">
          <p className="bold mb-1">Quick Links</p>
          <ul>
            <li className='mb-05'>About Us</li>
            <li className='mb-05'>Our Products</li>
            <li className='mb-05'>Gallery</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div className="column-3 mb-2">
          <p className="bold mb-1">Contact Us</p>
          <ul>
            <li className='flex align-center gap-05 mb-05'><LuMapPin />Friends Dairy Farm, Chennai, Tamil Nadu</li>
            <li className='flex align-center gap-05 mb-05'><LuPhone />+91 98765 43210</li>
            <li className='flex align-center gap-05 '><LuMail />info@friendsdairyfarm.com</li>
          </ul>
        </div>
        <div className="column-4 mb-2">
          <p className='bold mb-1'>Follow Us</p>
          <div className="social-container mb-2 flex gap-05">
            <LuInstagram/>
            <LuFacebook/>
            <LuX/>
          </div>
          <div className="delivery-wrapper flex-column">
            <small className='bold mb-1'>Delivery Hours</small>
            <small>Daily: 5:00 AM - 7:00 AM</small>
          </div>
        </div>
      </div>
    </footer>
  )
}








export default Footer