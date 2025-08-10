import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { geolocationService } from '@/services/geolocation';

describe('GeolocationService', () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  };

  beforeEach(() => {
    // Mock do objeto navigator.geolocation
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });

    // Mock do fetch para geocoding
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle geolocation not supported', async () => {
    // Simula navegador sem suporte a geolocalização
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    const location = await geolocationService.getCurrentLocation();
    expect(location).toBeNull();
  });

  it('should get current location successfully', async () => {
    const mockPosition = {
      coords: {
        latitude: -23.550520,
        longitude: -46.633308,
        accuracy: 10,
      },
    };

    const mockGeocodingResponse = {
      display_name: 'São Paulo, SP, Brasil',
      address: {
        city: 'São Paulo',
        state: 'São Paulo',
      },
    };

    // Mock das chamadas
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockGeocodingResponse),
    });

    const location = await geolocationService.getCurrentLocation();

    expect(location).toEqual({
      coordinates: {
        latitude: mockPosition.coords.latitude,
        longitude: mockPosition.coords.longitude,
      },
      address: mockGeocodingResponse.display_name,
      city: mockGeocodingResponse.address.city,
      state: mockGeocodingResponse.address.state,
    });
  });

  it('should handle geolocation permission denied', async () => {
    const mockError = new Error('User denied geolocation');
    mockError.name = 'GeolocationPositionError';
    (mockError as any).code = 1;

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError);
    });

    const location = await geolocationService.getCurrentLocation();
    expect(location).toBeNull();
  });

  it('should calculate distance correctly', () => {
    // São Paulo para Rio de Janeiro
    const distance = geolocationService.calculateDistance(
      -23.550520, // São Paulo
      -46.633308,
      -22.906847, // Rio de Janeiro
      -43.172897
    );

    // A distância real é aproximadamente 358km
    expect(distance).toBeGreaterThan(350);
    expect(distance).toBeLessThan(370);
  });

  it('should start and stop location watch', () => {
    const mockCallback = vi.fn();
    const mockWatchId = 123;

    mockGeolocation.watchPosition.mockReturnValue(mockWatchId);

    geolocationService.startLocationWatch(mockCallback);
    expect(mockGeolocation.watchPosition).toHaveBeenCalled();

    geolocationService.stopLocationWatch();
    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(mockWatchId);
  });
});
