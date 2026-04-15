import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import VetListPage from './features/vets/pages/VetListPage';
import AddVetPage from './features/vets/pages/AddVetPage';
import VetDetailsPage from './features/vets/pages/VetDetailsPage';
import EditVetPage from './features/vets/pages/EditVetPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import { getUser, isLoggedIn, logout } from './features/auth/utils/auth';
import BookAppointmentPage from './features/appointments/pages/BookAppointmentPage';
import MyAppointmentsPage from './features/appointments/pages/MyAppointmentsPage';
import RescheduleAppointmentPage from './features/appointments/pages/RescheduleAppointmentPage';

function Home() {
  const user = getUser();
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <div className="container">
        <section className="hero">
          <div className="hero-panel">
            <span className="badge">Pet Care Platform</span>
            <h1 style={{ marginTop: '14px' }}>Welcome to PetConnect</h1>
            <p>
              A simple platform for pet owners to find trusted vet services,
              manage appointments, and access pet care support with ease.
            </p>

            <div className="toolbar" style={{ marginTop: '22px' }}>
              {!loggedIn && (
                <>
                  <Link className="btn btn-primary" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-secondary" to="/register">
                    Register
                  </Link>
                </>
              )}

              {loggedIn && (
                <>
                  <Link className="btn btn-primary" to="/vets">
                    Explore Vet Clinics
                  </Link>
                  <Link className="btn btn-secondary" to="/appointments">
                    My Appointments
                  </Link>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>

            {loggedIn && (
              <p style={{ marginTop: '18px' }}>
                Logged in as <strong>{user?.name}</strong> ({user?.role})
              </p>
            )}
          </div>

          <div className="stats-box">
            <div className="stat-card">
              <h3>Find nearby vets</h3>
              <p>Search clinics by service, rating, and distance.</p>
            </div>

            <div className="stat-card">
              <h3>Book appointments</h3>
              <p>Choose available slots and manage your appointment history.</p>
            </div>

            <div className="stat-card">
              <h3>Simple experience</h3>
              <p>Clean layout, responsive pages, and easier navigation.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vets" element={<VetListPage />} />
        <Route path="/vets/:id" element={<VetDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/vets/add"
          element={
            <ProtectedRoute allowedRoles={['vet', 'admin']}>
              <AddVetPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vets/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['vet', 'admin']}>
              <EditVetPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vets/:clinicId/book"
          element={
            <ProtectedRoute allowedRoles={['petOwner', 'admin']}>
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['petOwner', 'vet', 'admin']}>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:appointmentId/reschedule"
          element={
            <ProtectedRoute allowedRoles={['petOwner', 'admin']}>
              <RescheduleAppointmentPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
