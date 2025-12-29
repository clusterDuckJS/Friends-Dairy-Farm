import React, { useState } from "react";
import { useCart } from "../../Context/CartContext";
import { LuTrash2 } from "react-icons/lu";


/*
Expected product shape:
{
  id, name, description, features: [], images: [], variants: [{size, price, sku}]
}
*/
export default function ProductCard({ product }) {
  const { items, addToCart, removeFromCart } = useCart();

  function getVariantKey(v) {
    return `${product.id}::${v.sku || v.size}`;
  }

  function getQtyForVariant(v) {
    const key = getVariantKey(v);
    const item = items.find(i => i.id === key);
    return item ? item.qty : 0;
  }

  function buildCartItem(v) {
    return {
      id: getVariantKey(v),
      productId: product.id,
      name: `${product.name}${v.size ? ` (${v.size})` : ""}`,
      price: Number(v.price || 0),
      image: product.images?.[0] || null,
      qty: 1,
      variant: v,
    };
  }

  return (
    <div className="card">
      <img
        src={product.images?.[0] || "/assets/no-image.png"}
        alt={product.name}
      />

      <div className="text-wrapper">
        <h3 className="bold mb-1">{product.name}</h3>
        <p className="mb-1">{product.description}</p>

        <ul className="mb-1">
          {product.features?.map((f, i) => (
            <li key={i} className="mb-1">
              <span className="color-success">•</span> {f}
            </li>
          ))}
        </ul>

        {/* {product.coming_soon && (
          <div className="mb-1">
            <span className="badge coming-soon">Coming Soon</span>
            <p className="text-light">
              This product is not available yet.
            </p>
          </div>
        )} */}

        <p className="bold mb-1">Available Sizes:</p>

        {product.variants?.map(v => {
          const qty = getQtyForVariant(v);
          const key = getVariantKey(v);

          return (
            <div
              className="price-card flex space-btw align-center mb-1"
              key={key}
            >
              <div className="text-wrapper">
                <p className="bold">{v.size}</p>
                <h3 className="color-primary bold">₹{v.price}</h3>
              </div>

              {product.coming_soon ? (
                <button className="secondary" disabled>
                  Coming Soon
                </button>
              ) : qty === 0 ? (
                <button
                  className="primary"
                  onClick={() => addToCart(buildCartItem(v), 1)}
                >
                  Add to cart
                </button>
              ) : (
                <div className="qty-control flex align-center gap-1">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      qty === 1
                        ? removeFromCart(key)
                        : addToCart(buildCartItem(v), -1)
                    }
                  >
                    −
                  </button>

                  <span className="bold">{qty}</span>

                  <button
                    className="qty-btn"
                    onClick={() => addToCart(buildCartItem(v), 1)}
                  >
                    +
                  </button>

                  <LuTrash2
                    className="cart-remove pointer"
                    title="Remove"
                    onClick={() => removeFromCart(key)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

