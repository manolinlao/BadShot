import { ratingIcon, ratingOptions } from '../../domain/coffee/rating';

interface RatingQuickProps {
  value: number;
  onChange: (v: number) => void;
}

export const RatingQuick = ({ value, onChange }: RatingQuickProps) => {
  return (
    <div className='flex justify-center gap-2'>
      {ratingOptions.map((opt) => {
        const active = value === opt.value;
        const Icon = ratingIcon[opt.value].icon;

        return (
          <button
            key={opt.value}
            type='button'
            onClick={() => onChange(opt.value)}
            aria-label={opt.label}
            title={opt.label}
            className={[
              'flex h-11 w-11 items-center justify-center rounded-full border transition',
              ratingIcon[opt.value].color,
              active
                ? `scale-110 border-current ${ratingIcon[opt.value].activeBg}`
                : 'border-transparent bg-white/70 opacity-55 hover:opacity-100'
            ].join(' ')}
          >
            <Icon className='h-6 w-6' aria-hidden='true' />
          </button>
        );
      })}
    </div>
  );
};
