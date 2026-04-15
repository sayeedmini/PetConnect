import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import GroomerDirectory from './components/GroomerDirectory';
import GroomerDetail from './components/GroomerDetail';
import BookingForm from './components/BookingForm';
import LiveTrackingDashboard from './components/LiveTrackingDashboard';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Simple Navigation Bar */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-bold text-indigo-600">
                    PetConnect
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Find Groomers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* The Groomer Directory serves as the Home page for this demo */}
            <Route path="/" element={<GroomerDirectory />} />
            <Route path="/groomer/:id" element={<GroomerDetail />} />
            <Route path="/book/:groomerId" element={<BookingForm />} />
            <Route path="/tracking/:bookingId" element={<LiveTrackingDashboard />} />
          </Routes>
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              &copy; 2026 PetConnect, Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
