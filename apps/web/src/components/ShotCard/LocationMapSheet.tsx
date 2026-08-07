import { X } from 'lucide-react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import type { ShotLocation } from '../../domain/location/types';
import { formatLocation } from '../../domain/location';

interface LocationMapSheetProps {
  location: ShotLocation;
  onClose: () => void;
}

export function LocationMapSheet({
  location,
  onClose,
}: LocationMapSheetProps) {
  if (location.lat === undefined || location.lng === undefined) return null;

  const position: [number, number] = [location.lat, location.lng];
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=18/${location.lat}/${location.lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-0 sm:items-center sm:justify-center sm:p-4">
      <button
        type="button"
        aria-label="Close location map"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-map-title"
        className="relative w-full overflow-hidden rounded-t-[32px] bg-[#fffaf5] shadow-2xl sm:max-w-lg sm:rounded-[32px]"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a4d2a]">
              Shot location
            </p>
            <h2
              id="location-map-title"
              className="mt-1 truncate text-lg font-black text-[#211a16]"
            >
              {formatLocation(location)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location map"
            className="rounded-full border border-[#e2d6ca] bg-white p-2 text-[#7a4d2a] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="h-64 w-full">
          <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker
              center={position}
              radius={10}
              pathOptions={{
                color: '#fffaf5',
                fillColor: '#7a4d2a',
                fillOpacity: 1,
                weight: 4,
              }}
            >
              <Popup>{formatLocation(location)}</Popup>
            </CircleMarker>
          </MapContainer>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <p className="text-xs leading-5 text-[#6f5b50]">
            OpenStreetMap contributors
          </p>
          <a
            href={openStreetMapUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full bg-[#211a16] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2f2621]"
          >
            Open map
          </a>
        </div>
      </section>
    </div>
  );
}
