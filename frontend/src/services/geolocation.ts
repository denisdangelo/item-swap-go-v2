import { toast } from '@/components/ui/use-toast';

import { GoogleGeolocationService } from './googleGeolocation';

import type { Location as AppLocation } from '@/types';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationLocation {
  coordinates: Coordinates;
  address?: string;
  city?: string;
  state?: string;
  timestamp?: number;
}

class GeolocationService {
  private static instance: GeolocationService;
  private currentLocation: AppLocation | null = null;
  private watchId: number | null = null;
  private locationCache: Map<string, AppLocation> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hora
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 segundo
  private googleService: GoogleGeolocationService;
  private readonly CACHE_KEY = 'user_location_cache';

  private constructor() {
    this.googleService = GoogleGeolocationService.getInstance();
    // Tenta recuperar localização do localStorage
    try {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        const location = JSON.parse(savedLocation) as AppLocation;
        this.currentLocation = location;
      }
    } catch (error) {
      console.warn('Erro ao recuperar localização do cache:', error);
    }
  }

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  private saveLocationToCache(location: AppLocation): void {
    try {
      localStorage.setItem('userLocation', JSON.stringify(location));
      this.currentLocation = location;
    } catch (error) {
      console.warn('Erro ao salvar localização no cache:', error);
    }
  }

  async getCurrentLocation(): Promise<AppLocation | null> {
    try {
      // Tenta obter a localização do cache primeiro
      const cachedLocation = this.getCachedLocation();
      if (cachedLocation) {
        return cachedLocation;
      }

      // Se não houver cache, solicita a localização atual
      const position = await this.getPosition();
      const location: AppLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: '',
      };

      // Tenta obter o endereço usando o serviço do Google
      try {
        // Verifica se o serviço do Google está habilitado
        if (this.googleService.isServiceEnabled()) {
        const googleLocation = await this.googleService.getLocationFromCoordinates(
          location.latitude,
          location.longitude
        );
        if (googleLocation) {
          location.address = googleLocation.address;
          }
        } else {
          console.warn('Serviço do Google Maps não está disponível. Usando apenas coordenadas.');
        }
      } catch (error) {
        console.warn('Erro ao obter endereço do Google Maps:', error);
        // Continua sem o endereço, mas com as coordenadas
      }

      // Salva no cache
      this.saveLocationToCache(location);
      return location;
    } catch (error) {
      const geolocationError = error as GeolocationPositionError;
      let errorMessage = 'Erro ao obter localização';

      switch (geolocationError.code) {
        case 1:
          errorMessage = 'Permissão de localização negada';
          break;
        case 2:
          errorMessage = 'Localização indisponível';
          break;
        case 3:
          errorMessage = 'Tempo limite excedido';
          break;
      }

      toast({
        title: 'Erro de localização',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    }
  }

  private getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  }

  private getCachedLocation(): AppLocation | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const { location, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      return location;
    } catch (error) {
      console.warn('Erro ao recuperar localização do cache:', error);
      return null;
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  getCurrentLocationData(): AppLocation | null {
    return this.currentLocation;
  }

  // Verifica se o serviço do Google Maps está disponível
  isGoogleMapsAvailable(): boolean {
    return this.googleService.isServiceEnabled();
  }

  // Obtém o status da API do Google Maps
  getGoogleMapsStatus(): { hasKey: boolean; isValid: boolean } {
    return this.googleService.getApiKeyStatus();
  }

  // Limpa o cache de localização
  clearLocationCache(): void {
    this.currentLocation = null;
    this.locationCache.clear();
    localStorage.removeItem('userLocation');
    localStorage.removeItem(this.CACHE_KEY);
  }

  // Para de monitorar a localização
  stopLocationWatch(): void {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Inicia o monitoramento da localização
  public startLocationWatch(callback: (location: AppLocation) => void): void {
    if (!navigator.geolocation) {
      console.warn('Geolocalização não suportada');
      return;
    }

    this.stopLocationWatch();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: AppLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: '',
        };

        // Tenta obter o endereço apenas se o serviço do Google estiver disponível
        if (this.googleService.isServiceEnabled()) {
        this.googleService
          .getLocationFromCoordinates(location.latitude, location.longitude)
          .then((googleLocation) => {
            if (googleLocation) {
              location.address = googleLocation.address;
            }
            callback(location);
          })
            .catch((error) => {
              console.warn('Erro ao obter endereço durante monitoramento:', error);
            callback(location);
          });
        } else {
          // Se o Google Maps não estiver disponível, usa apenas as coordenadas
          callback(location);
        }
      },
      (error) => {
        console.error('Erro no monitoramento de localização:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }
}

export const geolocationService = GeolocationService.getInstance();
