import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import BookAppointmentPage from './features/appointments/pages/BookAppointmentPage';
import MyAppointmentsPage from './features/appointments/pages/MyAppointmentsPage';
import RescheduleAppointmentPage from './features/appointments/pages/RescheduleAppointmentPage';
import AppointmentPrescriptionPage from './features/prescriptions/pages/AppointmentPrescriptionPage';
import PrescriptionHistoryPage from './features/prescriptions/pages/PrescriptionHistoryPage';
import PrescriptionVerificationPage from './features/prescriptions/pages/PrescriptionVerificationPage';
import AddVetPage from './features/vets/pages/AddVetPage';
import EditVetPage from './features/vets/pages/EditVetPage';
import VetDetailsPage from './features/vets/pages/VetDetailsPage';
import VetListPage from './features/vets/pages/VetListPage';
import GroomerDirectoryPage from './features/groomers/pages/GroomerDirectoryPage';
import GroomerDetailPage from './features/groomers/pages/GroomerDetailPage';
import GroomingBookingPage from './features/groomers/pages/BookingForm';
import GroomingLiveTrackingPage from './features/groomers/pages/LiveTrackingPage';
import SubscriptionHubPage from './features/groomers/pages/SubscriptionHubPage';
import EmergencyReportPage from './features/rescue/pages/EmergencyReportPage';
import ReportSuccessPage from './features/rescue/pages/ReportSuccessPage';
import RescuerDashboardPage from './features/rescue/pages/RescuerDashboardPage';
import TrackingDashboardPage from './features/rescue/pages/TrackingDashboardPage';
import RescueInsightsPage from './features/rescue/pages/RescueInsightsPage';
import CatalogPage from './features/catalog/pages/CatalogPage';

function withLayout(page) {
  return <SiteLayout>{page}</SiteLayout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/prescriptions/verify/:verificationCode"
          element={<PrescriptionVerificationPage />}
        />

        {/* All routes below require login */}
        <Route path="/" element={<ProtectedRoute><SiteLayout><CatalogPage /></SiteLayout></ProtectedRoute>} />
        <Route path="/catalog" element={<ProtectedRoute><SiteLayout><CatalogPage /></SiteLayout></ProtectedRoute>} />
        <Route path="/vets" element={<ProtectedRoute><VetListPage /></ProtectedRoute>} />
        <Route path="/vets/:id" element={<ProtectedRoute><VetDetailsPage /></ProtectedRoute>} />
        <Route path="/groomers" element={<ProtectedRoute>{withLayout(<GroomerDirectoryPage />)}</ProtectedRoute>} />
        <Route path="/groomers/:id" element={<ProtectedRoute>{withLayout(<GroomerDetailPage />)}</ProtectedRoute>} />
        <Route path="/groomers/:groomerId/book" element={<ProtectedRoute>{withLayout(<GroomingBookingPage />)}</ProtectedRoute>} />
        <Route path="/grooming/track/:bookingId" element={<ProtectedRoute>{withLayout(<GroomingLiveTrackingPage />)}</ProtectedRoute>} />
        <Route path="/grooming/subscriptions" element={<ProtectedRoute>{withLayout(<SubscriptionHubPage />)}</ProtectedRoute>} />
        <Route path="/subscriptions" element={<ProtectedRoute>{withLayout(<SubscriptionHubPage />)}</ProtectedRoute>} />
        <Route path="/rescue/report" element={<ProtectedRoute><EmergencyReportPage /></ProtectedRoute>} />
        <Route path="/rescue/report-success" element={<ProtectedRoute><ReportSuccessPage /></ProtectedRoute>} />
        <Route
  path="/rescue/dashboard"
  element={
    <ProtectedRoute allowedRoles={['rescuer']}>
      <RescuerDashboardPage />
    </ProtectedRoute>
  }
/>
        <Route path="/rescue/tracking" element={<TrackingDashboardPage />} />
        <Route path="/rescue/insights" element={<RescueInsightsPage />} />
        <Route
          path="/vets/add"
          element={
            <ProtectedRoute allowedRoles={['vet']}>
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
            <ProtectedRoute allowedRoles={['petOwner', 'admin', 'rescuer']}>
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['petOwner', 'vet', 'admin', 'rescuer']}>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:appointmentId/reschedule"
          element={
            <ProtectedRoute allowedRoles={['petOwner', 'admin', 'rescuer']}>
              <RescheduleAppointmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:appointmentId/prescription"
          element={
            <ProtectedRoute allowedRoles={['petOwner', 'vet', 'admin', 'rescuer']}>
              <AppointmentPrescriptionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute allowedRoles={['petOwner', 'vet', 'admin', 'rescuer']}>
              <PrescriptionHistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
