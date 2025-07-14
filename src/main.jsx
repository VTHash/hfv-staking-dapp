import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './home.jsx';
import StakingApp from './StakingApp.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staking" element={<StakingApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);