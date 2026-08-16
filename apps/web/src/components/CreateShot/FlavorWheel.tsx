import { useState } from 'react';
import { flavorCategories, getFlavorLabel } from '../../domain/flavor';

type FlavorWheelProps = {
  flavors: string[];
  setFlavors: (value: string[]) => void;
  readOnly?: boolean;
};

const categoryColors = [
  '#e7a35b',
  '#d88bb2',
  '#e6c85c',
  '#b98762',
  '#a89bd4',
  '#9b8066',
  '#8eb596',
  '#c77b67',
];

const center = 200;

function pointAt(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: center + Math.cos(radians) * radius,
    y: center + Math.sin(radians) * radius,
  };
}

function ringSegment(
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
) {
  const outerStart = pointAt(startAngle, outerRadius);
  const outerEnd = pointAt(endAngle, outerRadius);
  const innerEnd = pointAt(endAngle, innerRadius);
  const innerStart = pointAt(startAngle, innerRadius);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

export function FlavorWheel({
  flavors,
  setFlavors,
  readOnly = false,
}: FlavorWheelProps) {
  const [hoveredFlavor, setHoveredFlavor] = useState<string>();
  const categoryAngle = 360 / flavorCategories.length;

  const toggleFlavor = (flavorId: string) => {
    setFlavors(
      flavors.includes(flavorId)
        ? flavors.filter((id) => id !== flavorId)
        : [...flavors, flavorId],
    );
  };

  return (
    <div>
      <div className="mx-auto aspect-square w-full max-w-[360px]">
        <svg
          viewBox="0 0 400 400"
          role="group"
          aria-label="Coffee flavor wheel"
          className="h-full w-full overflow-visible"
        >
          <circle cx="200" cy="200" r="192" fill="#fffaf5" />

          {flavorCategories.map((category, categoryIndex) => {
            const categoryStart = -90 + categoryIndex * categoryAngle;
            const flavorAngle = categoryAngle / category.flavors.length;
            const color = categoryColors[categoryIndex];

            return (
              <g key={category.id}>
                <path
                  d={ringSegment(categoryStart + 0.8, categoryStart + categoryAngle - 0.8, 48, 100)}
                  fill={color}
                  fillOpacity="0.92"
                  stroke="#fffaf5"
                  strokeWidth="2"
                >
                  <title>{category.label}</title>
                </path>

                {category.flavors.map((flavor, flavorIndex) => {
                  const start = categoryStart + flavorIndex * flavorAngle + 0.8;
                  const end = categoryStart + (flavorIndex + 1) * flavorAngle - 0.8;
                  const selected = flavors.includes(flavor.id);
                  const labelPoint = pointAt(
                    (start + end) / 2,
                    142,
                  );

                  return (
                    <g key={flavor.id}>
                      <path
                        d={ringSegment(start, end, 103, 184)}
                        fill={color}
                        fillOpacity={selected ? 0.95 : 0.62}
                        strokeWidth={selected ? 4 : 2}
                        stroke={selected ? '#211a16' : '#fffaf5'}
                        className={readOnly ? undefined : 'cursor-pointer transition-opacity hover:opacity-80'}
                        onClick={readOnly ? undefined : () => toggleFlavor(flavor.id)}
                        onMouseEnter={() => setHoveredFlavor(flavor.id)}
                        onMouseLeave={() => setHoveredFlavor(undefined)}
                        role={readOnly ? undefined : 'button'}
                        tabIndex={readOnly ? undefined : 0}
                        onKeyDown={
                          readOnly
                            ? undefined
                            : (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  toggleFlavor(flavor.id);
                                }
                              }
                        }
                      >
                        <title>
                          {selected ? 'Remove' : 'Select'} {flavor.label}
                        </title>
                      </path>
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${(start + end) / 2 + 90} ${labelPoint.x} ${labelPoint.y})`}
                        className="pointer-events-none select-none fill-[#211a16] text-[8px] font-bold"
                      >
                        {flavor.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          <circle cx="200" cy="200" r="47" fill="#211a16" />
          <text
            x="200"
            y="196"
            textAnchor="middle"
            className="fill-white text-[12px] font-black uppercase tracking-[0.18em]"
          >
            Flavor
          </text>
          <text
            x="200"
            y="214"
            textAnchor="middle"
            className="fill-[#eadfd6] text-[10px] font-semibold"
          >
            wheel
          </text>
        </svg>
      </div>

      <p className="mt-2 min-h-5 text-center text-xs font-semibold text-[#5f4a3f]">
        {hoveredFlavor
          ? getFlavorLabel(hoveredFlavor)
          : 'Hover over a segment to identify it'}
      </p>

      {flavors.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {flavors.map((flavorId) =>
            readOnly ? (
              <span
                key={flavorId}
                className="rounded-full bg-[#211a16] px-3 py-1.5 text-xs font-semibold text-white"
              >
                {getFlavorLabel(flavorId)}
              </span>
            ) : (
              <button
                key={flavorId}
                type="button"
                onClick={() => toggleFlavor(flavorId)}
                className="rounded-full bg-[#211a16] px-3 py-1.5 text-xs font-semibold text-white"
              >
                {getFlavorLabel(flavorId)} ×
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
