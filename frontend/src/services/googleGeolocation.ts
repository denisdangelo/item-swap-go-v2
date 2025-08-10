import { MAP_CONFIG } from '../config/env';
import type { Location } from '../types';

interface GoogleGeolocationResponse {
  results: Array<{
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
  error_message?: string;
}

export class GoogleGeolocationService {
  private static instance: GoogleGeolocationService;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private isEnabled: boolean;

  private constructor() {
    this.apiKey = MAP_CONFIG.googleMapsApiKey;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    this.isEnabled = !!this.apiKey && this.apiKey.trim() !== '';

    if (!this.isEnabled) {
      console.warn('Google Maps API key not configured. Geolocation service will be disabled.');
    }
  }

  public static getInstance(): GoogleGeolocationService {
    if (!GoogleGeolocationService.instance) {
      GoogleGeolocationService.instance = new GoogleGeolocationService();
    }
    return GoogleGeolocationService.instance;
  }

  private findAddressComponent(
    components: GoogleGeolocationResponse['results'][0]['address_components'],
    types: string[]
  ) {
    return components.find((component) => types.some((type) => component.types.includes(type)));
  }

  async getLocationFromCoordinates(latitude: number, longitude: number): Promise<Location | null> {
    if (!this.isEnabled) {
      console.warn('Google Geolocation service is disabled due to missing API key');
      return null;
    }

    if (!this.apiKey || this.apiKey.trim() === '') {
      console.error('Google Maps API key is empty or not configured');
      this.isEnabled = false;
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?latlng=${latitude},${longitude}&key=${this.apiKey}&language=pt-BR`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_message || `HTTP error! status: ${response.status}`);
      }

      const data: GoogleGeolocationResponse = await response.json();

      if (data.status === 'OVER_QUERY_LIMIT') {
        console.warn('Google Maps API quota exceeded. Using fallback service.');
        return null;
      }

      if (data.status === 'REQUEST_DENIED') {
        console.error('Google Maps API request denied. Check API key restrictions.');
        console.error('Common issues:');
        console.error('- API key is invalid or expired');
        console.error('- API key does not have Geocoding API enabled');
        console.error('- API key has domain restrictions that prevent usage');
        this.isEnabled = false;
        return null;
      }

      if (data.status === 'INVALID_REQUEST') {
        console.error('Invalid request to Google Maps API. Check coordinates format.');
        return null;
      }

      if (data.status !== 'OK' || !data.results.length) {
        throw new Error(`Geocoding failed: ${data.status}`);
      }

      const result = data.results[0];

      return {
        latitude,
        longitude,
        address: result.formatted_address,
      };
    } catch (error) {
      console.error('Error getting location from Google Geocoding API:', error);
      // Se houver erro de quota ou permissão, desabilita o serviço
      if (
        error instanceof Error &&
        (error.message.includes('quota') || error.message.includes('denied'))
      ) {
        this.isEnabled = false;
      }
      return null;
    }
  }

  public isServiceEnabled(): boolean {
    return this.isEnabled;
  }

  public getApiKeyStatus(): { hasKey: boolean; isValid: boolean } {
    return {
      hasKey: !!this.apiKey && this.apiKey.trim() !== '',
      isValid: this.isEnabled,
    };
  }
}
