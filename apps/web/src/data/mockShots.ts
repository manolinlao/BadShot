import type { Shot } from '../types';

export const mockShots: Shot[] = [
  {
    id: 'shot-001',
    user: {
      displayName: 'Maya Chen',
      username: 'mayaextracts',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },

    coffee: {
      name: 'Black Honey Lot 23',
      origin: 'Yirgacheffe, Ethiopia',
      roaster: 'North Star Coffee',
      roastLevel: 'light',
    },

    location: {
      name: "Satan's Coffee Corner",
      city: 'Barcelona',
      country: 'Spain',
    },

    recipe: {
      doseIn: 18,
      doseOut: 42,
      time: 29,
    },

    tastingNotes: 'Bergamot, peach, honey, floral acidity.',
    rating: 5,
    likesCount: 128,
    commentsCount: 18,

    brewedAt: '2026-06-12T11:00:00.000Z',
    createdAt: '2026-06-12T11:10:00.000Z',
  },

  {
    id: 'shot-002',
    user: {
      displayName: 'Jonas Keller',
      username: 'dialedbyjonas',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },

    coffee: {
      name: 'El Paraiso Washed',
      origin: 'Huila, Colombia',
      roaster: 'Nomad Coffee',
      roastLevel: 'medium-light',
    },

    location: {
      name: 'Nomad Coffee Lab',
      city: 'Madrid',
      country: 'Spain',
    },

    recipe: {
      doseIn: 19,
      doseOut: 38,
      time: 31,
    },

    tastingNotes: 'Red apple, cacao nib, brown sugar, syrupy body.',
    rating: 4,
    likesCount: 86,
    commentsCount: 9,

    brewedAt: '2026-06-13T09:15:00.000Z',
    createdAt: '2026-06-13T09:20:00.000Z',
  },

  {
    id: 'shot-003',
    user: {
      displayName: 'Sofia Martin',
      username: 'sofiaspro',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },

    coffee: {
      name: 'Brazil Fazenda Reserve',
      origin: 'Minas Gerais, Brazil',
      roaster: 'Right Side Coffee',
      roastLevel: 'medium',
    },

    location: {
      name: 'Home',
      city: 'Gijon',
      country: 'Spain',
    },

    recipe: {
      doseIn: 18.5,
      doseOut: 37,
      time: 27,
    },

    tastingNotes: 'Hazelnut, milk chocolate, caramel, low acidity.',
    rating: 4,
    likesCount: 64,
    commentsCount: 6,

    brewedAt: '2026-06-12T11:00:00.000Z',
    createdAt: '2026-06-12T11:10:00.000Z',
  },

  // Real cafe shot without recipe details.
  {
    id: 'shot-004',
    user: {
      displayName: 'Alex Rivera',
      username: 'espresso_nomad',
      avatarUrl:
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
    },

    coffee: {
      name: 'House Espresso',
      origin: 'Blend',
      roaster: 'Local Cafe Roast',
      roastLevel: 'dark',
    },

    location: {
      name: 'Small Coffee Bar',
      city: 'Gijon',
      country: 'Spain',
    },

    tastingNotes: 'Chocolate, toasted nuts, intense body.',

    rating: 3,
    likesCount: 12,
    commentsCount: 2,

    brewedAt: '2026-06-11T08:30:00.000Z',
    createdAt: '2026-06-11T08:35:00.000Z',
  },
];
