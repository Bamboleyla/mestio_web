import React from 'react';
import ImageUploadForm from './components/ImageUploadForm';
import './App.css';

function App() {
  const handleUploadSuccess = (response: any) => {
    console.log('Upload successful:', response);
    // You can add additional logic here, such as updating a list of uploaded images
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
    // You can add additional error handling logic here
  };

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>Image Upload System</h1>
          <p>Upload images for events using this form</p>
        </header>
        <main>
          <ImageUploadForm
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
