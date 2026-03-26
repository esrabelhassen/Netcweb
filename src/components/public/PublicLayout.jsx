import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/categories", label: "Categories" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
          <Link to="/" className="font-black text-lg">NETC</Link>
          <nav className="flex items-center gap-2 text-sm">
            {nav.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md ${isActive ? "bg-muted font-semibold" : "text-muted-foreground hover:text-foreground"}`
                }
              >
                {i.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}