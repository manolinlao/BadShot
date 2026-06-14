import { ratingLabel } from '../../domain/coffee/rating';
import { RoastLevelLabel } from '../../domain/coffee/roastLevel';
import { formatLocation } from '../../domain/premises/premises';
import type { Shot } from '../../types/shot';
import { formatDate } from '../../utils/util';
import { RecipeStat } from './RecipeStat';

interface ShotCardProps {
  shot: Shot;
}

export const ShotCard: React.FC<ShotCardProps> = ({ shot }) => {
  const recipe = shot.recipe;

  const ratio =
    recipe?.doseIn && recipe?.doseOut ? (recipe.doseOut / recipe.doseIn).toFixed(2) : null;

  const likes = shot.likesCount ?? 0;
  const comments = shot.commentsCount ?? 0;

  return (
    <article className='overflow-hidden rounded-xl border border-[#e2d6ca] bg-[#fffaf5] shadow-sm'>
      {/* HEADER */}
      <header className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-3'>
          <img
            src={shot.user.avatarUrl}
            alt={`${shot.user.displayName} avatar`}
            className='h-10 w-10 rounded-full object-cover'
          />

          <div>
            <h2 className='text-sm font-bold'>{shot.user.displayName}</h2>
            <p className='text-xs text-[#6f5b50]'>@{shot.user.username}</p>
          </div>
        </div>

        <time className='text-xs font-semibold text-[#7a4d2a]'>{formatDate(shot.brewedAt)}</time>
      </header>

      {/* IMAGE */}
      <img
        src={shot.imageUrl}
        alt={`Espresso shot`}
        className='aspect-square w-full object-cover'
      />

      {/* CONTENT */}
      <div className='space-y-5 p-4'>
        {/* COFFEE BLOCK (IMPORTANT) */}
        <div>
          <h3 className='text-xl font-black leading-tight'>
            {shot.coffee.name ?? shot.coffee.origin}
          </h3>

          <p className='text-sm text-[#6f5b50]'>{shot.coffee.origin}</p>

          <div className='flex items-center justify-between text-xs text-[#6f5b50] mt-1'>
            <span className='font-semibold text-[#7a4d2a] uppercase'>{shot.coffee.roaster}</span>

            <span>{shot.coffee.roastLevel ? RoastLevelLabel[shot.coffee.roastLevel] : ''}</span>
          </div>
        </div>

        {/* LOCATION */}
        {shot.location && (
          <p className='text-xs text-[#6f5b50]'>📍 {formatLocation(shot.location)}</p>
        )}

        {/* RECIPE */}
        {recipe && (
          <dl className='grid grid-cols-4 gap-2 text-center'>
            {recipe.doseIn && <RecipeStat label='In' value={`${recipe.doseIn}g`} />}
            {recipe.doseOut && <RecipeStat label='Out' value={`${recipe.doseOut}g`} />}
            {recipe.time && <RecipeStat label='Time' value={`${recipe.time}s`} />}
            {ratio && <RecipeStat label='Ratio' value={`1:${ratio}`} />}
          </dl>
        )}

        {/* NOTES */}
        {shot.tastingNotes && (
          <p className='text-sm leading-6 text-[#4a3a31]'>{shot.tastingNotes}</p>
        )}

        {/* FOOTER */}
        <footer className='flex items-center justify-between border-t border-[#eadfd6] pt-4 text-sm font-semibold text-[#5f4a3f]'>
          {shot.rating && <span className='text-[#7a4d2a]'>{ratingLabel[shot.rating]}</span>}
          {(likes > 0 || comments > 0) && (
            <span>
              {likes} likes · {comments} comments
            </span>
          )}
        </footer>
      </div>
    </article>
  );
};
