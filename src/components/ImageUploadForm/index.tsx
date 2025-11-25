import React, { useState, useEffect } from 'react';
import { apiService, UploadImageResponse } from '../../services/api';
import './styles.css';

interface ImageUploadFormProps {
  onUploadSuccess?: (response: UploadImageResponse) => void;
  onUploadError?: (error: string) => void;
  initialEventId?: string;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  onUploadSuccess,
  onUploadError,
  initialEventId = '',
}) => {
  const [eventId, setEventId] = useState<string>(initialEventId);
  
  // Update eventId when initialEventId changes (e.g., when passed from URL)
  useEffect(() => {
    if (initialEventId) {
      setEventId(initialEventId);
    }
  }, [initialEventId]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);

  // Validation functions
  const validateEventId = (id: string): boolean => {
    return /^\d+$/.test(id) && parseInt(id) > 0;
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, GIF, and WebP images are allowed';
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');
    setSuccess('');

    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        setPreviewUrl('');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate inputs
    if (!validateEventId(eventId)) {
      setError('Please enter a valid event ID (positive integer)');
      return;
    }

    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Upload file
    setIsUploading(true);
    try {
      const response = await apiService.uploadEventImage(
        parseInt(eventId),
        isPrimary,
        selectedFile
      );
      
      setSuccess(`Image uploaded successfully! ID: ${response.id}`);
      setEventId('');
      setSelectedFile(null);
      setIsPrimary(false);
      setPreviewUrl('');
      
      // Reset file input
      const fileInput = document.getElementById('image-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      onUploadSuccess?.(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-upload-form">
      <h2>Upload Event Image</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Event ID Input */}
        <div className="form-group">
          <label htmlFor="event-id">
            Event ID <span className="required">*</span>
          </label>
          <input
            type="number"
            id="event-id"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="Enter event ID"
            disabled={isUploading || !!initialEventId}
            min="1"
            className={error && !validateEventId(eventId) ? 'error' : ''}
          />
          {error && !validateEventId(eventId) && (
            <span className="error-message">Please enter a valid event ID</span>
          )}
        </div>

        {/* File Input */}
        <div className="form-group">
          <label htmlFor="image-file">
            Image File <span className="required">*</span>
          </label>
          <input
            type="file"
            id="image-file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="file-input"
          />
          {selectedFile && (
            <div className="file-info">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
        </div>

        {/* Primary Image Checkbox */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              id="is-primary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              disabled={isUploading}
            />
            <span className="checkbox-text">Set as primary image</span>
          </label>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="image-preview">
            <h4>Preview:</h4>
            <img
              src={previewUrl}
              alt="Preview"
              className="preview-image"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message-container">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message-container">
            <span className="success-icon">✅</span>
            <span className="success-text">{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !validateEventId(eventId) || !selectedFile}
          className="submit-button"
        >
          {isUploading ? (
            <>
              <span className="spinner"></span>
              Uploading...
            </>
          ) : (
            'Upload Image'
          )}
        </button>
      </form>

      {/* File Type Guidelines */}
      <div className="guidelines">
        <h4>File Guidelines:</h4>
        <ul>
          <li>Supported formats: JPEG, PNG, GIF, WebP</li>
          <li>Maximum file size: 5MB</li>
          <li>Images will be automatically compressed</li>
          <li>All images are converted to JPEG format</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadForm;