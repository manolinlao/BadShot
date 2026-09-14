import type { ShotLocation } from '../../domain/location/types';

type NominatimReverseResponse = {
  display_name?: string;
  address?: {
    amenity?: string;
    cafe?: string;
    shop?: string;
    restaurant?: string;
    building?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
  };
};

type NominatimSearchResponse = {
  place_id?: number;
  osm_type?: string;
  osm_id?: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimReverseResponse['address'];
};

export type LocationSearchResult = ShotLocation & {
  displayName: string;
  osmType?: string;
  osmId?: number;
};

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<LocationSearchResult[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const params = new URLSearchParams({
    q: trimmedQuery,
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      signal,
      headers: { Accept: 'application/json' },
    },
  );

  if (!response.ok) {
    throw new Error('Unable to search for that place.');
  }

  const results = (await response.json()) as NominatimSearchResponse[];

  return results.flatMap((result) => {
    const lat = Number(result.lat);
    const lng = Number(result.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

    const address = result.address ?? {};
    const name =
      address.amenity ??
      address.cafe ??
      address.shop ??
      address.restaurant ??
      address.building ??
      address.road ??
      result.display_name;
    const city =
      address.city ?? address.town ?? address.village ?? address.municipality;

    return [
      {
        name,
        ...(city ? { city } : {}),
        ...(address.country ? { country: address.country } : {}),
        lat,
        lng,
        displayName: result.display_name,
        ...(result.osm_type ? { osmType: result.osm_type } : {}),
        ...(result.osm_id ? { osmId: result.osm_id } : {}),
      },
    ];
  });
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ShotLocation> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
    addressdetails: '1',
    zoom: '18',
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error('Unable to resolve your location.');
  }

  const result = (await response.json()) as NominatimReverseResponse;
  const address = result.address ?? {};
  const name =
    address.amenity ??
    address.cafe ??
    address.shop ??
    address.restaurant ??
    address.building ??
    address.road ??
    result.display_name ??
    'Current location';
  const city =
    address.city ?? address.town ?? address.village ?? address.municipality;

  return {
    name,
    ...(city ? { city } : {}),
    ...(address.country ? { country: address.country } : {}),
    lat,
    lng,
  };
}
