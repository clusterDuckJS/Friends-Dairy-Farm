import { Route, Routes } from 'react-router-dom'
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import About from './Pages/About/About'
import Home from './Pages/Home/Home'
import Products from './Pages/Products/Products'


function App() {

  return (
    <>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          {/* <Route path="/gallery" element={<Services />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/faq" element={<Faq />} /> */}
          {/* <Route path="/products/wound" element={<WoundProduct />} /> */}
        </Routes>
      <Footer />
    </>
  )
}

export default App
