// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import AdminSetup from './pages/AdminSetup';
import GamePlay from './pages/GamePlay';
import Summary from './pages/Summary';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminSetup />} />
      <Route path="/game" element={<GamePlay />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  );
}

export default App;
