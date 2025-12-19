# Friends Dairy Farm – Web Application

This project is a custom-built web application designed for a dairy / farm-based business to manage product inquiries, customer communication, and subscription-based ordering in a simple, user-friendly way.

The focus of the application is clarity, ease of use, and minimal friction for end users, rather than complex enterprise workflows.

---

## 📌 Purpose of the Project

The application serves as a digital front for a dairy farm, allowing customers to:

- Explore available products
- Place one-time orders
- Set up recurring delivery subscriptions
- Contact the business directly through a built-in contact form

The system is intentionally lightweight and does not rely on a traditional backend server.

---

## 🛒 Ordering & Subscription System

The application includes a cart-based ordering flow with two modes:

### One-Time Orders
- Customers can add products to a cart
- Select a delivery date
- Place an order with cash-on-delivery intent

### Recurring Subscriptions
- Customers can choose daily or weekly delivery schedules
- Select a start date
- Choose delivery days using a simple tag-based interface
- Subscriptions automatically calculate upcoming delivery dates

Cart data is persisted locally in the browser to avoid accidental loss.

---

## 🔁 Cart Management

- Products can be added, removed, or adjusted in quantity
- Cart state is saved between sessions
- Empty cart states guide users back to products instead of showing checkout controls

---

## 📬 Contact & Communication

The application includes a contact form that allows users to send inquiries directly to the business.

- Messages are delivered via email using EmailJS
- No backend server is required
- The email template captures sender details, message content, and contact information
- Designed for quick response and clear readability

---

## 🎨 Design Philosophy

- Minimal UI with clear visual feedback
- Mobile-friendly interaction patterns
- Simple controls over complex forms
- Visual clarity for selections, states, and actions

---

## 🧠 Architectural Notes

- Client-side state management using React Context
- No server-side storage or processing
- Local storage is used where persistence is required
- The system is designed to be easily extended in the future

---

## 🚧 Future Scope

Potential enhancements include:
- Admin dashboard for managing orders and subscriptions
- Payment gateway integration
- Customer order history
- Notifications via SMS or WhatsApp
- Server-backed persistence if scale requires it

---

## 📄 License

This project is privately developed for business use.  
All rights reserved.
