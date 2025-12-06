// src/components/ScheduleModal.jsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { createSubscription } from "../../utils/subscription";
import { computeNextDeliveryDate } from "../../utils/scheduleUtils";

/*
Props:
  - onClose(): close modal
  - onCreated(): optional callback to refresh
*/
export default function ScheduleModal({ onClose, onCreated }) {
  const user = useAuth();

  // form fields
  const [productName, setProductName] = useState("Whole Milk (1L)");
  const [qty, setQty] = useState(1);

  const [scheduleType, setScheduleType] = useState("one-time");

  // one-time
  const [oneTimeDate, setOneTimeDate] = useState("");

  // daily
  const [dailyStart, setDailyStart] = useState("");
  const [dailyEvery, setDailyEvery] = useState(1);

  // weekly
  const [weeklyStart, setWeeklyStart] = useState("");
  const [weeklyDays, setWeeklyDays] = useState([]);

  const [loading, setLoading] = useState(false);

  const WEEKDAYS = [
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
    { key: "wed", label: "Wed" },
    { key: "thu", label: "Thu" },
    { key: "fri", label: "Fri" },
    { key: "sat", label: "Sat" },
    { key: "sun", label: "Sun" },
  ];

  function toggleDay(k) {
    setWeeklyDays(prev => (prev.includes(k) ? prev.filter(d => d !== k) : [...prev, k]));
  }

  function validate() {
    if (!productName) return "Product required";
    if (!qty || Number(qty) < 1) return "Quantity must be >=1";
    if (scheduleType === "one-time") {
      if (!oneTimeDate) return "Pick a delivery date";
    }
    if (scheduleType === "daily") {
      if (!dailyStart) return "Pick a start date for daily schedule";
      if (!dailyEvery || Number(dailyEvery) < 1) return "Every N days must be >=1";
    }
    if (scheduleType === "weekly") {
      if (!weeklyStart) return "Pick a start date for weekly schedule";
      if (!weeklyDays.length) return "Pick at least one weekday for weekly schedule";
    }
    return null;
  }

  async function handleCreate() {
    const err = validate();
    if (err) return alert(err);
    if (!user) return alert("You must be logged in");

    const schedule_meta = (scheduleType === "one-time") ? { date: oneTimeDate } :
                          (scheduleType === "daily") ? { start_date: dailyStart, every_n_days: Number(dailyEvery) } :
                          (scheduleType === "weekly") ? { start_date: weeklyStart, days: weeklyDays } :
                          {};

    const next_delivery_date = computeNextDeliveryDate(scheduleType, schedule_meta);

    setLoading(true);
    try {
      await createSubscription({
        userId: user.id,
        product_name: productName,
        qty: Number(qty),
        schedule_type: scheduleType,
        schedule_meta,
        next_delivery_date,
      });

      onCreated && onCreated();
      onClose && onClose();
    } catch (e) {
      console.error("create subscription failed", e);
      alert("Failed to create subscription: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Schedule Delivery</h3>

      <label className="label">Product</label>
      <input className="input" value={productName} onChange={e => setProductName(e.target.value)} />

      <label className="label">Quantity</label>
      <input className="input" type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} />

      <label className="label">Schedule type</label>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="button" className={`pill ${scheduleType === "one-time" ? "active" : ""}`} onClick={() => setScheduleType("one-time")}>One-time</button>
        <button type="button" className={`pill ${scheduleType === "daily" ? "active" : ""}`} onClick={() => setScheduleType("daily")}>Daily</button>
        <button type="button" className={`pill ${scheduleType === "weekly" ? "active" : ""}`} onClick={() => setScheduleType("weekly")}>Weekly</button>
      </div>

      {scheduleType === "one-time" && (
        <>
          <label className="label">Delivery date</label>
          <input className="input" type="date" value={oneTimeDate} onChange={e => setOneTimeDate(e.target.value)} />
        </>
      )}

      {scheduleType === "daily" && (
        <>
          <label className="label">Start date</label>
          <input className="input" type="date" value={dailyStart} onChange={e => setDailyStart(e.target.value)} />
          <label className="label">Every N days</label>
          <input className="input" type="number" min="1" value={dailyEvery} onChange={e => setDailyEvery(e.target.value)} />
        </>
      )}

      {scheduleType === "weekly" && (
        <>
          <label className="label">Start date</label>
          <input className="input" type="date" value={weeklyStart} onChange={e => setWeeklyStart(e.target.value)} />
          <label className="label">Days</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            {WEEKDAYS.map(w => (
              <button key={w.key} type="button" onClick={() => toggleDay(w.key)} className={`day-pill ${weeklyDays.includes(w.key) ? "active" : ""}`}>
                {w.label}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="modal-actions">
        <button className="primary-btn" onClick={handleCreate} disabled={loading}>
          {loading ? "Saving..." : "Create Delivery"}
        </button>
        <button className="ghost-btn" onClick={onClose} disabled={loading}>Cancel</button>
      </div>
    </div>
  );
}
