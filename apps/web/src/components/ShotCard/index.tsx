import { Pencil, Trash2 } from 'lucide-react';
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
  const photoUrl = usePhoto(shot.photoId);

  const recipe = shot.recipe;
  const ratio = getRecipeRatio(recipe);
  const showRecipeStats = hasRecipeStats(recipe);

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
    <article className="overflow-hidden rounded-[24px] border border-[#e2d6ca] bg-[#fffaf5] shadow-sm">
      <header className="flex items-start justify-between gap-4 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {shot.user.avatarUrl ? (
            <img
              src={shot.user.avatarUrl}
              alt={`${displayName} avatar`}
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
          </div>
        </div>

        <time className="shrink-0 text-xs font-semibold uppercase tracking-widest text-[#7a4d2a]">
          {formatDate(shot.createdAt)}
        </time>
      </header>

      {photoUrl ? (
        <button
          type="button"
          onClick={onImageClick}
          className="group block w-full cursor-zoom-in overflow-hidden bg-black text-left"
          aria-label="View shot image"
        >
          <img
            src={photoUrl}
            alt="Espresso shot"
            className="aspect-square w-full object-cover transition group-hover:scale-[1.01]"
          />
        </button>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-[linear-gradient(180deg,#f4ebe2_0%,#efe4d8_100%)] text-sm font-bold text-[#7a4d2a]">
          <div className="text-center">
            <p>No photo</p>
            <p className="mt-1 text-xs font-medium text-[#8a6f5d]">
              Add an image to make the shot stand out.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5 p-4">
        <div>
          <h3 className="text-xl font-black leading-tight text-[#211a16]">
            {coffeeTitle}
          </h3>

          {shot.coffee.origin && shot.coffee.name && (
            <p className="text-sm text-[#6f5b50]">{shot.coffee.origin}</p>
          )}

          {hasCoffeeInformation && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#6f5b50]">
              {shot.coffee.roaster && (
                <span className="rounded-full bg-[#f3ebe3] px-2.5 py-1 font-semibold uppercase tracking-widest text-[#7a4d2a]">
                  {shot.coffee.roaster}
                </span>
              )}

              {shot.coffee.roastLevel && (
                <span className="rounded-full border border-[#eadfd6] px-2.5 py-1">
                  {RoastLevelLabel[shot.coffee.roastLevel]}
                </span>
              )}
            </div>
          )}
        </div>

        {shot.location && (
          <p className="text-xs text-[#6f5b50]">
            Location: {formatLocation(shot.location)}
          </p>
        )}

        {showRecipeStats && (
          <dl className="grid grid-cols-4 gap-2 text-center">
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
        )}

        {shot.tastingNotes && (
          <p className="text-sm leading-6 text-[#4a3a31]">
            {shot.tastingNotes}
          </p>
        )}

        {hasFooter && (
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfd6] pt-4 text-sm font-semibold text-[#5f4a3f]">
            {rating && RatingIcon && (
              <span className="inline-flex items-center gap-1.5 text-[#7a4d2a]">
                <RatingIcon
                  className={`h-4 w-4 ${ratingIcon[rating].color}`}
                  aria-hidden="true"
                />
                {ratingLabel[rating]}
              </span>
            )}
            <div className="ml-auto flex items-center gap-3">
              {(likes > 0 || comments > 0) && (
                <span className="text-xs font-semibold uppercase tracking-widest text-[#6f5b50]">
                  {likes} likes - {comments} comments
                </span>
              )}

              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  aria-label="Edit shot"
                  title="Edit shot"
                  className="rounded-full border border-[#eadfd6] p-2 text-[#7a4d2a] transition hover:border-[#7a4d2a] hover:bg-[#f3ebe3] hover:text-[#211a16]"
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
                  className="rounded-full border border-red-200 p-2 text-red-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-900"
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
