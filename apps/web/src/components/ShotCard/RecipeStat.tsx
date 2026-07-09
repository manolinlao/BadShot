import React from 'react';

interface RecipeStatProps {
  label: string;
  value: string;
}

export const RecipeStat: React.FC<RecipeStatProps> = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-[#eadfd6] bg-[#f3ebe3] px-2 py-3">
      <dt className="text-[0.65rem] font-bold uppercase tracking-widest text-[#7a4d2a]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-black text-[#211a16]">{value}</dd>
    </div>
  );
};
