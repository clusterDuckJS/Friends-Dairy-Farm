import React from 'react'
import './footer.css'
import LOGO from '../../assets/logo.webp'
import { LuFacebook, LuInstagram, LuMail, LuMapPin, LuPhone, LuTwitter, LuX } from 'react-icons/lu'

function Footer() {
  return (
    <footer>
      <div className="text-wrapper gap-2">
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
            <li className='flex align-center gap-05 mb-05'><LuPhone />+91 97900 09985</li>
            <li className='flex align-center gap-05 '><LuMail />fdfchennai@gmail.com</li>
          </ul>
        </div>
        <div className="column-4 mb-2">
          <p className='bold mb-1'>Follow Us</p>
          <div className="social-container mb-2 flex gap-1">
            <a
              href="https://www.instagram.com/fdfchennai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <LuInstagram color='#C13584' size={24} />
            </a>
            {/* <LuFacebook /> */}
            <a
              href="https://x.com/fdfchennai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <LuTwitter color='#1DA1F2' size={24} />
            </a>
          </div>
          <div className="delivery-wrapper flex-column">
            <p className='bold mb-1'>Delivery Hours</p>
            <p>Daily: 5:00 AM - 7:00 AM</p>
          </div>
        </div>
      </div>
    </footer>
  )
}








export default Footer