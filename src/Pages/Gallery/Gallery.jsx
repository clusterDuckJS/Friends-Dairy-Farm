import React from 'react'
import './gallery.css'
import Logo from '../../assets/logo.webp'

function Gallery() {
    const GALLERY_IMAGES = [
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0001.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0002.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0003.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0004.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0005.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0006.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0007.jpg",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0008.jpg",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0009.jpg",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0010.jpg",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0011.jpg",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0012.jpg",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0013.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0014.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0015.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0016.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0017.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0018.jpeg",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0019.webp",
        "https://vrygzawhgoqnaabqsoll.supabase.co/storage/v1/object/public/Gallery/WA0020.webp"

    ];

    return (
        <div className='main-container gallery'>
            <section className="intro flex-column align-center bg-light">
                <img src={Logo} className='logo-section' alt="Friends Dairy Farm Logo" />
                <h1 className='center bold mb-1'>Our Farm Gallery</h1>
                <p className='center'>A glimpse into our daily operations and the love we put into every product</p>
            </section>
            <section className="gallery">
                <div className="gallery-container">
                    {GALLERY_IMAGES.map((src, i) => (
                        <img key={i} src={src} alt={`Farm gallery ${i + 1}`} loading="lazy" />
                    ))}
                </div>
            </section>
        </div>
    )
}


export default Gallery