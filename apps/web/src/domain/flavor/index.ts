export type FlavorCategory = {
  id: string;
  label: string;
  flavors: Array<{
    id: string;
    label: string;
  }>;
};

// Catálogo inicial de sabores para la cata.
// Los identificadores son estables para poder guardarlos en PostgreSQL,
// aunque las etiquetas visibles puedan traducirse o cambiar más adelante.
export const flavorCategories: FlavorCategory[] = [
  {
    id: 'fruity',
    label: 'Fruity',
    flavors: [
      { id: 'fruity.citrus', label: 'Citrus' },
      { id: 'fruity.berry', label: 'Berry' },
      { id: 'fruity.stone-fruit', label: 'Stone fruit' },
      { id: 'fruity.tropical', label: 'Tropical fruit' },
      { id: 'fruity.dried-fruit', label: 'Dried fruit' },
    ],
  },
  {
    id: 'floral',
    label: 'Floral',
    flavors: [
      { id: 'floral.flower', label: 'Flowers' },
      { id: 'floral.tea', label: 'Tea' },
      { id: 'floral.herbal', label: 'Herbal' },
    ],
  },
  {
    id: 'sweet',
    label: 'Sweet',
    flavors: [
      { id: 'sweet.caramel', label: 'Caramel' },
      { id: 'sweet.chocolate', label: 'Chocolate' },
      { id: 'sweet.honey', label: 'Honey' },
      { id: 'sweet.vanilla', label: 'Vanilla' },
      { id: 'sweet.sugar', label: 'Brown sugar' },
    ],
  },
  {
    id: 'nutty',
    label: 'Nutty',
    flavors: [
      { id: 'nutty.nuts', label: 'Nuts' },
      { id: 'nutty.almond', label: 'Almond' },
      { id: 'nutty.hazelnut', label: 'Hazelnut' },
    ],
  },
  {
    id: 'spice',
    label: 'Spice',
    flavors: [
      { id: 'spice.cinnamon', label: 'Cinnamon' },
      { id: 'spice.clove', label: 'Clove' },
      { id: 'spice.pepper', label: 'Pepper' },
    ],
  },
  {
    id: 'roasted',
    label: 'Roasted',
    flavors: [
      { id: 'roasted.cereal', label: 'Cereal' },
      { id: 'roasted.toast', label: 'Toast' },
      { id: 'roasted.tobacco', label: 'Tobacco' },
      { id: 'roasted.smoky', label: 'Smoky' },
    ],
  },
  {
    id: 'earthy',
    label: 'Earthy',
    flavors: [
      { id: 'earthy.woody', label: 'Woody' },
      { id: 'earthy.earth', label: 'Earth' },
      { id: 'earthy.mossy', label: 'Mossy' },
    ],
  },
  {
    id: 'fermented',
    label: 'Fermented',
    flavors: [
      { id: 'fermented.winey', label: 'Winey' },
      { id: 'fermented.brandy', label: 'Brandy' },
      { id: 'fermented.yogurt', label: 'Yogurt' },
    ],
  },
];

export function getFlavorLabel(flavorId: string): string {
  for (const category of flavorCategories) {
    const flavor = category.flavors.find((item) => item.id === flavorId);
    if (flavor) return flavor.label;
  }

  return flavorId;
}
