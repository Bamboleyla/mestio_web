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

export interface EventCategory {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface EventRequest {
  title: string;
  start_date: string;
  finish_date: string;
  location_id: number;
  category_id: number;
  price: number;
  description: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:8000') {
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

  async createEvent(event: EventRequest): Promise<number> {
    const response = await fetch(`${this.baseUrl}/api/v1/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Create event failed');
    }

    return response.json();
  }

  async getCategories(): Promise<EventCategory[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/events/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Get categories failed');
    }

    return response.json();
  }

  async getLocations(): Promise<Location[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/locations/names`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || 'Get locations failed');
    }

    return response.json();
  }
}

export const apiService = new ApiService();