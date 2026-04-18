import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "lucide-react";
import GroomerDirectory from "./views/GroomerDirectory";
import GroomerDetail from "./views/GroomerDetail";
import BookingForm from "./views/BookingForm";
import LiveTracking from "./views/LiveTracking";
import "./index.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="navbar-brand">
              PetConnect
            </Link>
            <div className="navbar-actions">
              <Link to="/" className="navbar-link">
                Find Groomers
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content — Views */}
        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<GroomerDirectory />} />
              <Route path="/groomer/:id" element={<GroomerDetail />} />
              <Route path="/book/:groomerId" element={<BookingForm />} />
              <Route path="/tracking/:bookingId" element={<LiveTracking />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          &copy; 2026 PetConnect. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
