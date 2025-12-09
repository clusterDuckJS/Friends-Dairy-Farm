// src/utils/date.js

/**
 * Formats a timestamp into readable "Dec 7, 2025 • 7:21 PM"
 */
// export function formatDateTime(dateStr) {
//   if (!dateStr) return "—";

//   const d = new Date(dateStr);
//   if (isNaN(d)) return dateStr;

//   return d.toLocaleString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// /**
//  * Formats date only: "Dec 7, 2025"
//  */
// export function formatDateOnly(dateStr) {
//   if (!dateStr) return "—";

//   const d = new Date(dateStr);
//   if (isNaN(d)) return dateStr;

//   return d.toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// /**
//  * Relative time: "3h ago", "Yesterday", etc.
//  */
// export function timeAgo(dateStr) {
//   if (!dateStr) return "—";
//   const d = new Date(dateStr);
//   if (isNaN(d)) return dateStr;

//   const seconds = (Date.now() - d.getTime()) / 1000;

//   if (seconds < 60) return "Just now";
//   if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

//   return d.toLocaleDateString("en-IN", {
//     month: "short",
//     day: "numeric",
//   });
// }

// src/utils/date.js
export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatDateOnly(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const seconds = (Date.now() - d.getTime()) / 1000;
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

