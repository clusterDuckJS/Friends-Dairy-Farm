// WhatsAppFab.jsx
import React from "react";

export default function WhatsAppFab({
  phone = "919790009985",           // international, no + or spaces
  message = "Hi there!",            // default message
  size = 56,                        // button diameter in px
  right = 18,
  bottom = 18
}) {
  const encoded = encodeURIComponent(message || "");
  const href = `https://wa.me/${phone}${encoded ? `?text=${encoded}` : ""}`;

  const btnStyle = {
    position: "fixed",
    right,
    bottom,
    width: size,
    height: size,
    borderRadius: "50%",
    background: "#25D366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
    zIndex: 9999,
    textDecoration: "none",
    cursor: "pointer",
    transition: "transform .12s ease"
  };

  const imgStyle = {
    width: Math.round(size * 0.62),
    height: Math.round(size * 0.62),
    display: "block",
    pointerEvents: "none"
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={btnStyle}
      onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"} // tactile press
      onMouseUp={(e) => e.currentTarget.style.transform = ""}
      onMouseLeave={(e) => e.currentTarget.style.transform = ""}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        style={imgStyle}
        onError={(e) => {
          // fallback to emoji if remote svg can't load
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='${imgStyle.width}' height='${imgStyle.height}'><circle cx='12' cy='12' r='12' fill='%23FFFFFF'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%23000000'>💬</text></svg>`
            );
        }}
      />
    </a>
  );
}

