import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        toastOptions={{
          style: {
            border: "1.5px solid #111",
            borderRadius: "12px",
            fontFamily: "DM Sans, system-ui, sans-serif",
          },
        }}
      />
      <Routes>
        {/* only for logged-out users */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* only for logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* anything else goes home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;