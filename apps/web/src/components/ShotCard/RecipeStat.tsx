import React from 'react';

interface RecipeStatProps {
  label: string;
  value: string;
}

export const RecipeStat: React.FC<RecipeStatProps> = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-[#e7d9cb] bg-gradient-to-br from-[#f9f3ec] to-[#f3ebe3] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#8a6f5d]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-black text-[#211a16]">{value}</dd>
    </div>
  );
};
