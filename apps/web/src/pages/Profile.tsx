import { useState } from 'react';
import { useUnit } from 'effector-react';
import { X } from 'lucide-react';
import { authEffects, authStores } from '../state/auth';
import {
  mapApiShotToShot,
  serverShotsStores,
} from '../state/serverShots';
import { getCoffeeTitle } from '../domain/shot';
import { getRecipeRatio } from '../domain/recipe';
import { formatLocation } from '../domain/location';
import { formatDate } from '../utils/util';

export function Profile() {
  const [displayName, setDisplayName] = useState('');
  const [profileMessage, setProfileMessage] = useState<string>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string>();
  const [previewShot, setPreviewShot] = useState<ReturnType<typeof mapApiShotToShot> | null>(null);
  const {
    currentUser,
    serverShots,
    updateProfile,
    profileUpdating,
    changePassword,
    passwordUpdating,
  } = useUnit({
    currentUser: authStores.$currentUser,
    serverShots: serverShotsStores.$serverShots,
    updateProfile: authEffects.updateProfileFx,
    profileUpdating: authStores.$profileUpdating,
    changePassword: authEffects.changePasswordFx,
    passwordUpdating: authStores.$passwordUpdating,
  });

  if (!currentUser) {
    return null;
  }

  const currentDisplayName = displayName || currentUser.displayName;

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage(undefined);

    try {
      await updateProfile({ displayName: currentDisplayName });
      setDisplayName('');
      setProfileMessage('Profile updated.');
    } catch (error) {
      setProfileMessage(
        error instanceof Error ? error.message : 'Could not update profile.',
      );
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordMessage(undefined);

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('Password updated.');
    } catch (error) {
      setPasswordMessage(
        error instanceof Error ? error.message : 'Could not update password.',
      );
    }
  };

  const myShots = serverShots
    .filter(
    (shot) => shot.userId === currentUser.id,
    )
    .map(mapApiShotToShot);

  return (
    <section className="mx-auto max-w-2xl rounded-[32px] border border-[#e2d6ca] bg-white/85 p-5 shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#211a16] text-lg font-black text-white">
          {currentUser.displayName.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
            Profile
          </p>
          <h1 className="text-2xl font-black text-[#211a16]">
            {currentUser.displayName}
          </h1>
          <p className="text-sm text-[#6f5b50]">{currentUser.email}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#5f4a3f]">
        Este es tu perfil de BadShot.
      </p>

      <form onSubmit={handleProfileSubmit} className="mt-6 rounded-2xl border border-[#e2d6ca] bg-[#fbf6ef] p-4">
        <label
          htmlFor="display-name"
          className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a4d2a]"
        >
          Display name
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="display-name"
            value={currentDisplayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={60}
            className="min-w-0 flex-1 rounded-full border border-[#d8c8ba] bg-white px-4 py-2 text-sm text-[#211a16] outline-none focus:border-[#7a4d2a]"
          />
          <button
            type="submit"
            disabled={profileUpdating}
            className="rounded-full bg-[#211a16] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4a382f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {profileUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
        {profileMessage && (
          <p className="mt-2 text-sm text-[#5f4a3f]">{profileMessage}</p>
        )}
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="mt-4 rounded-2xl border border-[#e2d6ca] bg-[#fbf6ef] p-4"
      >
        <h2 className="text-sm font-black text-[#211a16]">Change password</h2>
        <div className="mt-3 space-y-2">
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Current password"
            autoComplete="current-password"
            required
            className="w-full rounded-full border border-[#d8c8ba] bg-white px-4 py-2 text-sm text-[#211a16] outline-none focus:border-[#7a4d2a]"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password (at least 8 characters)"
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-full border border-[#d8c8ba] bg-white px-4 py-2 text-sm text-[#211a16] outline-none focus:border-[#7a4d2a]"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-full border border-[#d8c8ba] bg-white px-4 py-2 text-sm text-[#211a16] outline-none focus:border-[#7a4d2a]"
          />
        </div>
        <button
          type="submit"
          disabled={passwordUpdating}
          className="mt-3 rounded-full bg-[#211a16] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4a382f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {passwordUpdating ? 'Saving...' : 'Change password'}
        </button>
        {passwordMessage && (
          <p className="mt-2 text-sm text-[#5f4a3f]">{passwordMessage}</p>
        )}
      </form>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#e2d6ca] bg-[#fbf6ef] p-4">
          <p className="text-2xl font-black text-[#211a16]">
            {myShots.length}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a4d2a]">
            Shots
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2d6ca] bg-[#fbf6ef] p-4">
          <p className="text-2xl font-black text-[#211a16]">0</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a4d2a]">
            Followers
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-black text-[#211a16]">My shots</h2>

        {myShots.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {myShots.map((shot) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => setPreviewShot(shot)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e2d6ca] bg-[#f0e2d3] text-left"
                aria-label={`View ${getCoffeeTitle(shot.coffee)}`}
              >
                {shot.photoUrl ? (
                  <img
                    src={shot.photoUrl}
                    alt={getCoffeeTitle(shot.coffee)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center px-2 text-center text-xs font-bold text-[#7a4d2a]">
                    No photo
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/75 to-transparent px-2 pb-2 pt-6 text-xs font-bold text-white">
                  {getCoffeeTitle(shot.coffee)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[#6f5b50]">
            You have not created any shots yet.
          </p>
        )}
      </div>

      {previewShot && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto bg-black/80 px-3 py-3 sm:px-4 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Shot image preview"
          onClick={() => setPreviewShot(null)}
        >
          <div
            className="relative mx-auto w-full max-w-4xl py-10 sm:py-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewShot(null)}
              className="fixed right-4 top-4 z-50 rounded-full bg-black/70 p-2.5 text-white shadow-lg transition hover:bg-black sm:right-6 sm:top-6 sm:p-2"
              aria-label="Close image preview"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>

            <div className="mb-3 rounded-2xl bg-white/10 px-3 py-3 text-white backdrop-blur-sm sm:px-4">
              <h2 className="text-base font-black leading-tight sm:text-lg">
                {getCoffeeTitle(previewShot.coffee)}
              </h2>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                {formatDate(previewShot.createdAt)}
              </p>
            </div>

            {previewShot.photoUrl ? (
              <img
                src={previewShot.photoUrl}
                alt="Shot preview"
                className="max-h-[52vh] w-full rounded-2xl object-contain shadow-2xl sm:max-h-[68vh]"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#f0e2d3] text-sm font-bold text-[#7a4d2a]">
                No photo for this shot
              </div>
            )}

            <div className="mt-3 rounded-2xl bg-white p-4 text-[#211a16] shadow-2xl">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a4d2a]">
                    Coffee
                  </p>
                  <p className="mt-1 font-semibold">
                    {getCoffeeTitle(previewShot.coffee)}
                  </p>
                  {previewShot.coffee.roaster && (
                    <p className="text-[#6f5b50]">{previewShot.coffee.roaster}</p>
                  )}
                  {previewShot.coffee.origin && (
                    <p className="text-[#6f5b50]">{previewShot.coffee.origin}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a4d2a]">
                    Recipe
                  </p>
                  <p className="mt-1 text-[#5f4a3f]">
                    {previewShot.recipe?.doseIn || previewShot.recipe?.doseOut
                      ? `${previewShot.recipe.doseIn ?? '-'}g in / ${previewShot.recipe.doseOut ?? '-'}g out`
                      : 'No recipe data'}
                    {previewShot.recipe?.time
                      ? ` · ${previewShot.recipe.time}s`
                      : ''}
                    {getRecipeRatio(previewShot.recipe)
                      ? ` · ratio ${getRecipeRatio(previewShot.recipe)}`
                      : ''}
                  </p>
                </div>

                {previewShot.tastingNotes && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a4d2a]">
                      Tasting notes
                    </p>
                    <p className="mt-1 text-[#5f4a3f]">
                      {previewShot.tastingNotes}
                    </p>
                  </div>
                )}

                {formatLocation(previewShot.location) && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a4d2a]">
                      Location
                    </p>
                    <p className="mt-1 text-[#5f4a3f]">
                      {formatLocation(previewShot.location)}
                    </p>
                  </div>
                )}

                {previewShot.rating !== undefined && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a4d2a]">
                      Rating
                    </p>
                    <p className="mt-1 text-[#5f4a3f]">
                      {previewShot.rating}/5
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
