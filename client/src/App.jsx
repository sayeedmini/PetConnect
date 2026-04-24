import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmergencyReportPage from "./pages/EmergencyReportPage";
import ReportSuccessPage from "./pages/ReportSuccessPage";
import RescuerDashboardPage from "./pages/RescuerDashboardPage";
import TrackingDashboardPage from "./pages/TrackingDashboardPage";
import RescueInsightsPage from "./pages/RescueInsightsPage";

function DashboardPage() {
  return <h1>Dashboard Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmergencyReportPage />} />
        <Route path="/report-success" element={<ReportSuccessPage />} />
        <Route path="/rescuer-dashboard" element={<RescuerDashboardPage />} />
        <Route path="/tracking" element={<TrackingDashboardPage />} />
        <Route path="/rescue-insights" element={<RescueInsightsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
