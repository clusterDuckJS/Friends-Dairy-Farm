import React, { useEffect, useState } from 'react'
import './products.css'
import MILK from '../../assets/milk.webp'
import GHEE from '../../assets/ghee.webp'
import { LuArrowRight, LuCircleCheckBig, LuShoppingCart } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../Context/CartContext'
import ProductCard from '../../Components/ProductCard/ProductCard'
import { getProducts } from '../../utils/products'

function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getProducts();
        if (mounted) setProducts(data);
      } catch (err) {
        console.error("Products load failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="page-shell">Loading products…</div>;
  
  return (
    <div className="main-container products">
      <section className="intro flex-column align-center">
        <h1 className='center bold mb-1'>Our Products</h1>
        <p className='center'>Premium quality dairy products, handcrafted with care and delivered fresh daily</p>
      </section>

      <section className="products flex-column align-center gap-2">
        <div className="card-container mb-2">
          {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
        </div>
      </section>

      <section className="start-journey flex-column align-center">
        <h1 className='bold center white mb-2'>Start Your Healthy Journey Today</h1>
        <p className='center white mb-2'>Subscribe now and get fresh A2 milk delivered to your doorstep every morning</p>
        <button className='primary' onClick={() => navigate('/profile')}>Schedule Your Delivery <LuArrowRight /></button>
      </section>
    </div>
  )
}

export default Products