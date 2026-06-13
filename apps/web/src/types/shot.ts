export type Shot = {
  id: string;
  user: {
    displayName: string;
    username: string;
    avatarUrl: string;
  };
  imageUrl: string;
  coffee: {
    origin: string;
    roaster: string;
    roastLevel: string;
  };
  recipe: {
    doseIn: number;
    doseOut: number;
    time: number;
  };
  tastingNotes: string;
  rating: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
};
