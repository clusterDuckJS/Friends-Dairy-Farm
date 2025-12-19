import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../../hooks/useAuth";
import "./modal.css";
import { createOrder } from "../../utils/orders";
import { createSubscription } from "../../utils/subscription";
// import { computeNextDeliveryDate } from "../../utils/schedule"; // if you use recurring logic
import { useCart } from "../../Context/CartContext";
import { LuMinus, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { useToast } from "../../Context/ToastContext";
import { computeNextDeliveryDate } from "../../utils/schedule";
import { useNavigate } from "react-router-dom";

export default function CartModal({ open, onClose, onCompleted }) {
  const { items, total, clearCart, removeFromCart, setQty } = useCart();

  const user = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("one-time"); // 'one-time' | 'recurring'
  const [oneTimeDate, setOneTimeDate] = useState("");
  const [recurringType, setRecurringType] = useState("daily"); // daily|weekly
  const [dailyStart, setDailyStart] = useState("");
  const [dailyEvery, setDailyEvery] = useState(1);
  const [weeklyStart, setWeeklyStart] = useState("");
  const [weeklyDays, setWeeklyDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!open) return null;

  async function handlePlace() {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setLoading(true);

    try {
      if (mode === "one-time") {
        if (!oneTimeDate) {
          toast.error("Pick a delivery date");
          return;
        }
        // create order
        await createOrder({
          userId: user.id,
          items,
          total_amount: total,
          schedule_type: "one-time",
          schedule_meta: { date: oneTimeDate },
        });
        // cash on delivery: order created with status pending
        clearCart();
        onCompleted && onCompleted();
        onClose();
        toast.success("Order placed. Pay in person on delivery.");
        return;
      }

      // recurring flow: create subscription
      let schedule_meta = null;
      if (recurringType === "daily") {
        if (!dailyStart) {
          toast.error("Pick start date");
          return;
        }
        schedule_meta = { start_date: dailyStart, every_n_days: Number(dailyEvery || 1) };
      } else {
        if (!weeklyStart || !weeklyDays.length) {
          toast.error("Pick start date and days");
          return;
        }
        schedule_meta = { start_date: weeklyStart, days: weeklyDays };
      }

      const next_delivery_date = computeNextDeliveryDate(recurringType, schedule_meta);

      // Using product snapshot: we store subscription.product_name = comma-joined product names for now
      const product_name = items.map(i => `${i.name} x${i.qty}`).join(", ");

      await createSubscription({
        userId: user.id,
        product_name,
        qty: 1,
        schedule_type: recurringType,
        schedule_meta,
        next_delivery_date,
      });

      clearCart();
      onCompleted && onCompleted();
      onClose();
      toast.success("Recurring subscription created.");
    } catch (err) {
      console.error("place error:", err);
      toast.error("Failed to place order/subscription: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-box cart" onMouseDown={(e) => e.stopPropagation()}>
        <div className="heading-wrapper flex space-btw mb-1">
          <h3>Cart</h3>
          <LuX className="pointer" onClick={onClose} />
        </div>

        {/* EMPTY CART STATE */}
        {items.length === 0 && (
          <div className="mb-1">
            <p className="mb-05">Your cart is empty 🛒</p>
            <p className="mb-05">
              Looks like you haven’t added anything yet.
            </p>

            <button
              className="primary"
              onClick={() => {
                onClose();
                navigate('/products'); // adjust route if needed
              }}
            >
              Browse Products
            </button>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div style={{ maxHeight: 320, overflow: "auto" }}>
              {items.map(it => (
                <div key={it.id} className="cart-item flex space-btw align-center mb-05">
                  <div>
                    <div style={{ fontWeight: 700 }}>{it.name}</div>

                    <div className="flex align-center gap-05 mt-05">
                      <button
                        className="qty-btn"
                        onClick={() => {
                          const next = it.qty - 1;
                          next <= 0 ? removeFromCart(it.id) : setQty(it.id, next);
                        }}
                      >
                        <LuMinus size={14} />
                      </button>

                      <span className="qty-value">{it.qty}</span>

                      <button
                        className="qty-btn"
                        onClick={() => setQty(it.id, it.qty + 1)}
                      >
                        <LuPlus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex align-center gap-05">
                    <div className="bold">
                      ₹{(Number(it.price || 0) * it.qty).toFixed(2)}
                    </div>

                    <LuTrash2
                      className="cart-remove pointer"
                      onClick={() => removeFromCart(it.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="bold mb-1 mt-1 total-value">Total: ₹{total.toFixed(2)}</p>

            <div className="btn-container mb-1">
              <label><input type="radio" checked={mode === "one-time"} onChange={() => setMode("one-time")} /> One-time order</label>
              <label><input type="radio" checked={mode === "recurring"} onChange={() => setMode("recurring")} /> Recurring subscription</label>
            </div>

            {mode === "one-time" && (
              <div className="btn-container mb-1">
                <label className="bold">Delivery date: </label>
                <input type="date" className="input" value={oneTimeDate} onChange={e => setOneTimeDate(e.target.value)} />
              </div>
            )}

            {mode === "recurring" && (
              <>
                <div className="btn-container mb-05">
                  <label>Recurring type: </label>
                  <select value={recurringType} onChange={e => setRecurringType(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {recurringType === "daily" && (
                  <>
                    <div className="btn-container mb-05">
                      <label >Start date</label>
                      <input type="date" value={dailyStart} onChange={e => setDailyStart(e.target.value)} />
                    </div>
                    <label name='delivery-day' className="btn-container mb-1" >Deliver every
                      <input name='delivery-day' type="number" min="1" value={dailyEvery} onChange={e => setDailyEvery(e.target.value)} />
                      days</label>
                  </>

                )}

                {recurringType === "weekly" && (
                  <>
                  <div className="btn-container mb-05">
                    <label >Start date</label>
                    <input type="date" className="input mb-1" value={weeklyStart} onChange={e => setWeeklyStart(e.target.value)} />
                  </div>
                    <div className="flex space-btw wrap gap-05 mb-1">
                      <label >Deliver on: </label>
                      <div className="flex wrap gap-05">
                        {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(d => {
                          const selected = weeklyDays.includes(d);

                          return (
                            <div
                              key={d}
                              className={`tag-btn ${selected ? "tag-btn--active" : ""}`}
                              onClick={() => {
                                setWeeklyDays(prev =>
                                  selected ? prev.filter(x => x !== d) : [...prev, d]
                                );
                              }}
                            >
                              {d}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <button className="primary" onClick={handlePlace} disabled={loading}>{loading ? "Placing..." : (mode === "one-time" ? "Place Order" : "Create Subscription")}</button>

          </>)}
      </div>
    </div>,


    document.body
  );
}
