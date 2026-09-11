function withoutTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

const apiUrl = withoutTrailingSlash(
  import.meta.env.VITE_API_URL || 'http://localhost:3000',
);

export const appConfig = {
  apiUrl,
  websocketUrl: withoutTrailingSlash(
    import.meta.env.VITE_WS_URL ||
      (apiUrl.startsWith('https://')
        ? apiUrl.replace(/^https:/, 'wss:')
        : apiUrl.replace(/^http:/, 'ws:')) + '/ws',
  ),
};
