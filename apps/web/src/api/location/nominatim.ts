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
