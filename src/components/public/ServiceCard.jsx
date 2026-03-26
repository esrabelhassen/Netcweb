import React from "react";
import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service?.id}`} className="block p-4 border rounded-xl">
      <h3 className="font-semibold">{service?.title || "Service"}</h3>
      <p className="text-sm text-muted-foreground">{service?.description || ""}</p>
    </Link>
  );
}
