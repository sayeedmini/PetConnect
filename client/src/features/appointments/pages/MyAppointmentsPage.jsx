import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  cancelAppointment,
  completeAppointment,
  getMyAppointments,
} from '../services/appointmentApi';
import { getUser } from '../../auth/utils/auth';

function MyAppointmentsPage() {
  const location = useLocation();
  const currentUser = getUser();
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async (status = '') => {
    setLoading(true);

    try {
      const response = await getMyAppointments(status);
      setAppointments(response.data || []);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to fetch appointments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(statusFilter);
  }, [fetchAppointments, statusFilter]);

  useEffect(() => {
    if (location.state?.newAppointment?._id) {
      fetchAppointments(statusFilter);
    }
  }, [fetchAppointments, location.state, statusFilter]);

  const handleCancel = async (id) => {
    const confirmed = window.confirm('Cancel this appointment?');
    if (!confirmed) return;

    try {
      await cancelAppointment(id);
      alert('Appointment cancelled');
      fetchAppointments(statusFilter);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to cancel appointment');
      console.error(error);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeAppointment(id);
      alert('Appointment marked as completed');
      fetchAppointments(statusFilter);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to mark appointment as completed');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={styles.header}>
        <div>
          <h1>My Appointments</h1>
          <p>
            {currentUser?.role === 'vet'
              ? 'Appointments booked for your clinic'
              : 'Appointments you booked as a pet owner'}
          </p>
        </div>

        <div style={styles.headerLinks}>
          <Link to="/vets">Browse Vet Clinics</Link>
        </div>
      </div>

      <div style={styles.filterBar}>
        <label>
          Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div style={styles.list}>
          {appointments.map((appointment) => {
            const canReschedule =
              appointment.status === 'scheduled' && ['petOwner', 'admin'].includes(currentUser?.role);
            const canComplete =
              appointment.status === 'scheduled' && ['vet', 'admin'].includes(currentUser?.role);

            return (
              <div key={appointment._id} style={styles.card}>
                <h3>{appointment.clinic?.clinicName}</h3>
                <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                <p><strong>Time Slot:</strong> {appointment.slotLabel}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
                <p><strong>Pet Name:</strong> {appointment.petName}</p>
                <p><strong>Pet Type:</strong> {appointment.petType || 'Not specified'}</p>
                <p><strong>Reason:</strong> {appointment.reason || 'Not specified'}</p>
                <p><strong>Reminder At:</strong> {appointment.reminderAt ? new Date(appointment.reminderAt).toLocaleString() : 'Not scheduled'}</p>

                {appointment.calendarSync?.addToCalendarUrl && (
                  <p>
                    <a href={appointment.calendarSync.addToCalendarUrl} target="_blank" rel="noreferrer">
                      Add to Google Calendar
                    </a>
                  </p>
                )}

                {appointment.calendarSync?.message && (
                  <p style={styles.calendarInfo}>{appointment.calendarSync.message}</p>
                )}

                <div style={styles.actions}>
                  {canReschedule && (
                    <Link to={`/appointments/${appointment._id}/reschedule`}>Reschedule</Link>
                  )}

                  {appointment.status === 'scheduled' && (
                    <button type="button" onClick={() => handleCancel(appointment._id)}>
                      Cancel
                    </button>
                  )}

                  {canComplete && (
                    <button type="button" onClick={() => handleComplete(appointment._id)}>
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  headerLinks: {
    display: 'flex',
    gap: '12px',
  },
  filterBar: {
    marginBottom: '18px',
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  },
  list: {
    display: 'grid',
    gap: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '14px',
  },
  calendarInfo: {
    color: '#4338ca',
  },
};

export default MyAppointmentsPage;
