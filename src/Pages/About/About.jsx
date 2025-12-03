import React from 'react'
import './about.css'
import { LuArrowRight, LuAward, LuHeart, LuTruck, LuUsers } from 'react-icons/lu'

function About() {
  return (
    <div className="main-container about">
      <section className="intro flex-column align-center">
        <h1 className='center bold mb-1'>About Friends Dairy Farm</h1>
        <p className='center'>A legacy of trust, purity, and tradition in every drop of milk</p>
      </section>
      <section className="hero flex align-center">
        <div className="text-wrapper">
          <h2 className='bold mt-2'>Our Story</h2>
          <p className='mb-2'>Friends Dairy Farm was founded with a simple vision: to bring pure, healthy, and authentic dairy products to the families of Chennai. Nestled in the outskirts of the city, our farm is home to indigenous cow breeds that produce pure A2 milk.</p>
          <p className="mb-2">We believe in traditional farming methods combined with modern hygiene standards. Our cows graze freely on natural grass, breathe fresh air, and are treated with love and respect. This translates directly into the quality and taste of our products.</p>
          <p className="mb-2">Every morning, we deliver freshness to your doorstep - not just milk, but a commitment to your family's health and well-being.</p>
        </div>
        <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80" alt="cow" />
      </section>

      <section className="values flex-column align-center">
        <h2 className='center mb-1'>Our Values</h2>
        <p className='center mb-2'>The principles that guide everything we do</p>
        <div className="card-container flex gap-2">
          <div className="card flex-column align-center">
            <div className="svg-wrapper mb-1">
              <LuHeart />
            </div>
            <h5 className='center bold mb-05'>Quality First</h5>
            <p className='center'>We never compromise on the quality and purity of our products</p>
          </div>
          <div className="card flex-column align-center">
            <div className="svg-wrapper mb-1">
              <LuUsers />
            </div>
            <h5 className='center bold mb-05'>Customer Trust</h5>
            <p className='center'>Building lasting relationships with every family we serve</p>
          </div>
          <div className="card flex-column align-center">
            <div className="svg-wrapper mb-1">
              <LuAward />
            </div>
            <h5 className='center bold mb-05'>Traditional Methods</h5>
            <p className='center'>Time-tested farming and processing techniques</p>
          </div>
          <div className="card flex-column align-center">
            <div className="svg-wrapper mb-1">
              <LuTruck />
            </div>
            <h5 className='center bold mb-05'>Reliable Service</h5>
            <p className='center'>Consistent delivery, rain or shine, every single day</p>
          </div>
        </div>
      </section>

      <section className="steps">
        <div className="step-wrapper flex align-center gap-2 mb-3">
          <div className="svg-wrapper">
            <p>01</p>
          </div>
          <div className="text-wrapper">
            <h3 className='mb-1 bold'>Happy Cows</h3>
            <p>Our indigenous cows graze on natural grass and live stress-free lives in spacious, clean environments.</p>
          </div>
        </div>

        <div className="step-wrapper flex align-center gap-2 mb-3">
          <div className="svg-wrapper">
            <p>02</p>
          </div>
          <div className="text-wrapper">
            <h3 className='mb-1 bold'>Hygienic Milking</h3>
            <p>We follow strict hygiene protocols during milking with modern equipment in clean conditions.</p>
          </div>
        </div>

        <div className="step-wrapper flex align-center gap-2 mb-3">
          <div className="svg-wrapper">
            <p>03</p>
          </div>
          <div className="text-wrapper">
            <h3 className='mb-1 bold'>Quality Testing</h3>
            <p>Every batch is tested for purity, fat content, and quality before it leaves our farm.</p>
          </div>
        </div>

        <div className="step-wrapper flex align-center gap-2 mb-3">
          <div className="svg-wrapper">
            <p>04</p>
          </div>
          <div className="text-wrapper">
            <h3 className='mb-1 bold'>Fresh Delivery</h3>
            <p>Milk from morning milking reaches your doorstep the same day, ensuring maximum freshness.</p>
          </div>
        </div>
      </section>

      <section className="data flex space-btw gap-2">
        <div className="wrapper ">
          <h1 className='bold color-primary'>500+</h1>
          <p className='bold color-primary'>Happy Families</p>
        </div>

        <div className="wrapper">
          <h1 className='bold color-primary'>100%</h1>
          <p className='bold color-primary'>Pure A2 Milk</p>
        </div>

        <div className="wrapper">
          <h1 className='bold color-primary'>5 AM</h1>
          <p className='bold color-primary'>Daily Delivery</p>
        </div>

        <div className="wrapper">
          <h1 className='bold color-primary'>10+</h1>
          <p className='bold color-primary'>Years Experience</p>
        </div>
      </section>
    </div>
  )
}

export default About