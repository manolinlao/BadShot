import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShotCard } from '../components/ShotCard';
import { useShots } from '../hooks/useShots';
import type { Shot } from '../domain/shot/types';
import { formatDate } from '../utils/util';
import { getPhotoPreviewUrl } from '../domain/photo';
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
  { value: 'all', label: 'All' },
  { value: 'top-rated', label: '4+ rating' },
  { value: 'with-photo', label: 'With photo' },
  { value: 'with-location', label: 'Has location' },
];

type HomeLocationState = {
  flash?: string;
};

type ShotFiltersControlsProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  quickFilter: ShotQuickFilter;
  setQuickFilter: (value: ShotQuickFilter) => void;
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
  quickFilter,
  setQuickFilter,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  hasActiveFilters,
  onClearFilters,
}: ShotFiltersControlsProps) {
  return (
    <div className="rounded-[28px] border border-[#e2d6ca] bg-gradient-to-br from-white/95 to-[#fff7ef] p-4 shadow-[0_12px_30px_rgba(49,33,20,0.06)] backdrop-blur-sm">
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
        {quickFilters.map((filter) => {
          const active = quickFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setQuickFilter(filter.value)}
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
  const { feed, createdShots, deleteShot, isCreatedShot } = useShots();
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
  const [quickFilter, setQuickFilter] = useState<ShotQuickFilter>('all');
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
    Number(quickFilter !== 'all') +
    Number(hasDateRange);
  const hasActiveFilters = activeFiltersCount > 0;

  const filteredFeed = useMemo(
    () =>
      feed.filter(
        (shot) =>
          matchesShotSearchQuery(shot, searchQuery) &&
          matchesShotQuickFilter(shot, quickFilter) &&
          matchesShotDateRange(shot, dateRange),
      ),
    [feed, quickFilter, searchQuery, dateRange],
  );

  const visibleFeed = filteredFeed.slice(0, visibleShotsCount);
  const canLoadMore = visibleShotsCount < filteredFeed.length;
  const hasResults = filteredFeed.length > 0;
  const feedCount = feed.length;
  const localCount = createdShots.length;
  const shotsWithPhotos = feed.filter((shot) => shot.photoId).length;
  const activeQuickFilterLabel =
    quickFilters.find((filter) => filter.value === quickFilter)?.label ?? 'All';
  const activeEmptyStateLabel = searchQuery
    ? searchQuery
    : quickFilter !== 'all'
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
  }, [dateFrom, dateTo, quickFilter, searchQuery]);

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
    setQuickFilter('all');
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

      <section className="space-y-6">
        <div className="grid gap-4 rounded-[32px] border border-[#e2d6ca] bg-[radial-gradient(circle_at_top_left,#fff4e7_0%,#fffaf5_46%,#f4e9dd_100%)] p-5 shadow-sm lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:p-6">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
              Espresso journal
              <span className="h-1.5 w-1.5 rounded-full bg-[#7a4d2a]" />
              Frontend only
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7a4d2a]">
                Home feed
              </p>
              <h1 className="max-w-xl text-3xl font-black leading-tight text-[#211a16] sm:text-4xl">
                Your espresso shots, laid out like a real product.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[#5f4a3f] sm:text-base">
                Browse the live feed, refine it in a couple of taps, or jump
                straight into creating a new shot when you want to log a cup.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="inline-flex items-center gap-2 rounded-full bg-[#211a16] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2621]"
              >
                Create shot
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#5f4a3f] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                {filtersOpen ? 'Hide filters' : 'Show filters'}
                {hasActiveFilters && (
                  <span className="rounded-full bg-[#211a16] px-2 py-0.5 text-[11px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a4d2a]">
                  Shots in feed
                </p>
                <p className="mt-2 text-3xl font-black text-[#211a16]">
                  {feedCount}
                </p>
                <p className="mt-1 text-sm text-[#5f4a3f]">
                  Mock data plus shots saved in this browser.
                </p>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a4d2a]">
                  Local shots
                </p>
                <p className="mt-2 text-3xl font-black text-[#211a16]">
                  {localCount}
                </p>
                <p className="mt-1 text-sm text-[#5f4a3f]">
                  Created and edited inside this frontend.
                </p>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a4d2a]">
                  With photo
                </p>
                <p className="mt-2 text-3xl font-black text-[#211a16]">
                  {shotsWithPhotos}
                </p>
                <p className="mt-1 text-sm text-[#5f4a3f]">
                  Image-driven shots are easier to scan at a glance.
                </p>
              </div>
            </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="sticky top-16 z-10 sm:top-20">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((current) => !current)}
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
                    quickFilter={quickFilter}
                    setQuickFilter={setQuickFilter}
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
              <div>
                <p className="font-semibold text-[#211a16]">Latest shots</p>
                <p className="mt-1 text-xs leading-5 text-[#6f5b50]">
                  Browse the shots saved in this browser and the local mock
                  feed.
                </p>
              </div>
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a4d2a]">
                  No results
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#211a16]">
                  Nothing matches{' '}
                  <span className="text-[#7a4d2a]">
                    {activeEmptyStateLabel || 'the current filters'}
                  </span>
                  .
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5f4a3f]">
                  Try clearing the filters or create a new shot so the feed has
                  something fresh to show.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 rounded-full border border-[#211a16] bg-[#211a16] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2621]"
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/create')}
                    className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#5f4a3f] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
                  >
                    Create shot
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {canLoadMore && (
              <div className="rounded-[32px] border border-[#eadfd6] bg-gradient-to-r from-white to-[#fff8f1] p-4 shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#211a16]">
                      {visibleFeed.length} shown of {filteredFeed.length}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#6f5b50]">
                      Keep loading to reveal older shots in the feed.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2f2621]"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    Load more
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[32px] border border-[#e2d6ca] bg-[linear-gradient(180deg,#fffaf5_0%,#fff5ea_100%)] p-5 shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
            <div className="inline-flex items-center rounded-full border border-[#e2d6ca] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
              BadShot
            </div>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#211a16]">
              Keep the feed readable, even while it stays local-first.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#4a3a31]">
              This page now gives you a clearer overview of what is in the feed,
              what is stored in the browser and how many shots already include a
              photo.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-[#eadfd6] bg-white/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a4d2a]">
                  Current filter
                </p>
                <p className="mt-2 text-sm font-semibold text-[#211a16]">
                  {hasActiveFilters ? `${activeFiltersCount} active` : 'None'}
                </p>
              </div>
              <div className="rounded-2xl border border-[#eadfd6] bg-white/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a4d2a]">
                  Feed mode
                </p>
                <p className="mt-2 text-sm font-semibold text-[#211a16]">
                  Mixed mock and local shots
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {shotToDelete && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-shot-title"
            className="w-full max-w-sm rounded-lg border border-[#e2d6ca] bg-[#fffaf5] p-5 shadow-xl"
          >
            <h2 id="delete-shot-title" className="text-lg font-black">
              Delete this shot?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5f4a3f]">
              This only deletes the shot saved in this browser.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShotToDelete(null)}
                className="rounded px-4 py-2 text-sm font-bold text-[#5f4a3f] hover:bg-[#efe5dc]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {previewShot?.photoId && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Shot image preview"
          onClick={() => setPreviewShot(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewShot(null)}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="mb-3 rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
              <h2 className="text-lg font-black leading-tight">
                {getShotPreviewTitle(previewShot)}
              </h2>
              <p className="mt-1 text-sm text-white/75">
                {formatDate(previewShot.createdAt)}
              </p>
            </div>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Shot preview"
                className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
