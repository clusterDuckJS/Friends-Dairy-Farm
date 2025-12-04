import React from 'react'
import './products.css'
import MILK from '../../assets/milk.webp'
import GHEE from '../../assets/ghee.webp'
import { LuArrowRight, LuCircleCheckBig, LuShoppingCart } from 'react-icons/lu'
function Products() {
  return (
    <div className="main-container products">
      <section className="intro flex-column align-center">
        <h1 className='center bold mb-1'>Our Products</h1>
        <p className='center'>Premium quality dairy products, handcrafted with care and delivered fresh daily</p>
      </section>

      <section className="products flex-column align-center gap-2">
        <div className="card-container mb-2">
          <div className="card">
            <img src={MILK} alt="milk" />
            <div className="text-wrapper">
              <h3 className='bold mb-1'>A2 Milk</h3>
              <p className='mb-1'>Traditional hand-churned ghee made from pure A2 milk. Rich aroma and authentic taste.</p>
              <ul className='mb-1'>
                <li className='mb-1'><LuCircleCheckBig className='color-success' /> 100% Pure A2 Milk</li>
                <li className='mb-1'><LuCircleCheckBig className='color-success' /> From Grass-Fed Cows</li>
                <li className='mb-1'><LuCircleCheckBig className='color-success' /> No Hormones or Antibiotics</li>
                <li className='mb-1'><LuCircleCheckBig className='color-success' /> Farm Fresh Daily</li>
              </ul>
              <p className='bold mb-1'>Available Sizes:</p>
              <div className="price-card flex space-btw align-center mb-1">
                <div className="text-wrapper">
                  <p className='bold'>0.5L</p>
                  <h3 className='color-primary bold'>₹45</h3>
                </div>
                <button className='primary'><LuShoppingCart /> Add to cart</button>
              </div>
              <div className="price-card flex space-btw align-center">
                <div className="text-wrapper">
                  <p className='bold'>1L</p>
                  <h3 className='color-primary bold'>₹85</h3>
                </div>
                <button className='primary'><LuShoppingCart /> Add to cart</button>
              </div>
            </div>
          </div>

          <div className="card">
            <img src={GHEE} alt="ghee" />
            <div className="text-wrapper">
              <h3 className='bold mb-1'>Pure Ghee</h3>
              <p className='mb-1'>Traditional hand-churned ghee made from pure A2 milk. Rich aroma and authentic taste.</p>
              <ul className='mb-1'>
                <li className='mb-1'><LuCircleCheckBig className='color-success' /> Made from A2 Milk</li>
                <li className='mb-1'><LuCircleCheckBig className='color-success' /> Hand-Churned</li>
                <li className='mb-1'><LuCircleCheckBig className='color-success' /> No Preservatives</li>
                <li className='mb-1'><LuCircleCheckBig className='color-success' /> Traditional Method</li>
              </ul>
              <p className='bold mb-1'>Available Sizes:</p>
              <div className="price-card flex space-btw align-center mb-1">
                <div className="text-wrapper">
                  <p className='bold'>0.5L</p>
                  <h3 className='color-primary bold'>₹550</h3>
                </div>
                <button className='primary'><LuShoppingCart /> Add to cart</button>
              </div>
              <div className="price-card flex space-btw align-center">
                <div className="text-wrapper">
                  <p className='bold'>1L</p>
                  <h3 className='color-primary bold'>₹1050</h3>
                </div>
                <button className='primary'><LuShoppingCart /> Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="start-journey flex-column align-center">
        <h1 className='bold center white mb-2'>Start Your Healthy Journey Today</h1>
        <p className='center white mb-2'>Subscribe now and get fresh A2 milk delivered to your doorstep every morning</p>
        <button className='primary'>Schedule Your Delivery <LuArrowRight /></button>
      </section>
    </div>
  )
}

export default Products