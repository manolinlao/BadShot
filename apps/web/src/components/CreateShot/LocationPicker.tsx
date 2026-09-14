import { MapPin, Search, X } from 'lucide-react';
import type { LocationSearchResult } from '../../api/location/nominatim';

interface LocationPickerProps {
  name: string;
  setName: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchResults: LocationSearchResult[];
  searching: boolean;
  onSearch: () => void;
  onSelectSearchResult: (result: LocationSearchResult) => void;
  hasCoordinates: boolean;
  locating: boolean;
  locationError: string;
  onClear: () => void;
  onUseCurrentLocation: () => void;
}

export function LocationPicker({
  name,
  setName,
  city,
  setCity,
  country,
  setCountry,
  searchQuery,
  setSearchQuery,
  searchResults,
  searching,
  onSearch,
  onSelectSearchResult,
  hasCoordinates,
  locating,
  locationError,
  onClear,
  onUseCurrentLocation,
}: LocationPickerProps) {
  return (
    <section className="space-y-3 rounded-[28px] border border-[#e2d6ca] bg-white p-4 shadow-[0_12px_24px_rgba(49,33,20,0.04)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#7a4d2a] text-white shadow-sm">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7a4d2a]">
            2. Location
          </p>
          <p className="mt-1 text-sm leading-6 text-[#5f4a3f]">
            Add the place in the fewest words that make sense.
          </p>
        </div>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); onSearch(); }} className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f5b50]">
          Search a place or address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            placeholder="Café, street or address"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-[#e2d6ca] px-3 py-3 text-base outline-none transition focus:border-[#211a16]"
          />
          <button
            type="submit"
            disabled={searching || searchQuery.trim().length < 3}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#211a16] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4b382d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {searching ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {searchResults.length > 0 && (
        <div className="space-y-2" aria-label="Search results">
          {searchResults.map((result) => (
            <button
              key={`${result.osmType ?? 'place'}-${result.osmId ?? result.displayName}`}
              type="button"
              onClick={() => onSelectSearchResult(result)}
              className="block w-full rounded-xl border border-[#e2d6ca] bg-[#fffaf5] px-3 py-3 text-left transition hover:border-[#7a4d2a] hover:bg-[#f3ebe3]"
            >
              <span className="block text-sm font-semibold text-[#211a16]">
                {result.name}
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#6f5b50]">
                {result.displayName}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <input
          placeholder="Local name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-[#e2d6ca] px-3 py-3 text-base outline-none transition focus:border-[#211a16]"
        />
        <input
          placeholder="City"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="w-full rounded-xl border border-[#e2d6ca] px-3 py-3 text-base outline-none transition focus:border-[#211a16]"
        />
      </div>

      <button
        type="button"
        onClick={onUseCurrentLocation}
        disabled={locating}
        className="inline-flex items-center gap-2 rounded-full border border-[#7a4d2a] bg-[#fff8f1] px-4 py-2.5 text-sm font-semibold text-[#7a4d2a] transition hover:bg-[#f3ebe3] disabled:cursor-wait disabled:opacity-60"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        {locating ? 'Finding your location…' : 'Use my current location'}
      </button>

      {(name || city || country || hasCoordinates) && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#6f5b50] transition hover:bg-[#f3ebe3] hover:text-[#211a16]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Clear location
        </button>
      )}

      {hasCoordinates && !locationError && (
        <p className="text-xs font-semibold text-[#5f7a55]">
          Location added from your device.
        </p>
      )}

      {locationError && (
        <p role="alert" className="text-xs font-semibold text-[#a24d3e]">
          {locationError}
        </p>
      )}

      <p className="text-[11px] leading-5 text-[#8a6f5d]">
        Location data by OpenStreetMap contributors.
      </p>

      <input
        placeholder="Country"
        value={country}
        onChange={(event) => setCountry(event.target.value)}
        className="w-full rounded-xl border border-[#e2d6ca] px-3 py-3 text-base outline-none transition focus:border-[#211a16]"
      />
    </section>
  );
}
