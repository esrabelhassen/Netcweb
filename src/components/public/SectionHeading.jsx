import React from "react";

export default function SectionHeading({ label, title, description, align = "center" }) {
  const cls = align === "left" ? "text-left" : "text-center";
  return (
    <div className={`mb-8 ${cls}`}>
      {label && <p className="text-sm text-primary mb-2">{label}</p>}
      {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
