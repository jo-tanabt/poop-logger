import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import Landing from "./pages/Landing";
import PoopLogger from "./pages/PoopLogger";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/log"
          element={
            <PrivateRoute>
              <PoopLogger />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
