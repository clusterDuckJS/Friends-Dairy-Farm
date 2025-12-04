import React from 'react'
import './gallery.css'
import { LuArrowRight } from 'react-icons/lu'

function Gallery() {
    return (
        <div className='main-container gallery'>
            <section className="intro flex-column align-center bg-light">
                <h1 className='center bold mb-1'>Our Farm Gallery</h1>
                <p className='center'>A glimpse into our daily operations and the love we put into every product</p>
            </section>
            <section className="gallery">
                <div className='gallery-container'>
                    <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80" alt="" />
                    <img src="https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800&q=80" alt="" />
                    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" alt="" />
                    <img src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80" alt="" />
                    <img src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80" alt="" />
                    <img src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&q=80" alt="" />
                </div>
            </section>
        </div>
    )
}

export default Gallery