// src/utils/scheduleUtils.js
import { formatDateOnly } from "./date";

function safeParseMeta(m) {
  if (!m) return {};
  if (typeof m === "object") return m;
  try { return JSON.parse(m); } catch { return {}; }
}

export function formatScheduleReadable(item) {
  const type = (item?.schedule_type || "").toLowerCase();
  const meta = safeParseMeta(item?.schedule_meta);
  if (type === "one-time" || type === "one_time" || type === "onetime") {
    const date = meta?.date || meta?.start_date || item?.next_delivery_date;
    return `One-time — ${formatDateOnly(date)}`;
  }
  if (type === "daily") {
    const start = meta?.start_date || item?.next_delivery_date;
    const every = meta?.every_n_days ?? meta?.every ?? 1;
    return `Daily — starts ${formatDateOnly(start)} • every ${every} day${Number(every) > 1 ? "s" : ""}`;
  }
  if (type === "weekly") {
    const start = meta?.start_date || item?.next_delivery_date;
    const rawDays = Array.isArray(meta?.days) ? meta.days : (meta?.weekdays || []);
    const LABEL = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
    const days = rawDays.map(d => {
      if (!d) return null;
      const s = String(d).toLowerCase().slice(0,3);
      return LABEL[s] || String(d);
    }).filter(Boolean);
    const daysLabel = days.length ? ` • ${days.join(", ")}` : "";
    return `Weekly — starts ${formatDateOnly(start)}${daysLabel}`;
  }
  const fallbackDate = safeParseMeta(item?.schedule_meta)?.start_date || item?.next_delivery_date;
  return `${item?.schedule_type || "Schedule"}${fallbackDate ? ` — ${formatDateOnly(fallbackDate)}` : ""}`;
}
