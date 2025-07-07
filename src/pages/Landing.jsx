import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/log" style={{ marginRight: "1rem" }}>Log Poop</Link>
      <Link to="/dashboard" style={{ marginRight: "1rem" }}>Dashboard</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}