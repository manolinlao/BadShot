import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShotCard } from '../components/ShotCard';
import { useShots } from '../hooks/useShots';
import type { Shot } from '../domain/shot/types';
import { formatDate } from '../utils/util';
import { getPhotoPreviewUrl } from '../domain/photo';
import { ratingIcon, ratingOptions, type Rating } from '../domain/coffee';
import {
  getShotPreviewTitle,
  matchesShotDateRange,
  matchesShotQuickFilter,
  matchesShotSearchQuery,
  type ShotDateRange,
  type ShotQuickFilter,
} from '../domain/shot';

const INITIAL_VISIBLE_SHOTS = 10;
const LOAD_MORE_STEP = 10;
const quickFilters: Array<{ value: ShotQuickFilter; label: string }> = [
  { value: 'with-photo', label: 'With photo' },
  { value: 'with-location', label: 'Has location' },
];

type HomeLocationState = {
  flash?: string;
};

type ShotFiltersControlsProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  quickFiltersSelected: ShotQuickFilter[];
  setQuickFiltersSelected: (value: ShotQuickFilter[]) => void;
  selectedRatings: Rating[];
  setSelectedRatings: (value: Rating[]) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

function ShotFiltersControls({
  searchQuery,
  setSearchQuery,
  quickFiltersSelected,
  setQuickFiltersSelected,
  selectedRatings,
  setSelectedRatings,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  hasActiveFilters,
  onClearFilters,
}: ShotFiltersControlsProps) {
  return (
    <div
      id="feed-filters"
      className="rounded-[28px] border border-[#e2d6ca] bg-gradient-to-br from-white/95 to-[#fff7ef] p-4 shadow-[0_12px_30px_rgba(49,33,20,0.06)] backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center rounded-full border border-[#e2d6ca] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
            Search & refine
          </div>
          <p className="mt-2 text-sm text-[#5f4a3f]">
            Narrow the feed without losing the overview.
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#211a16] bg-[#211a16] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#2f2621]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setQuickFiltersSelected([]);
            setSelectedRatings([]);
          }}
          className={[
            'rounded-full border px-3 py-1.5 text-sm font-semibold transition',
            quickFiltersSelected.length === 0 && selectedRatings.length === 0
              ? 'border-[#211a16] bg-[#211a16] text-white'
              : 'border-[#e2d6ca] bg-white text-[#5f4a3f] hover:border-[#7a4d2a] hover:text-[#211a16]',
          ].join(' ')}
        >
          All
        </button>

        {quickFilters.map((filter) => {
          const active = quickFiltersSelected.includes(filter.value);

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                setQuickFiltersSelected(
                  active
                    ? quickFiltersSelected.filter((value) => value !== filter.value)
                    : [...quickFiltersSelected, filter.value],
                )
              }
              className={[
                'rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                active
                  ? 'border-[#211a16] bg-[#211a16] text-white'
                  : 'border-[#e2d6ca] bg-white text-[#5f4a3f] hover:border-[#7a4d2a] hover:text-[#211a16]',
              ].join(' ')}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a4d2a]">
          Rating
        </span>
        {ratingOptions.map((option) => {
          const active = selectedRatings.includes(option.value);
          const Icon = ratingIcon[option.value].icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setSelectedRatings(
                  active
                    ? selectedRatings.filter((rating) => rating !== option.value)
                    : [...selectedRatings, option.value],
                )
              }
              aria-label={`Filter by rating ${option.value}`}
              title={`Rating ${option.value}`}
              className={[
                'inline-flex h-9 w-9 items-center justify-center rounded-full border transition',
                active
                  ? 'border-[#211a16] bg-[#211a16] text-white'
                  : 'border-[#e2d6ca] bg-white text-[#5f4a3f] hover:border-[#7a4d2a] hover:text-[#211a16]',
              ].join(' ')}
            >
              <Icon
                className={`h-4 w-4 ${active ? 'text-white' : ratingIcon[option.value].color}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#7a4d2a]">
          Search shots
        </span>
        <div className="flex items-center gap-2 rounded-2xl border border-[#e2d6ca] bg-[#fffaf5] px-3 py-3">
          <Search
            className="h-4 w-4 shrink-0 text-[#7a4d2a]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by coffee, location, roaster or notes"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#9b8b7e]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="rounded p-1 text-[#7a4d2a] transition hover:bg-[#f3ebe3] hover:text-[#211a16]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-[#7a4d2a]">
            From
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className="w-full rounded-2xl border border-[#e2d6ca] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#211a16]"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-[#7a4d2a]">
            To
          </span>
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className="w-full rounded-2xl border border-[#e2d6ca] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#211a16]"
          />
        </label>
      </div>
    </div>
  );
}

export function Home() {
  const { feed, deleteShot, isCreatedShot } = useShots();
  const location = useLocation();
  const navigate = useNavigate();
  const flash = (location.state as HomeLocationState | null)?.flash;
  const [visibleFlash, setVisibleFlash] = useState(flash);
  const [shotToDelete, setShotToDelete] = useState<Shot | null>(null);
  const [previewShot, setPreviewShot] = useState<Shot | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [visibleShotsCount, setVisibleShotsCount] = useState(
    INITIAL_VISIBLE_SHOTS,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFiltersSelected, setQuickFiltersSelected] = useState<
    ShotQuickFilter[]
  >([]);
  const [selectedRatings, setSelectedRatings] = useState<Rating[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const dateRange: ShotDateRange = {
    from: dateFrom || undefined,
    to: dateTo || undefined,
  };
  const hasDateRange = Boolean(dateFrom || dateTo);
  const activeFiltersCount =
    Number(Boolean(searchQuery)) +
    quickFiltersSelected.length +
    Number(selectedRatings.length > 0) +
    Number(hasDateRange);
  const hasActiveFilters = activeFiltersCount > 0;

  const filteredFeed = useMemo(
    () =>
      feed.filter(
        (shot) =>
          matchesShotSearchQuery(shot, searchQuery) &&
          matchesShotQuickFilter(shot, quickFiltersSelected, selectedRatings) &&
          matchesShotDateRange(shot, dateRange),
      ),
    [feed, quickFiltersSelected, searchQuery, dateRange, selectedRatings],
  );

  const visibleFeed = filteredFeed.slice(0, visibleShotsCount);
  const canLoadMore = visibleShotsCount < filteredFeed.length;
  const hasResults = filteredFeed.length > 0;
  const activeQuickFilterLabel =
    selectedRatings.length > 0
      ? `${selectedRatings.length} ratings`
      : quickFiltersSelected.length === 0
        ? 'All'
      : quickFiltersSelected.length === 1
        ? quickFilters.find(
            (filter) => filter.value === quickFiltersSelected[0],
          )?.label ?? 'selected filters'
          : `${quickFiltersSelected.length} filters`;
  const activeEmptyStateLabel = searchQuery
    ? searchQuery
    : selectedRatings.length > 0 || quickFiltersSelected.length > 0
      ? activeQuickFilterLabel
      : hasDateRange
        ? 'selected dates'
        : '';

  useEffect(() => {
    if (!flash) return;

    navigate('.', { replace: true, state: null });
  }, [flash, navigate]);

  useEffect(() => {
    if (!visibleFlash) return;

    const timeoutId = window.setTimeout(() => {
      setVisibleFlash(undefined);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [visibleFlash]);

  useEffect(() => {
    if (!previewShot) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewShot(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewShot]);

  useEffect(() => {
    if (!previewShot?.photoId) {
      setPreviewUrl(undefined);
      return;
    }

    const loadPreview = async () => {
      const url = await getPhotoPreviewUrl(previewShot.photoId, false);
      setPreviewUrl(url);
    };

    void loadPreview();
  }, [previewShot]);

  useEffect(() => {
    setVisibleShotsCount((currentVisibleShots) =>
      Math.min(
        currentVisibleShots,
        Math.max(feed.length, INITIAL_VISIBLE_SHOTS),
      ),
    );
  }, [feed.length]);

  useEffect(() => {
    setVisibleShotsCount(INITIAL_VISIBLE_SHOTS);
  }, [dateFrom, dateTo, quickFiltersSelected, searchQuery, selectedRatings]);

  const handleConfirmDelete = () => {
    if (!shotToDelete) return;

    deleteShot(shotToDelete);
    setShotToDelete(null);
    setVisibleFlash('Shot deleted');
  };

  const handleLoadMore = () => {
    setVisibleShotsCount(
      (currentVisibleShots) => currentVisibleShots + LOAD_MORE_STEP,
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setQuickFiltersSelected([]);
    setSelectedRatings([]);
    setDateFrom('');
    setDateTo('');
    setFiltersOpen(false);
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);

    if (value && !dateTo) {
      setDateTo(value);
      return;
    }

    if (!value && dateTo === dateFrom) {
      setDateTo('');
    }
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);

    if (value && !dateFrom) {
      setDateFrom(value);
      return;
    }

    if (!value && dateFrom === dateTo) {
      setDateFrom('');
    }
  };

  return (
    <>
      {visibleFlash && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-20 mx-auto max-w-sm rounded-lg border border-[#d7c5b4] bg-[#211a16] px-4 py-3 text-center text-sm font-bold text-white shadow-lg sm:bottom-6"
        >
          {visibleFlash}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-[24px] border border-[#e2d6ca] bg-white/75 px-4 py-3 shadow-[0_10px_24px_rgba(49,33,20,0.04)] backdrop-blur-sm">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#211a16_0%,#5f4a3f_100%)] text-sm font-black text-white shadow-sm">
              B
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#211a16]">
                BadShot
              </p>
              <p className="truncate text-xs font-medium text-[#7a4d2a]">
                Local espresso journal
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-[#e2d6ca] bg-[#fbf6ef] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a4d2a]">
            Feed
          </span>
        </div>

        <div className="grid gap-6">
          <div className="space-y-4">
            <div className="sticky top-16 z-10 sm:top-20">
              <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen((current) => !current)}
                aria-expanded={filtersOpen}
                aria-controls="feed-filters"
                className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white px-3 py-2 text-sm font-semibold text-[#5f4a3f] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
              >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  {filtersOpen ? 'Hide filters' : 'Show filters'}
                  {hasActiveFilters && (
                    <span className="ml-1 rounded-full bg-[#211a16] px-2 py-0.5 text-[11px] font-bold text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {filtersOpen && (
                <div className="mt-3">
                  <ShotFiltersControls
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    quickFiltersSelected={quickFiltersSelected}
                    setQuickFiltersSelected={setQuickFiltersSelected}
                    selectedRatings={selectedRatings}
                    setSelectedRatings={setSelectedRatings}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    onDateFromChange={handleDateFromChange}
                    onDateToChange={handleDateToChange}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 text-sm text-[#6f5b50]">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
                Feed
              </p>
              <p className="shrink-0 rounded-full border border-[#e2d6ca] bg-white px-3 py-1 text-xs font-semibold text-[#7a4d2a]">
                Showing {visibleFeed.length} of {filteredFeed.length}
              </p>
            </div>

            {hasResults ? (
              <div className="rounded-[32px] border border-[#eadfd6] bg-white/55 p-3 shadow-[0_12px_30px_rgba(49,33,20,0.04)] sm:p-4">
                <div className="space-y-5">
                  {visibleFeed.map((shot) => (
                    <ShotCard
                      key={shot.id}
                      shot={shot}
                      onEdit={
                        isCreatedShot(shot.id)
                          ? () => navigate(`/edit/${shot.id}`)
                          : undefined
                      }
                      onDelete={
                        isCreatedShot(shot.id)
                          ? () => setShotToDelete(shot)
                          : undefined
                      }
                      onImageClick={
                        shot.photoId ? () => setPreviewShot(shot) : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[32px] border border-dashed border-[#e2d6ca] bg-gradient-to-br from-white to-[#fff8f1] px-5 py-8 text-center shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
                <h2 className="text-2xl font-black text-[#211a16]">
                  {hasActiveFilters
                    ? `Nothing matches ${activeEmptyStateLabel || 'the current filters'}.`
                    : 'Your feed is empty.'}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5f4a3f]">
                  {hasActiveFilters
                    ? 'Try clearing the filters to bring the feed back.'
                    : 'Create your first shot to start filling the feed.'}
                </p>

                <div className="mt-5 flex justify-center">
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-2 rounded-full border border-[#211a16] bg-[#211a16] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2621]"
                    >
                      Clear filters
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/create')}
                      className="inline-flex items-center gap-2 rounded-full bg-[#211a16] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2621]"
                    >
                      Create shot
                    </button>
                  )}
                </div>
              </div>
            )}

            {canLoadMore && (
              <div className="rounded-[32px] border border-[#eadfd6] bg-gradient-to-r from-white to-[#fff8f1] p-4 text-center shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2f2621]"
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  Load more
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {shotToDelete && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-shot-title"
            aria-describedby="delete-shot-description"
            className="w-full max-w-sm rounded-lg border border-[#e2d6ca] bg-[#fffaf5] p-5 shadow-xl"
          >
            <h2 id="delete-shot-title" className="text-lg font-black">
              Delete this shot?
            </h2>
            <p
              id="delete-shot-description"
              className="mt-2 text-sm leading-6 text-[#5f4a3f]"
            >
              {getShotPreviewTitle(shotToDelete)} will be removed from this
              browser only.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShotToDelete(null)}
                className="rounded-full px-4 py-2 text-sm font-bold text-[#5f4a3f] hover:bg-[#efe5dc]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {previewShot?.photoId && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/80 px-3 py-3 sm:items-center sm:px-4 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Shot image preview"
          onClick={() => setPreviewShot(null)}
        >
          <div
            className="relative w-full max-w-4xl pt-10 sm:pt-0"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewShot(null)}
              className="absolute right-1 top-1 z-10 rounded-full bg-black/60 p-2.5 text-white transition hover:bg-black sm:right-2 sm:top-2 sm:p-2"
              aria-label="Close image preview"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>

            <div className="mb-3 rounded-2xl bg-white/10 px-3 py-3 text-white backdrop-blur-sm sm:px-4">
              <h2 className="text-base font-black leading-tight sm:text-lg">
                {getShotPreviewTitle(previewShot)}
              </h2>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                {formatDate(previewShot.createdAt)}
              </p>
            </div>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Shot preview"
                className="max-h-[72vh] w-full rounded-2xl object-contain shadow-2xl sm:max-h-[85vh]"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
