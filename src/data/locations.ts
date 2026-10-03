export interface StateLocationOption {
  state: string;
  cities: string[];
}

/**
 * Current supported states and cities.
 * Structured for easy future expansion (e.g. adding Howrah, Hooghly, or other states).
 */
export const SUPPORTED_LOCATIONS: StateLocationOption[] = [
  {
    state: 'West Bengal',
    cities: ['Kolkata'],
  },
];

export const ALLOWED_STATES = ['West Bengal'] as const;
export const ALLOWED_CITIES = ['Kolkata'] as const;

export type SupportedState = (typeof ALLOWED_STATES)[number];
export type SupportedCity = (typeof ALLOWED_CITIES)[number];

/**
 * Real Gym Facility Location & Coordinates
 * Bhadrakali, Uttarpara, Debaipukur, West Bengal 712232
 */
export const GYM_LOCATION = {
  name: 'CORE X FITNESS',
  landmark: 'Above HDFC Bank, Bireswar Banerjee Street',
  street: 'Debaipukur, Bhadrakali',
  area: 'Uttarpara',
  district: 'Hooghly',
  state: 'West Bengal',
  pincode: '712232',
  fullAddress: 'Bhadrakali, Uttarpara, Debaipukur, West Bengal 712232',
  displayAddress: 'Debaipukur, Bhadrakali, Uttarpara, West Bengal 712232',
  detailedAddress: 'Bireswar Banerjee Street, Above HDFC Bank, Debaipukur, Bhadrakali, Uttarpara, West Bengal 712232',
  coordinates: {
    lat: 22.6869,
    lng: 88.3470,
    formatted: '22.6869° N, 88.3470° E',
  },
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=CORE+X+FITNESS,+Bhadrakali,+Uttarpara,+Debaipukur,+West+Bengal+712232',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=CORE+X+FITNESS,+Bhadrakali,+Uttarpara,+Debaipukur,+West+Bengal+712232',
} as const;

export function isValidLocation(state: string, city: string): boolean {
  if (!state || !city) return false;
  const stateConfig = SUPPORTED_LOCATIONS.find(
    (loc) => loc.state.toLowerCase() === state.trim().toLowerCase()
  );
  if (!stateConfig) return false;
  return stateConfig.cities.some(
    (c) => c.toLowerCase() === city.trim().toLowerCase()
  );
}
