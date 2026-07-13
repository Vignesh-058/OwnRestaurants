export const USE_DEFAULT_TEST_LOCATION = true;

export const DEFAULT_TEST_LOCATION = {
  coords: {
    latitude: 10.7725,
    longitude: 79.6368,
    accuracy: 100,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};

export const getCurrentPosition = (
  successCallback: PositionCallback,
  errorCallback?: PositionErrorCallback | null,
  options?: PositionOptions
) => {
  if (USE_DEFAULT_TEST_LOCATION) {
    console.log('[TEST MODE] Using default location: Thiruvarur, Tamil Nadu');
    // Simulate async behavior
    setTimeout(() => {
      successCallback(DEFAULT_TEST_LOCATION as GeolocationPosition);
    }, 100);
    return;
  }

  if (!navigator.geolocation) {
    if (errorCallback) {
      errorCallback({
        code: 2,
        message: 'Geolocation is not supported by this browser.',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError);
    }
    return;
  }

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
};
