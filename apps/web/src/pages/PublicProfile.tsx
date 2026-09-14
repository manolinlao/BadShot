import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  getUserShots,
  toggleLikeApiShot,
  type ApiShot,
} from '../api/shots/client';
import { ShotCard } from '../components/ShotCard';
import { getApiAssetUrl } from '../api/shots/client';
import { mapApiShotToShot } from '../state/serverShots';
import { authStores } from '../state/auth';
import { useUnit } from 'effector-react';

export function PublicProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [shots, setShots] = useState<ApiShot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likePendingShotId, setLikePendingShotId] = useState<string>();
  const currentUser = useUnit(authStores.$currentUser);

  useEffect(() => {
    if (!userId) return;

    let active = true;
    setLoading(true);
    setError('');

    void getUserShots(userId)
      .then((result) => {
        if (active) setShots(result);
      })
      .catch(() => {
        if (active) setError('Could not load this profile.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const handleLike = async (shotId: string) => {
    if (
      !currentUser ||
      currentUser.role === 'GUEST' ||
      likePendingShotId ||
      shots.find((shot) => shot.id === shotId)?.userId === currentUser.id
    ) {
      return;
    }

    setLikePendingShotId(shotId);

    try {
      const result = await toggleLikeApiShot(shotId);
      setShots((currentShots) =>
        currentShots.map((shot) =>
          shot.id === shotId
            ? {
                ...shot,
                likedByMe: result.liked,
                likesCount: result.likesCount,
              }
            : shot,
        ),
      );
    } catch {
      setError('Could not update the like. Try again.');
    } finally {
      setLikePendingShotId(undefined);
    }
  };

  const profileUser = shots[0]?.user;
  const avatarUrl = profileUser?.avatarUrl
    ? getApiAssetUrl(profileUser.avatarUrl)
    : undefined;

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white px-3 py-2 text-sm font-bold text-[#5f4a3f] transition hover:border-[#7a4d2a]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <header className="flex items-center gap-4 rounded-[28px] border border-[#e2d6ca] bg-white/85 p-5 shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${profileUser?.displayName ?? 'User'} avatar`}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-[#e2d6ca]"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#211a16] text-2xl font-black text-white">
            {(profileUser?.displayName ?? '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
            Public profile
          </p>
          <h1 className="truncate text-2xl font-black text-[#211a16]">
            {profileUser?.displayName ?? 'User'}
          </h1>
          {profileUser?.email && (
            <p className="truncate text-sm text-[#6f5b50]">
              @{profileUser.email.split('@')[0]}
            </p>
          )}
        </div>
      </header>

      {loading && <p className="text-sm text-[#6f5b50]">Loading shots...</p>}
      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!loading && !error && shots.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[#e2d6ca] p-6 text-center text-sm text-[#6f5b50]">
          This user has not published any shots yet.
        </p>
      )}
      <div className="space-y-5">
        {shots.map((shot) => (
          <ShotCard
            key={shot.id}
            shot={mapApiShotToShot(shot)}
            onLike={
              currentUser &&
              currentUser.role !== 'GUEST' &&
              shot.userId !== currentUser.id
                ? () => void handleLike(shot.id)
                : undefined
            }
            likePending={likePendingShotId === shot.id}
          />
        ))}
      </div>
    </section>
  );
}
