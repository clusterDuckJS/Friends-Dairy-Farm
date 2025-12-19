import { useRef, useState } from "react";
import './contact.css'
import emailjs from "@emailjs/browser";
import Logo from '../../assets/logo.webp'
import { LuClock, LuMail, LuMapPin, LuPhone } from 'react-icons/lu'

function Contact() {
    const formRef = useRef();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    function sendEmail(e) {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            formRef.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
            .then(() => {
                setStatus("Message sent successfully ✅");
                formRef.current.reset();
            })
            .catch((err) => {
                console.error(err);
                setStatus("Failed to send message. Please try again.");
            })
            .finally(() => setLoading(false));
    }


    return (
        <div className='main-container contact'>
            <section className="intro flex-column align-center bg-light">
                <img src={Logo} className='logo-section' alt="Friends Dairy Farm Logo" />
                <h1 className='center bold mb-1'>Get in Touch</h1>
                <p className='center'>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </section>
            <section className="info-wrapper gap-2">
                {/* <div className="form-details-wrapper grid col-2 gap-2"> */}

                <div className="contact-info">
                    <h2 className='bold mb-1'>Contact Information</h2>
                    <p className='mb-2'>Reach out to us through any of these channels. We're here to help!</p>
                    <div className="card-items-wrapper flex-column gap-2">
                        <div className="card flex gap-1 align-start">
                            <div className="svg-wrapper sm">
                                <LuPhone />
                            </div>
                            <div className="contact-text-wrapper">
                                <p className='bold'>Phone</p>
                                <p>+91 97900 09985</p>
                                <p>Mon-Sat, 6:00 AM - 8:00 PM</p>
                            </div>
                        </div>
                        <div className="card flex gap-1 align-start">
                            <div className="svg-wrapper sm">
                                <LuMail />
                            </div>
                            <div className="contact-text-wrapper">
                                <p className='bold'>Email</p>
                                <p>fdfchennai@gmail.com</p>
                                <p>We'll respond within 24 hours</p>
                            </div>
                        </div>
                        <div className="card flex gap-1 align-start">
                            <div className="svg-wrapper sm">
                                <LuMapPin />
                            </div>
                            <div className="contact-text-wrapper">
                                <p className='bold'>Address</p>
                                <p>Friends Dairy Farm</p>
                                <p>Chennai, Tamil Nadu</p>
                                <p>India - 600001</p>
                            </div>
                        </div>
                        <div className="card flex gap-1 align-start height-fit">
                            <div className="svg-wrapper sm">
                                <LuClock />
                            </div>
                            <div className="contact-text-wrapper">
                                <p className='bold'>Delivery Hours</p>
                                <p>Daily: 5:00 AM - 7:00 AM</p>
                                <p>Fresh milk delivered every morning</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card form-container">
                    <h2 className='bold mb-2'>Send Us a Message</h2>
                    {/* <form className="contact-form" > */}
                    <form
                        ref={formRef}
                        className="contact-form"
                        onSubmit={sendEmail}
                    >
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="firstName">First Name</label>
                                <input name="first_name" id="firstName" type="text" placeholder="John" required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="lastName">Last Name</label>
                                <input name="last_name" id="lastName" type="text" placeholder="Doe" required />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input name="email" id="email" type="email" placeholder="john.doe@example.com" required />
                        </div>

                        <div className="form-field">
                            <label htmlFor="phone">Phone Number</label>
                            <input name="phone" id="phone" type="tel" placeholder="+91 XXX XXX XXXX" />
                        </div>

                        <div className="form-field">
                            <label htmlFor="org">Organization</label>
                            <input name="org" id="org" type="text" placeholder="Hospital/Clinic Name" />
                        </div>

                        <div className="form-field">
                            <label htmlFor="subject">Subject</label>
                            <input name="subject" id="subject" type="text" placeholder="Product Inquiry" />
                        </div>

                        <div className="form-field">
                            <label htmlFor="message">Message</label>
                            <textarea name="message" id="message" rows="4" placeholder="Write your message here..." required />
                        </div>

                        <button type="submit" className="primary" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>

                        {status && <p className="form-status">{status}</p>}
                    </form>
                </div>


                {/* </div> */}
            </section>
        </div>
    )
}

export default Contact