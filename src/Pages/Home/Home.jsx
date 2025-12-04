
import HERO from '../../assets/hero.webp'
import './home.css'
import MILK from '../../assets/milk.webp'
import GHEE from '../../assets/ghee.webp'
import { LuArrowRight, LuHeart, LuLeaf, LuMilk, LuTruck } from 'react-icons/lu'
import { GoStarFill } from 'react-icons/go'
import { useNavigate } from 'react-router-dom'

function Home() {

    const navigate = useNavigate();

    return (
        <div className='main-container home'>
            <section className="hero flex align-center gap-2">
                <div className="text-wrapper">
                    <small className='tag'>🌾 Farm Fresh & Pure</small>
                    <h1 className='bold mt-2'>Pure A2 Milk</h1>
                    <h1 className='bold color-primary'>From Our Farm</h1>
                    <h1 className='bold mb-2'>To Your Home</h1>
                    <p className='mb-2'>Experience the goodness of traditional dairy farming. Fresh, pure A2 milk and handcrafted dairy products delivered daily to your doorstep in Chennai.</p>
                    <div className="btn-container">
                        <button className='primary' onClick={() => navigate('/products')}>View Products <LuArrowRight /> </button>
                        <button className='secondary' onClick={() => navigate('/profile')}>Schedule Delivery</button>
                    </div>
                </div>
                <img src={HERO} alt="cow" />
            </section>

            {/* why us */}
            <section className="choose flex-column align-center">
                <h2 className='center mb-1'>Why Choose Us?</h2>
                <p className='center mb-2'>We're committed to providing the purest dairy products with traditional values and modern convenience.</p>
                <div className="card-container flex gap-2">
                    <div className="card flex-column align-center">
                        <div className="svg-wrapper mb-1">
                            <LuMilk />
                        </div>
                        <h5 className='center bold mb-05'>100% Pure A2 Milk</h5>
                        <p className='center'>From indigenous cow breeds for better digestion and nutrition</p>
                    </div>
                    <div className="card flex-column align-center">
                        <div className="svg-wrapper mb-1">
                            <LuLeaf />
                        </div>
                        <h5 className='center bold mb-05'>Grass-Fed Cows</h5>
                        <p className='center'>Our cows graze on natural grass without hormones or antibiotics</p>
                    </div>
                    <div className="card flex-column align-center">
                        <div className="svg-wrapper mb-1">
                            <LuHeart />
                        </div>
                        <h5 className='center bold mb-05'>Chemical-Free</h5>
                        <p className='center'>No preservatives, additives, or artificial substances</p>
                    </div>
                    <div className="card flex-column align-center">
                        <div className="svg-wrapper mb-1">
                            <LuTruck />
                        </div>
                        <h5 className='center bold mb-05'>Daily Delivery</h5>
                        <p className='center'>Fresh farm-to-door delivery every morning across Chennai</p>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="products flex-column align-center">
                <h2 className='center mb-1'>Our Products</h2>
                <p className='center mb-2'>Handcrafted with love, delivered with care</p>
                <div className="card-container mb-2">
                    <div className="card">
                        <img src={MILK} alt="milk" />
                        <div className="text-wrapper">
                            <h3 className='bold mb-1'>A2 Milk</h3>
                            <div className="tag-container flex gap-05">
                                <small className='tag'>0.5L & 1L</small>
                                <small className='tag'>Daily Fresh</small>
                                <small className='tag'>Pure A2</small>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <img src={GHEE} alt="ghee" />
                        <div className="text-wrapper">
                            <h3 className='bold mb-1'>Pure Ghee</h3>
                            <div className="tag-container flex gap-05">
                                <small className='tag'>Hand-Churned</small>
                                <small className='tag'>Traditional</small>
                                <small className='tag'>No Preservatives</small>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='primary'>View All Products <LuArrowRight/></button>
            </section>

            {/* Review */}
            <section className="review flex-column align-center">
                <h2 className='center mb-1'>What Our Customers Say</h2>
                <p className='center mb-2'>Join hundreds of happy families in Chennai</p>

                <div className="card-container flex gap-1">
                    <div className="card flex-column space-btw">
                        <div className="star-container flex mb-1">
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                        </div>
                        <p className='italic mb-1'>"The A2 milk quality is exceptional! My children love it. Fresh delivery every morning."</p>
                        <div className="text-wrapper">
                            <p className='bold'>Priya Ramesh</p>
                            <small>Anna Nagar, Chennai</small>
                        </div>
                    </div>

                    <div className="card flex-column space-btw">
                        <div className="star-container flex mb-1">
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                        </div>
                        <p className='italic mb-1'>"Best ghee I've ever tasted. Authentic traditional flavor that reminds me of my grandmother's cooking."</p>
                        <div className="text-wrapper">
                            <p className='bold'>Rajesh Kumar</p>
                            <small>T Nagar, Chennai</small>
                        </div>
                    </div>

                    <div className="card flex-column space-btw">
                        <div className="star-container flex mb-1">
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                            <GoStarFill />
                        </div>
                        <p className='italic mb-1'>"Very reliable service. The recurring delivery option is so convenient. Highly recommended!"</p>
                        <div className="text-wrapper">
                            <p className='bold'>Lakshmi Venkat</p>
                            <small>Adyar, Chennai</small>
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

export default Home