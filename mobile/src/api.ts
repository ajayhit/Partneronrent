import { Platform } from 'react-native';

const defaultApiBase =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'web' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api');
const apiBase = defaultApiBase.replace(/\/+$/, '');

export type Service = {
  id: string;
  name: string;
  tagline: string;
  basePrice: number;
  category: string;
};

function isService(value: unknown): value is Service {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'tagline' in value &&
    typeof value.tagline === 'string' &&
    'basePrice' in value &&
    typeof value.basePrice === 'number' &&
    'category' in value &&
    typeof value.category === 'string'
  );
}

export async function fetchServices(): Promise<Service[]> {
  let response: Response;

  try {
    response = await fetch(`${apiBase}/services`);
  } catch {
    throw new Error(
      `Could not reach ${apiBase}. Check that the API server is running and the API URL is correct.`,
    );
  }

  if (!response.ok) {
    throw new Error(`The API returned HTTP ${response.status} while loading experiences.`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('The services endpoint returned an unexpected response.');
  }

  return data.map((service: unknown) => {
    if (!isService(service)) {
      throw new Error('The services endpoint returned an unexpected response.');
    }
    return service;
  });
}
