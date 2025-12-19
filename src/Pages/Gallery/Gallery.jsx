import React from 'react'
import './gallery.css'
import Logo from '../../assets/logo.webp'
import IMG1 from '../../assets/gallery/WA0001.jpg'
import IMG2 from '../../assets/gallery/WA0002.jpg'
import IMG3 from '../../assets/gallery/WA0003.jpg'
import IMG4 from '../../assets/gallery/WA0004.jpg'
import IMG5 from '../../assets/gallery/WA0005.jpg'
import IMG6 from '../../assets/gallery/WA0006.jpg'
import IMG7 from '../../assets/gallery/WA0007.jpg'
import IMG8 from '../../assets/gallery/WA0008.jpg'
import IMG9 from '../../assets/gallery/WA0009.jpg'
import IMG10 from '../../assets/gallery/WA00010.jpg'
import IMG11 from '../../assets/gallery/WA00011.jpg'
import IMG12 from '../../assets/gallery/WA00012.jpg'
import IMG13 from '../../assets/gallery/WA00013.jpg'
import IMG14 from '../../assets/gallery/WA00014.jpg'
import IMG15 from '../../assets/gallery/WA00015.jpg'
import IMG16 from '../../assets/gallery/WA00016.jpg'
import IMG17 from '../../assets/gallery/WA00017.jpeg'




function Gallery() {
    return (
        <div className='main-container gallery'>
            <section className="intro flex-column align-center bg-light">
                <img src={Logo} className='logo-section' alt="Friends Dairy Farm Logo" />
                <h1 className='center bold mb-1'>Our Farm Gallery</h1>
                <p className='center'>A glimpse into our daily operations and the love we put into every product</p>
            </section>
            <section className="gallery">
                <div className='gallery-container'>
                    <img src={IMG1} alt="" />
                    <img src={IMG2} alt="" />
                    <img src={IMG3} alt="" />
                    <img src={IMG4} alt="" />
                    <img src={IMG5} alt="" />
                    <img src={IMG6} alt="" />
                    <img src={IMG7} alt="" />
                    <img src={IMG8} alt="" />
                    <img src={IMG9} alt="" />
                    <img src={IMG10} alt="" />
                    <img src={IMG11} alt="" />
                    <img src={IMG12} alt="" />
                    <img src={IMG13} alt="" />
                    <img src={IMG14} alt="" />
                    <img src={IMG15} alt="" />
                    <img src={IMG16} alt="" />
                    <img src={IMG17} alt="" />
                </div>
            </section>
        </div>
    )
}

export default Gallery