import React from 'react'
import './faq.css'
import { useNavigate } from 'react-router-dom'

function Faq() {
    const navigate = useNavigate();
    return (
        <div className='main-container faq'>
            <section className="intro flex-column align-center bg-light">
                <h1 className='center bold mb-1'>Frequently Asked Questions</h1>
                <p className='center'>Find answers to common questions about our products, delivery, and services</p>
            </section>

            <section className="faq-container">
                <details className='card mb-1' name="faq">
                    <summary className='bold'>What is A2 milk and how is it different?</summary>
                    <p>A2 milk comes from cows that produce only A2 beta-casein protein. It's easier to digest and closer to the natural milk consumed by our ancestors. Our indigenous cows produce pure A2 milk.</p>
                </details>
                <details className='card mb-1' name="faq">
                    <summary className='bold'>How do you ensure the quality of milk?</summary>
                    <p>We maintain strict hygiene standards throughout the milking process. Our cows are grass-fed, free from hormones and antibiotics. Each batch undergoes quality testing before delivery.</p>
                </details>
                <details className='card mb-1' name="faq">
                    <summary className='bold'>What are your delivery timings?</summary>
                    <p>We deliver fresh milk early morning between 5 AM - 7 AM. For other products like ghee, we deliver within your preferred time slot.</p>
                </details>
                <details className='card mb-1' name="faq">
                    <summary className='bold'>Do you offer recurring delivery subscriptions?</summary>
                    <p>Yes! You can schedule daily, weekly, or custom recurring deliveries through your account. Manage your subscription anytime from your dashboard.</p>
                </details>
                <details className='card mb-1' name="faq">
                    <summary className='bold'>What is your delivery area?</summary>
                    <p>We currently deliver across major areas in Chennai including Anna Nagar, T Nagar, Adyar, Velachery, and surrounding neighborhoods. Contact us to check if we deliver to your area.</p>
                </details>
                <details className='card mb-1' name="faq">
                    <summary className='bold'>How is your ghee made?</summary>
                    <p>Our ghee is hand-churned using traditional bilona method from pure A2 milk. We use no preservatives or additives, ensuring authentic taste and quality.</p>
                </details>
                <details className='card mb-1' name="faq">
                    <summary className='bold'>Can I cancel or modify my subscription?</summary>
                    <p>Yes, you can easily modify, pause, or cancel your subscription from your account dashboard at any time without any penalties.</p>
                </details>
                <details className='card mb-1' name="faq">
                    <summary className='bold'>What payment methods do you accept?</summary>
                    <p>We accept all major payment methods including UPI, credit/debit cards, net banking, and cash on delivery.</p>
                </details>
            </section>

            <section className="start-journey flex-column align-center bg-primary">
                <h1 className='bold center white mb-2'>Still Have Questions?</h1>
                <p className='center white mb-2'>Can't find the answer you're looking for? Our team is here to help.</p>
                <button className='primary' onClick={() => {navigate('/contact')}}>Contact Us</button>
            </section>
        </div>
    )
}

export default Faq