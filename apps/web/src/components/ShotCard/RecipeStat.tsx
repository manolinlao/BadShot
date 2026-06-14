import React from 'react';

interface RecipeStatProps {
  label: string;
  value: string;
}

export const RecipeStat: React.FC<RecipeStatProps> = ({ label, value }) => {
  return (
    <div className='rounded bg-[#f3ebe3] px-2 py-3'>
      <dt className='text-[0.65rem] font-bold uppercase text-[#7a4d2a]'>{label}</dt>
      <dd className='mt-1 text-sm font-black'>{value}</dd>
    </div>
  );
};
