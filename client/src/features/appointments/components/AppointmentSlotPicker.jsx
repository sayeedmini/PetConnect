function AppointmentSlotPicker({ slots = [], selectedStartTime, onSelect, loading }) {
  if (loading) {
    return <p>Loading available slots...</p>;
  }

  if (slots.length === 0) {
    return <p>No slots available for this date.</p>;
  }

  return (
    <div style={styles.grid}>
      {slots.map((slot) => {
        const isActive = selectedStartTime === slot.startTime;

        return (
          <button
            key={slot.startTime}
            type="button"
            onClick={() => onSelect(slot)}
            style={{
              ...styles.slot,
              ...(isActive ? styles.activeSlot : {}),
            }}
          >
            {slot.label}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '10px',
  },
  slot: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  activeSlot: {
    background: '#dbeafe',
    borderColor: '#2563eb',
  },
};

export default AppointmentSlotPicker;
