import { Pencil, Trash2 } from 'lucide-react';

import { isRating, ratingIcon, ratingLabel } from '../../domain/coffee/rating';
import { RoastLevelLabel } from '../../domain/coffee/roastLevel';
import { formatLocation } from '../../domain/premises/premises';
import type { Shot } from '../../types/shot';
import { formatDate } from '../../utils/util';
import { RecipeStat } from './RecipeStat';

interface ShotCardProps {
  shot: Shot;
  onEdit?: () => void;
  onDelete?: () => void;
  onImageClick?: () => void;
}

export const ShotCard: React.FC<ShotCardProps> = ({ shot, onEdit, onDelete, onImageClick }) => {
  const recipe = shot.recipe;

  const ratio =
    recipe?.doseIn && recipe?.doseOut ? (recipe.doseOut / recipe.doseIn).toFixed(2) : null;

  const likes = shot.likesCount ?? 0;
  const comments = shot.commentsCount ?? 0;
  const rating = isRating(shot.rating) ? shot.rating : null;
  const RatingIcon = rating ? ratingIcon[rating].icon : null;
  const displayName = shot.user.displayName?.trim() || 'BadShot user';
  const username = shot.user.username?.trim();
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const coffeeTitle = shot.coffee.name?.trim() || shot.coffee.origin?.trim() || 'Untitled shot';
  const hasCoffeeMeta = Boolean(
    shot.coffee.origin?.trim() || shot.coffee.roaster?.trim() || shot.coffee.roastLevel
  );
  const hasRecipeStats = Boolean(recipe?.doseIn || recipe?.doseOut || recipe?.time || ratio);
  const hasFooter = Boolean(rating || likes > 0 || comments > 0 || onEdit || onDelete);

  return (
    <article className='overflow-hidden rounded-xl border border-[#e2d6ca] bg-[#fffaf5] shadow-sm'>
      {/* HEADER */}
      <header className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-3'>
          {shot.user.avatarUrl ? (
            <img
              src={shot.user.avatarUrl}
              alt={`${displayName} avatar`}
              className='h-10 w-10 rounded-full object-cover'
            />
          ) : (
            <div
              aria-label={`${displayName} avatar`}
              className='flex h-10 w-10 items-center justify-center rounded-full bg-[#211a16] text-sm font-black text-white'
            >
              {avatarInitial}
            </div>
          )}

          <div>
            <h2 className='text-sm font-bold'>{displayName}</h2>
            {username && <p className='text-xs text-[#6f5b50]'>@{username}</p>}
          </div>
        </div>

        <time className='text-xs font-semibold text-[#7a4d2a]'>{formatDate(shot.brewedAt)}</time>
      </header>

      {/* IMAGE */}
      {shot.imageUrl ? (
        <button
          type='button'
          onClick={onImageClick}
          className='block w-full cursor-zoom-in text-left'
          aria-label='View shot image'
        >
          <img
            src={shot.imageUrl}
            alt='Espresso shot'
            className='aspect-square w-full object-cover'
          />
        </button>
      ) : (
        <div className='flex aspect-square w-full items-center justify-center bg-[#f3ebe3] text-sm font-bold text-[#7a4d2a]'>
          No photo
        </div>
      )}

      {/* CONTENT */}
      <div className='space-y-5 p-4'>
        {/* COFFEE BLOCK (IMPORTANT) */}
        <div>
          <h3 className='text-xl font-black leading-tight'>{coffeeTitle}</h3>

          {shot.coffee.origin && shot.coffee.name && (
            <p className='text-sm text-[#6f5b50]'>{shot.coffee.origin}</p>
          )}

          {hasCoffeeMeta && (
            <div className='mt-1 flex items-center justify-between gap-3 text-xs text-[#6f5b50]'>
              {shot.coffee.roaster && (
                <span className='font-semibold uppercase text-[#7a4d2a]'>
                  {shot.coffee.roaster}
                </span>
              )}

              {shot.coffee.roastLevel && <span>{RoastLevelLabel[shot.coffee.roastLevel]}</span>}
            </div>
          )}
        </div>

        {/* LOCATION */}
        {shot.location && (
          <p className='text-xs text-[#6f5b50]'>Location: {formatLocation(shot.location)}</p>
        )}

        {/* RECIPE */}
        {hasRecipeStats && (
          <dl className='grid grid-cols-4 gap-2 text-center'>
            {recipe?.doseIn && <RecipeStat label='In' value={`${recipe.doseIn}g`} />}
            {recipe?.doseOut && <RecipeStat label='Out' value={`${recipe.doseOut}g`} />}
            {recipe?.time && <RecipeStat label='Time' value={`${recipe.time}s`} />}
            {ratio && <RecipeStat label='Ratio' value={`1:${ratio}`} />}
          </dl>
        )}

        {/* NOTES */}
        {shot.tastingNotes && (
          <p className='text-sm leading-6 text-[#4a3a31]'>{shot.tastingNotes}</p>
        )}

        {/* FOOTER */}
        {hasFooter && (
          <footer className='flex items-center justify-between border-t border-[#eadfd6] pt-4 text-sm font-semibold text-[#5f4a3f]'>
            {rating && RatingIcon && (
              <span className='inline-flex items-center gap-1.5 text-[#7a4d2a]'>
                <RatingIcon
                  className={`h-4 w-4 ${ratingIcon[rating].color}`}
                  aria-hidden='true'
                />
                {ratingLabel[rating]}
              </span>
            )}
            <div className='ml-auto flex items-center gap-3'>
              {(likes > 0 || comments > 0) && (
                <span>
                  {likes} likes - {comments} comments
                </span>
              )}

              {onEdit && (
                <button
                  type='button'
                  onClick={onEdit}
                  aria-label='Edit shot'
                  title='Edit shot'
                  className='rounded p-1 text-[#7a4d2a] transition hover:bg-[#f3ebe3] hover:text-[#211a16]'
                >
                  <Pencil className='h-4 w-4' aria-hidden='true' />
                </button>
              )}

              {onDelete && (
                <button
                  type='button'
                  onClick={onDelete}
                  aria-label='Delete shot'
                  title='Delete shot'
                  className='rounded p-1 text-red-700 transition hover:bg-red-50 hover:text-red-900'
                >
                  <Trash2 className='h-4 w-4' aria-hidden='true' />
                </button>
              )}
            </div>
          </footer>
        )}
      </div>
    </article>
  );
};
