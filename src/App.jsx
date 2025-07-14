import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import StakingApp from './pages/StakingApp.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/staking" element={<StakingApp />} />
    </Routes>
  );
}