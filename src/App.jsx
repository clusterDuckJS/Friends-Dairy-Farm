import { Route, Routes } from 'react-router-dom'
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import About from './Pages/About/About'
import Home from './Pages/Home/Home'
import Products from './Pages/Products/Products'
import Gallery from './Pages/Gallery/Gallery'
import Contact from './Pages/Contact/Contact'
import Faq from './Pages/Faq/Faq'


function App() {

  return (
    <>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          {/* <Route path="/products/wound" element={<WoundProduct />} /> */}
        </Routes>
      <Footer />
    </>
  )
}

export default App
