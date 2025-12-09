// src/utils/schedule.js
const DAY_MAP = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6
};

function isoDateFromLocal(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function safeParseMeta(m) {
  if (!m) return {};
  if (typeof m === "object") return m;
  try { return JSON.parse(m); } catch { return {}; }
}

function normalizeWeekdays(daysRaw) {
  if (!daysRaw) return [];
  let arr = Array.isArray(daysRaw) ? daysRaw.slice() : String(daysRaw).split(/[,|;]/).map(s => s.trim()).filter(Boolean);
  const out = [];
  for (const v of arr) {
    if (v === "") continue;
    const lowered = String(v).toLowerCase();
    if (DAY_MAP.hasOwnProperty(lowered)) { out.push(DAY_MAP[lowered]); continue; }
    const num = Number(v);
    if (!Number.isNaN(num)) {
      if (num >= 0 && num <= 6) out.push(num);
      else if (num >= 1 && num <= 7) out.push((num % 7));
    }
  }
  return Array.from(new Set(out)).sort((a,b) => a-b);
}

export function computeNextDeliveryDate(scheduleType, scheduleMeta = {}) {
  const meta = safeParseMeta(scheduleMeta);
  const today = new Date();
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!scheduleType) return null;
  const type = String(scheduleType).toLowerCase();

  if (type === "one-time" || type === "one_time" || type === "onetime") {
    const dateStr = meta?.date || meta?.start_date || meta?.startDate || meta?.day;
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return isoDateFromLocal(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  if (type === "daily") {
    const startRaw = meta?.start_date || meta?.startDate || meta?.from;
    let start = startRaw ? new Date(startRaw) : now;
    if (startRaw && isNaN(start.getTime())) start = now;
    const startLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const every = Number(meta?.every_n_days ?? meta?.every ?? meta?.everyDays ?? 1) || 1;
    if (every < 1) return isoDateFromLocal(startLocal);
    if (startLocal >= now) return isoDateFromLocal(startLocal);
    const maxIter = 3650;
    let candidate = new Date(startLocal);
    for (let i = 0; i < maxIter; i++) {
      candidate.setDate(candidate.getDate() + every);
      if (candidate >= now) return isoDateFromLocal(candidate);
    }
    return isoDateFromLocal(candidate);
  }

  if (type === "weekly") {
    const startRaw = meta?.start_date || meta?.startDate || meta?.from;
    let start = startRaw ? new Date(startRaw) : now;
    if (startRaw && isNaN(start.getTime())) start = now;
    const startLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    let days = normalizeWeekdays(meta?.days ?? meta?.weekdays ?? meta?.dayOfWeek ?? meta?.days_of_week);
    if (!days || days.length === 0) return isoDateFromLocal(startLocal >= now ? startLocal : now);

    const maxSearch = 28;
    for (let offset = 0; offset < maxSearch; offset++) {
      const cand = new Date(startLocal);
      cand.setDate(startLocal.getDate() + offset);
      if (days.includes(cand.getDay())) { if (cand >= now) return isoDateFromLocal(cand); }
    }

    for (let offset = 0; offset < 365; offset++) {
      const cand = new Date(now);
      cand.setDate(now.getDate() + offset);
      if (days.includes(cand.getDay())) return isoDateFromLocal(cand);
    }

    return isoDateFromLocal(now);
  }

  return null;
}
