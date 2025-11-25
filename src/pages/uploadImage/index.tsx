import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ImageUploadForm from '../../components/ImageUploadForm';
import HomeButton from '../../components/HomeButton';
import '../../App.css';

const UploadImagePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [initialEventId, setInitialEventId] = useState<string>('');

  useEffect(() => {
    // Get event ID from URL parameters
    const eventId = searchParams.get('eventId');
    if (eventId) {
      setInitialEventId(eventId);
    }
  }, [searchParams]);

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
      <HomeButton />
      <div className="container">
        <header className="App-header">
          <h1>Image Upload System</h1>
          <p>Upload images for events using this form</p>
        </header>
        <main>
          <ImageUploadForm
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            initialEventId={initialEventId}
          />
        </main>
      </div>
    </div>
  );
};

export default UploadImagePage;