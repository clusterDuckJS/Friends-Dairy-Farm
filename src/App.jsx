import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import About from './Pages/About/About'
import Home from './Pages/Home/Home'
import Products from './Pages/Products/Products'
import Gallery from './Pages/Gallery/Gallery'
import Contact from './Pages/Contact/Contact'
import Faq from './Pages/Faq/Faq'
import Login from './Pages/Login/Login'
import Profile from './Pages/Profile/Profile'
import PrivateRoute from './Components/PrivateRoute'
import AdminDashboardPage from './Pages/AdminDashboard/AdminDashboard'
import WhatsAppFab from './Components/WhatsAppFab/WhatsAppFab'


function App() {
  const location = useLocation();
  const hideFooter = location.pathname === "/login";
  const hideHeader = location.pathname === "/login";
  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/profile"
          element={<PrivateRoute>
            <Profile />
          </PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        
      </Routes>
      <WhatsAppFab phone="919790009985" message="Hello! Can I get more info on this?" />
      {!hideFooter && <Footer />}

    </>
  )
}

export default App
