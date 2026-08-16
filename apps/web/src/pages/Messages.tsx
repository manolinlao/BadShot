import { useEffect, useMemo, useState } from 'react';
import { useUnit } from 'effector-react';
import { messagesEffects, messagesEvents, messagesStores } from '../state/messages';
import { authStores } from '../state/auth';
import { serverShotsStores } from '../state/serverShots';

export function Messages() {
  const currentUser = useUnit(authStores.$currentUser);
  const serverShots = useUnit(serverShotsStores.$serverShots);
  const {
    conversations,
    activeId,
    messages,
    load,
    start,
    open,
    remove,
    select,
    clear,
    send,
  } =
    useUnit({
      conversations: messagesStores.$conversations,
      activeId: messagesStores.$activeConversationId,
      messages: messagesStores.$messages,
      load: messagesEffects.loadConversationsFx,
      start: messagesEffects.startConversationFx,
      open: messagesEffects.openConversationFx,
      remove: messagesEffects.deleteConversationFx,
      select: messagesEvents.conversationSelected,
      clear: messagesEvents.conversationCleared,
      send: messagesEffects.sendMessageFx,
    });
  const [body, setBody] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    void load();
  }, [load]);

  const contacts = useMemo(() => {
    const unique = new Map<string, { id: string; displayName: string; email: string }>();
    const conversationUserIds = new Set(
      conversations.flatMap((conversation) => [
        conversation.userOne.id,
        conversation.userTwo.id,
      ]),
    );
    for (const shot of serverShots) {
      if (
        shot.user.id !== currentUser?.id &&
        !conversationUserIds.has(shot.user.id)
      ) {
        unique.set(shot.user.id, shot.user);
      }
    }
    return [...unique.values()];
  }, [serverShots, currentUser?.id]);

  const activeConversation = conversations.find((item) => item.id === activeId);
  const otherUser = activeConversation
    ? activeConversation.userOne.id === currentUser?.id
      ? activeConversation.userTwo
      : activeConversation.userOne
    : null;

  const openConversation = async (conversationId: string) => {
    select(conversationId);
    await open(conversationId);
  };

  const startChat = async (userId: string) => {
    const conversation = await start(userId);
    await openConversation(conversation.id);
  };

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeId || body.trim().length === 0) return;
    setErrorMessage(undefined);

    try {
      await send({ conversationId: activeId, body: body.trim() });
      setBody('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not send message.',
      );
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeId) return;
    const confirmed = window.confirm(
      'Hide this conversation for you? The messages will remain available to the other participant.',
    );
    if (!confirmed) return;

    try {
      await remove(activeId);
      clear();
      setErrorMessage(undefined);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not delete conversation.',
      );
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-[28px] border border-[#e2d6ca] bg-white/85 p-4">
        <h1 className="text-xl font-black text-[#211a16]">Messages</h1>
        <p className="mt-1 text-sm text-[#6f5b50]">Private conversations.</p>

        <div className="mt-5 space-y-2">
          {conversations.map((conversation) => {
            const user =
              conversation.userOne.id === currentUser?.id
                ? conversation.userTwo
                : conversation.userOne;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => void openConversation(conversation.id)}
                aria-current={activeId === conversation.id ? 'page' : undefined}
                className={`w-full rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition ${
                  activeId === conversation.id
                    ? 'border-[#7a4d2a] bg-[#f3ebe3] text-[#211a16]'
                    : 'border-transparent bg-[#fbf6ef] text-[#5f4a3f] hover:border-[#e2d6ca] hover:bg-[#f3ebe3]'
                }`}
              >
                {user.displayName}
                {conversation.messages?.[0] && (
                  <span className="mt-1 block truncate text-xs opacity-70">
                    {conversation.messages[0].body}
                  </span>
                )}
                {(conversation.unreadCount ?? 0) > 0 && (
                  <span className="mt-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#c25b47] px-1.5 py-0.5 text-[10px] font-black text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {contacts.length > 0 && (
          <div className="mt-6 border-t border-[#eadfd6] pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a4d2a]">
              Start a conversation
            </p>
            <div className="mt-2 space-y-2">
              {contacts.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => void startChat(user.id)}
                  className="w-full rounded-full border border-[#e2d6ca] bg-white px-3 py-2 text-left text-sm font-semibold text-[#5f4a3f] hover:border-[#7a4d2a]"
                >
                  {user.displayName}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className="flex min-h-[520px] flex-col rounded-[28px] border border-[#e2d6ca] bg-white/85 p-4">
        {otherUser ? (
          <>
            <header className="border-b border-[#eadfd6] pb-3">
              <h2 className="font-black text-[#211a16]">{otherUser.displayName}</h2>
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-[#6f5b50]">{otherUser.email}</p>
                <button
                  type="button"
                  onClick={() => void handleDeleteConversation()}
                  className="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-50"
                >
                  Hide conversation
                </button>
              </div>
            </header>
            <div className="flex-1 space-y-2 overflow-y-auto py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    message.senderId === currentUser?.id
                      ? 'ml-auto bg-[#211a16] text-white'
                      : 'bg-[#f3ebe3] text-[#211a16]'
                  }`}
                >
                  {message.body}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2 border-t border-[#eadfd6] pt-3">
              <input
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write a message..."
                maxLength={2000}
                className="min-w-0 flex-1 rounded-full border border-[#d8c8ba] px-4 py-2 text-sm outline-none focus:border-[#7a4d2a]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#211a16] px-4 py-2 text-sm font-bold text-white"
              >
                Send
              </button>
            </form>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-[#6f5b50]">
            Select a conversation or choose a user to start messaging.
          </div>
        )}
      </div>
    </section>
  );
}
