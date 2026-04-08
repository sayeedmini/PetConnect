import { useEffect, useState } from 'react';
import { getAllVets } from '../services/vetApi';
import VetCard from '../components/VetCard';

function VetListPage() {
  const [vets, setVets] = useState([]);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const data = await getAllVets();
        setVets(data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVets();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1>Vet Clinics</h1>
      {vets.length === 0 ? <p>No vet clinics found.</p> : vets.map((vet) => <VetCard key={vet._id} vet={vet} />)}
    </div>
  );
}

export default VetListPage;