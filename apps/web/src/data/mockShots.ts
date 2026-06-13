import type { Shot } from '../types/shot';

export const mockShots: Shot[] = [
  {
    id: 'shot-001',
    user: {
      displayName: 'Maya Chen',
      username: 'mayaextracts',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    coffee: {
      origin: 'Ethiopia, Yirgacheffe',
      roaster: 'North Star Coffee',
      roastLevel: 'Light',
    },
    recipe: {
      doseIn: 18,
      doseOut: 42,
      time: 29,
    },
    tastingNotes: 'Bergamot, peach, honey, and a clean floral finish.',
    rating: 5,
    likesCount: 128,
    commentsCount: 18,
    createdAt: '12 min ago',
  },
  {
    id: 'shot-002',
    user: {
      displayName: 'Jonas Keller',
      username: 'dialedbyjonas',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    coffee: {
      origin: 'Colombia, Huila',
      roaster: 'Nomad Coffee',
      roastLevel: 'Medium-light',
    },
    recipe: {
      doseIn: 19,
      doseOut: 38,
      time: 31,
    },
    tastingNotes: 'Red apple, cacao nib, brown sugar, and syrupy body.',
    rating: 4,
    likesCount: 86,
    commentsCount: 9,
    createdAt: '1 h ago',
  },
  {
    id: 'shot-003',
    user: {
      displayName: 'Sofia Martin',
      username: 'sofiaspro',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    coffee: {
      origin: 'Brazil, Minas Gerais',
      roaster: 'Right Side Coffee',
      roastLevel: 'Medium',
    },
    recipe: {
      doseIn: 18.5,
      doseOut: 37,
      time: 27,
    },
    tastingNotes: 'Hazelnut, milk chocolate, caramel, and low acidity.',
    rating: 4,
    likesCount: 64,
    commentsCount: 6,
    createdAt: '3 h ago',
  },
];
