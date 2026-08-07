import {
  FileText,
  Heart,
  ImageOff,
  MapPin,
  MessageCircle,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Shot } from '../../domain/shot/types';
import { formatDate } from '../../utils/util';
import { formatLocation } from '../../domain/location';
import {
  isRating,
  ratingIcon,
  ratingLabel,
  RoastLevelLabel,
} from '../../domain/coffee';
import { getCoffeeTitle, hasCoffeeMeta } from '../../domain/shot';
import { getRecipeRatio, hasRecipeStats } from '../../domain/recipe';
import { RecipeStat } from './RecipeStat';
import {
  getAvatarInitial,
  getDisplayName,
  getUserName,
} from '../../domain/user';
import { usePhoto } from '../../hooks/usePhoto';
import { useState } from 'react';
import { LocationMapSheet } from './LocationMapSheet';

interface ShotCardProps {
  shot: Shot;
  onEdit?: () => void;
  onDelete?: () => void;
  onImageClick?: () => void;
}

export const ShotCard: React.FC<ShotCardProps> = ({
  shot,
  onEdit,
  onDelete,
  onImageClick,
}) => {
  const [mapOpen, setMapOpen] = useState(false);
  const photoUrl = usePhoto(shot.photoId);

  const recipe = shot.recipe;
  const ratio = getRecipeRatio(recipe);
  const showRecipeStats = hasRecipeStats(recipe);
  const locationLabel = formatLocation(shot.location);
  const hasLocation = Boolean(locationLabel);

  const likes = shot.likesCount ?? 0;
  const comments = shot.commentsCount ?? 0;
  const rating = isRating(shot.rating) ? shot.rating : null;
  const RatingIcon = rating ? ratingIcon[rating].icon : null;
  const displayName = getDisplayName(shot.user);
  const username = getUserName(shot.user);
  const avatarInitial = getAvatarInitial(shot.user);

  const coffeeTitle = getCoffeeTitle(shot.coffee);
  const hasCoffeeInformation = hasCoffeeMeta(shot.coffee);

  const hasFooter = Boolean(
    rating || likes > 0 || comments > 0 || onEdit || onDelete,
  );

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#e2d6ca] bg-[#fffaf5] shadow-[0_12px_30px_rgba(49,33,20,0.06)] transition-shadow duration-200 hover:shadow-[0_16px_36px_rgba(49,33,20,0.1)]">
      <header className="flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {shot.user.avatarUrl ? (
            <img
              src={shot.user.avatarUrl}
              alt={`${displayName} avatar`}
              loading="lazy"
              decoding="async"
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div
              aria-label={`${displayName} avatar`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#211a16] text-sm font-black text-white ring-2 ring-white"
            >
              {avatarInitial}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-[#211a16]">
              {displayName}
            </h2>
            {username && (
              <p className="truncate text-xs text-[#6f5b50]">@{username}</p>
            )}
            <p className="mt-1 truncate text-sm font-black text-[#211a16]">
              {coffeeTitle}
            </p>
          </div>
        </div>

        <time className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a4d2a] sm:text-xs sm:tracking-widest">
          {formatDate(shot.createdAt)}
        </time>
      </header>

      {photoUrl ? (
        <button
          type="button"
          onClick={onImageClick}
          className="group relative block w-full cursor-zoom-in overflow-hidden bg-black text-left"
          aria-label="View shot image"
        >
          <img
            src={photoUrl}
            alt="Espresso shot"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            Photo
          </span>
        </button>
      ) : (
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#f8efe3_0%,#f0e2d3_45%,#e6d3c3_100%)] px-6 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_55%)]" />
          <div className="relative max-w-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-white/70 text-[#7a4d2a] shadow-sm backdrop-blur-sm">
              <ImageOff className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-black text-[#211a16]">
              No photo yet
            </p>
            <p className="mt-1 text-sm leading-6 text-[#6f5b50]">
              Add an image to make the shot feel complete and easier to scan.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4 p-4">
        <section className="space-y-3 rounded-[24px] border border-[#eadfd6] bg-white/70 p-4">
          {shot.coffee.origin && shot.coffee.name && (
            <p className="text-sm leading-6 text-[#6f5b50]">
              {shot.coffee.origin}
            </p>
          )}

          {hasCoffeeInformation && (
            <div className="flex flex-wrap items-center gap-2">
              {shot.coffee.roaster && (
                <span className="rounded-full bg-[#f3ebe3] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a4d2a]">
                  {shot.coffee.roaster}
                </span>
              )}

              {shot.coffee.roastLevel && (
                <span className="rounded-full border border-[#eadfd6] bg-white px-2.5 py-1 text-xs font-semibold text-[#5f4a3f]">
                  {RoastLevelLabel[shot.coffee.roastLevel]}
                </span>
              )}
            </div>
          )}

          {hasLocation && (
            <button
              type="button"
              onClick={() => {
                if (shot.location?.lat !== undefined && shot.location.lng !== undefined) {
                  setMapOpen(true);
                }
              }}
              className={`flex w-full items-start gap-2 rounded-2xl bg-[#f8f2eb] px-3 py-2 text-left text-sm leading-6 text-[#5f4a3f] ${
                shot.location?.lat !== undefined && shot.location.lng !== undefined
                  ? 'cursor-pointer transition hover:bg-[#f3ebe3]'
                  : 'cursor-default'
              }`}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7a4d2a]" aria-hidden="true" />
              <p className="min-w-0 break-words">
                <span className="font-semibold text-[#211a16]">Location:</span>{' '}
                {locationLabel}
              </p>
            </button>
          )}
        </section>

        {mapOpen && shot.location && (
          <LocationMapSheet
            location={shot.location}
            onClose={() => setMapOpen(false)}
          />
        )}

        {showRecipeStats && (
          <section className="space-y-2 rounded-[24px] border border-[#eadfd6] bg-white/70 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a6f5d]">
              <span className="rounded-full bg-[#f3ebe3] px-2.5 py-1 text-[#7a4d2a]">
                Recipe
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {recipe?.doseIn && (
                <RecipeStat label="In" value={`${recipe.doseIn}g`} />
              )}
              {recipe?.doseOut && (
                <RecipeStat label="Out" value={`${recipe.doseOut}g`} />
              )}
              {recipe?.time && (
                <RecipeStat label="Time" value={`${recipe.time}s`} />
              )}
              {ratio && <RecipeStat label="Ratio" value={`1:${ratio}`} />}
            </dl>
          </section>
        )}

        {shot.tastingNotes && (
          <section className="rounded-[24px] border border-[#eadfd6] bg-[#fbf6ef] p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a6f5d]">
              <FileText className="h-3.5 w-3.5 text-[#7a4d2a]" aria-hidden="true" />
              <span>Notes</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#4a3a31]">
              {shot.tastingNotes}
            </p>
          </section>
        )}

        {hasFooter && (
          <footer className="flex flex-col gap-3 border-t border-[#eadfd6] pt-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#5f4a3f]">
              {rating && RatingIcon && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfd6] bg-white px-3 py-1.5 text-xs text-[#7a4d2a] sm:text-sm">
                  <RatingIcon
                    className={`h-4 w-4 ${ratingIcon[rating].color}`}
                    aria-hidden="true"
                  />
                  {ratingLabel[rating]}
                </span>
              )}

              {likes > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfd6] bg-white px-3 py-1.5 text-xs text-[#5f4a3f] sm:text-sm">
                  <Heart className="h-4 w-4 text-[#c25b47]" aria-hidden="true" />
                  {likes}
                </span>
              )}

              {comments > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfd6] bg-white px-3 py-1.5 text-xs text-[#5f4a3f] sm:text-sm">
                  <MessageCircle
                    className="h-4 w-4 text-[#7a4d2a]"
                    aria-hidden="true"
                  />
                  {comments}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  aria-label="Edit shot"
                  title="Edit shot"
                  className="rounded-full border border-[#eadfd6] bg-white p-2 text-[#7a4d2a] transition hover:border-[#7a4d2a] hover:bg-[#f3ebe3] hover:text-[#211a16]"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  aria-label="Delete shot"
                  title="Delete shot"
                  className="rounded-full border border-red-200 bg-white p-2 text-red-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </footer>
        )}
      </div>
    </article>
  );
};
