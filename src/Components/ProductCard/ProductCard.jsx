import React, { useState } from "react";
import { useCart } from "../../Context/CartContext";


/*
Expected product shape:
{
  id, name, description, features: [], images: [], variants: [{size, price, sku}]
}
*/
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const variant = (product.variants && product.variants[selectedIdx]) || { size: "", price: 0, sku: "" };

  function handleAdd() {
    // cart expects product with id, name, price, image (optional), qty
    const cartItem = {
      id: `${product.id}::${variant.sku || variant.size}`, // unique per variant
      productId: product.id,
      name: `${product.name} ${variant.size ? `(${variant.size})` : ""}`,
      price: Number(variant.price || 0),
      image: (product.images && product.images[0]) || null,
      qty: 1,
      variant: variant
    };
    addToCart(cartItem, 1);
  }

  return (
    <div className="card">
      <img src={product.images?.[0] || "/assets/no-image.png"} alt={product.name} />
      <div className="text-wrapper">
        <h3 className="bold mb-1">{product.name}</h3>
        <p className="mb-1">{product.description}</p>

        <ul className="mb-1">
          {product.features?.map((f, i) => (
            <li key={i} className="mb-1"><span className="color-success">•</span> {f}</li>
          ))}
        </ul>

        <p className="bold mb-1">Available Sizes:</p>

        {product.variants?.map((v, idx) => (
          <div className="price-card flex space-btw align-center mb-1" key={v.sku || idx}>
            <div className="text-wrapper">
              <p className="bold">{v.size}</p>
              <h3 className="color-primary bold">₹{v.price}</h3>
            </div>
            <button
              className="primary"
              onClick={() => {
                setSelectedIdx(idx);
                handleAdd();
              }}
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
