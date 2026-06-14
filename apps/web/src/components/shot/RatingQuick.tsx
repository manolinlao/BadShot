import { ratingOptions } from '../../domain/coffee/rating';

interface RatingQuickProps {
  value: number;
  onChange: (v: number) => void;
}

export const RatingQuick = ({ value, onChange }: RatingQuickProps) => {
  return (
    <div className='flex justify-center gap-3'>
      {ratingOptions.map((opt) => {
        const active = value === opt.value;

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`text-2xl transition ${active ? 'scale-125' : 'opacity-40'} cursor-pointer`}
            title={opt.label}
          >
            {opt.label.split(' ')[0]}
          </button>
        );
      })}
    </div>
  );
};
