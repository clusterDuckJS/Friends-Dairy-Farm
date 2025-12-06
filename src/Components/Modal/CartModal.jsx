import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../../hooks/useAuth";
import { createOrder } from "../../utils/orders";
import { createSubscription } from "../../utils/subscription";
import { computeNextDeliveryDate } from "../../utils/scheduleUtils"; // if you use recurring logic
import { useCart } from "../../Context/CartContext";

export default function CartModal({ open, onClose, onCompleted }) {
  const { items, total, clearCart } = useCart();
  const user = useAuth();

  const [mode, setMode] = useState("one-time"); // 'one-time' | 'recurring'
  const [oneTimeDate, setOneTimeDate] = useState("");
  const [recurringType, setRecurringType] = useState("daily"); // daily|weekly
  const [dailyStart, setDailyStart] = useState("");
  const [dailyEvery, setDailyEvery] = useState(1);
  const [weeklyStart, setWeeklyStart] = useState("");
  const [weeklyDays, setWeeklyDays] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handlePlace() {
    if (!user) return alert("Please login first");

    if (items.length === 0) return alert("Cart is empty");
    setLoading(true);

    try {
      if (mode === "one-time") {
        if (!oneTimeDate) return alert("Pick a delivery date");
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
        alert("Order placed. Pay in person on delivery.");
        return;
      }

      // recurring flow: create subscription
      let schedule_meta = null;
      if (recurringType === "daily") {
        if (!dailyStart) return alert("Pick start date");
        schedule_meta = { start_date: dailyStart, every_n_days: Number(dailyEvery || 1) };
      } else {
        if (!weeklyStart || !weeklyDays.length) return alert("Pick start date and days");
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
      alert("Recurring subscription created.");
    } catch (err) {
      console.error("place error:", err);
      alert("Failed to place order/subscription: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
        <h3>Cart</h3>

        <div style={{ maxHeight: 320, overflow: "auto" }}>
          {items.map(it => (
            <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{it.name}</div>
                <div>Qty: {it.qty}</div>
              </div>
              <div>₹{(Number(it.price || 0) * Number(it.qty || 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, fontWeight: 700 }}>Total: ₹{total.toFixed(2)}</div>

        <hr />

        <div>
          <label><input type="radio" checked={mode === "one-time"} onChange={() => setMode("one-time")} /> One-time order</label>
          <label style={{ marginLeft: 12 }}><input type="radio" checked={mode === "recurring"} onChange={() => setMode("recurring")} /> Recurring subscription</label>
        </div>

        {mode === "one-time" && (
          <>
            <label className="label">Delivery date</label>
            <input type="date" className="input" value={oneTimeDate} onChange={e => setOneTimeDate(e.target.value)} />
          </>
        )}

        {mode === "recurring" && (
          <>
            <div>
              <label className="label">Recurring type</label>
              <select value={recurringType} onChange={e => setRecurringType(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {recurringType === "daily" && (
              <>
                <label className="label">Start date</label>
                <input type="date" className="input" value={dailyStart} onChange={e => setDailyStart(e.target.value)} />
                <label className="label">Every N days</label>
                <input type="number" className="input" min="1" value={dailyEvery} onChange={e => setDailyEvery(e.target.value)} />
              </>
            )}

            {recurringType === "weekly" && (
              <>
                <label className="label">Start date</label>
                <input type="date" className="input" value={weeklyStart} onChange={e => setWeeklyStart(e.target.value)} />
                <label className="label">Days</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["mon","tue","wed","thu","fri","sat","sun"].map(d => (
                    <button key={d} type="button" className="pill" onClick={() => {
                      setWeeklyDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
                    }}>{d}</button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <div className="modal-actions">
          <button className="primary-btn" onClick={handlePlace} disabled={loading}>{loading ? "Placing..." : (mode === "one-time" ? "Place Order" : "Create Subscription")}</button>
          <button className="ghost-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
