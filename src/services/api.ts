export interface UploadImageResponse {
  id: number;
  url: string;
  file_name: string;
  file_size: number;
  width: number;
  height: number;
  event_id: number;
}

export interface ApiError {
  detail: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async uploadEventImage(eventId: number, is_primary: boolean, file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/v1/events/${eventId}/images/${is_primary}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  }
}

export const apiService = new ApiService();