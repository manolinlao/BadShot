import type { Shot } from '../../types/shot';

type ShotCardProps = {
  shot: Shot;
};

export function ShotCard({ shot }: ShotCardProps) {
  const ratio = (shot.recipe.doseOut / shot.recipe.doseIn).toFixed(2);

  return (
    <article className="overflow-hidden rounded-lg border border-[#e2d6ca] bg-[#fffaf5] shadow-sm">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={shot.user.avatarUrl}
            alt={`${shot.user.displayName} avatar`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-sm font-bold">{shot.user.displayName}</h2>
            <p className="text-xs text-[#6f5b50]">@{shot.user.username}</p>
          </div>
        </div>
        <time className="text-xs font-semibold text-[#7a4d2a]">
          {shot.createdAt}
        </time>
      </header>

      <img
        src={shot.imageUrl}
        alt={`Espresso shot brewed with ${shot.coffee.origin}`}
        className="aspect-square w-full object-cover"
      />

      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs font-bold uppercase text-[#7a4d2a]">
            {shot.coffee.roaster}
          </p>
          <h3 className="mt-1 text-xl font-black">{shot.coffee.origin}</h3>
          <p className="text-sm text-[#6f5b50]">{shot.coffee.roastLevel}</p>
        </div>

        <dl className="grid grid-cols-4 gap-2 text-center">
          <RecipeStat label="In" value={`${shot.recipe.doseIn}g`} />
          <RecipeStat label="Out" value={`${shot.recipe.doseOut}g`} />
          <RecipeStat label="Time" value={`${shot.recipe.time}s`} />
          <RecipeStat label="Ratio" value={`1:${ratio}`} />
        </dl>

        <p className="text-sm leading-6 text-[#4a3a31]">{shot.tastingNotes}</p>

        <footer className="flex items-center justify-between border-t border-[#eadfd6] pt-4 text-sm font-semibold text-[#5f4a3f]">
          <span>{'★'.repeat(shot.rating)}</span>
          <span>
            {shot.likesCount} likes · {shot.commentsCount} comments
          </span>
        </footer>
      </div>
    </article>
  );
}

type RecipeStatProps = {
  label: string;
  value: string;
};

function RecipeStat({ label, value }: RecipeStatProps) {
  return (
    <div className="rounded bg-[#f3ebe3] px-2 py-3">
      <dt className="text-[0.65rem] font-bold uppercase text-[#7a4d2a]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-black">{value}</dd>
    </div>
  );
}
