import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import VetListPage from './features/vets/pages/VetListPage';
import AddVetPage from './features/vets/pages/AddVetPage';

function Home() {
  return (
    <div style={{ padding: '30px' }}>
      <h1>PetConnect</h1>
      <p>Vet Directory Module</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <Link to="/vets">View Vet Clinics</Link>
        <Link to="/vets/add">Add Vet Clinic</Link>
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
        <Route path="/vets/add" element={<AddVetPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;