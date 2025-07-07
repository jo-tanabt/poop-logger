
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "center",
      padding: "1rem",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #eaeaea",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>💩 Poop Logger</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <NavLink
            to="/log"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#333" : "#888",
              fontWeight: isActive ? "bold" : "normal"
            })}
          >
            Log Poop
          </NavLink>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#333" : "#888",
              fontWeight: isActive ? "bold" : "normal"
            })}
          >
            Dashboard
          </NavLink>
          <button onClick={logout} style={{
            background: "none",
            border: "none",
            color: "#d00",
            cursor: "pointer",
            padding: "0"
          }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}