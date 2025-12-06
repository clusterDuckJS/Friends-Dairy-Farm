// src/utils/scheduleUtils.js
/**
 * computeNextDeliveryDate(scheduleType, scheduleMeta)
 * - scheduleType: "one-time" | "daily" | "weekly"
 * - scheduleMeta:
 *    one-time: { date: "YYYY-MM-DD" }
 *    daily:    { start_date: "YYYY-MM-DD", every_n_days: 1 }
 *    weekly:   { start_date: "YYYY-MM-DD", days: ["mon","wed","fri"] }
 *
 * Returns: "YYYY-MM-DD" or null
 */

const DAY_MAP = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

export function computeNextDeliveryDate(scheduleType, scheduleMeta = {}) {
  const today = new Date();
  if (scheduleType === "one-time") {
    return scheduleMeta?.date || null;
  }

  if (scheduleType === "daily") {
    const start = scheduleMeta?.start_date ? new Date(scheduleMeta.start_date) : today;
    const every = Number(scheduleMeta?.every_n_days ?? 1);
    // if start is today or earlier -> next = start (if >= today) else compute forward to >= today
    let candidate = new Date(start);
    candidate.setHours(0,0,0,0);
    const now = new Date(today); now.setHours(0,0,0,0);
    if (candidate >= now) return isoDate(candidate);

    // advance by multiples of 'every' until >= today (safety cap 365 iterations)
    for (let i = 0; i < 365; i++) {
      candidate.setDate(candidate.getDate() + every);
      if (candidate >= now) return isoDate(candidate);
    }
    return isoDate(candidate);
  }

  if (scheduleType === "weekly") {
    const start = scheduleMeta?.start_date ? new Date(scheduleMeta.start_date) : today;
    let days = Array.isArray(scheduleMeta?.days) ? scheduleMeta.days : [];
    if (days.length === 0) return isoDate(start);

    const selectedIdxs = days.map(d => DAY_MAP[d]).filter(v => typeof v === "number");
    // search next 28 days for first matching weekday >= start
    let candidate = new Date(start);
    candidate.setHours(0,0,0,0);
    for (let offset = 0; offset < 28; offset++) {
      const c = new Date(candidate);
      c.setDate(candidate.getDate() + offset);
      if (selectedIdxs.includes(c.getDay())) return isoDate(c);
    }
    // fallback
    return isoDate(candidate);
  }

  return null;
}
