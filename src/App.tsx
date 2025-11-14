import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main';
import UploadImagePage from './pages/uploadImage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/upload-image" element={<UploadImagePage />} />
        {/* Add routes for create event and create location when they are ready */}
        <Route path="/create-event" element={<div>Create Event Page</div>} />
        <Route path="/create-location" element={<div>Create Location Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
