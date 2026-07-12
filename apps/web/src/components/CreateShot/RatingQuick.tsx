import { ratingIcon, ratingOptions } from '../../domain/coffee';

interface RatingQuickProps {
  value: number;
  onChange: (v: number) => void;
}

export const RatingQuick = ({ value, onChange }: RatingQuickProps) => {
  return (
    <div className="flex justify-center gap-2 rounded-[24px] border border-[#e2d6ca] bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_100%)] p-3 shadow-[0_10px_24px_rgba(49,33,20,0.05)]">
      {ratingOptions.map((opt) => {
        const active = value === opt.value;
        const Icon = ratingIcon[opt.value].icon;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-label={opt.label}
            title={opt.label}
            className={[
              'flex h-12 w-12 items-center justify-center rounded-full border transition',
              ratingIcon[opt.value].color,
              active
                ? `scale-110 border-current ${ratingIcon[opt.value].activeBg} shadow-sm`
                : 'border-transparent bg-white/70 opacity-60 hover:opacity-100',
            ].join(' ')}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
};
