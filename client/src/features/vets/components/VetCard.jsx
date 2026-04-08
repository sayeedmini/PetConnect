function VetCard({ vet }) {
  return (
    <div style={styles.card}>
      <h3>{vet.clinicName}</h3>
      <p><strong>Address:</strong> {vet.address}</p>
      <p><strong>Contact:</strong> {vet.contactNumber}</p>
      <p><strong>Working Hours:</strong> {vet.workingHours}</p>
      <p><strong>Consultation Fee:</strong> ৳{vet.consultationFee}</p>
      <p><strong>Rating:</strong> {vet.rating}</p>
      <p><strong>Services:</strong> {vet.servicesOffered?.join(', ')}</p>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '16px',
  },
};

export default VetCard;