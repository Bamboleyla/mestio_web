import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main';
import UploadImagePage from './pages/uploadImage';
import CreateEventPage from './pages/createEvent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/upload-image" element={<UploadImagePage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        {/* Add routes for create event and create location when they are ready */}
        <Route path="/create-location" element={<div>Create Location Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
