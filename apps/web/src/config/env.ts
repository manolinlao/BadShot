function withoutTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

const hostname = typeof window === 'undefined' ? '' : window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

const apiUrl = withoutTrailingSlash(
  import.meta.env.VITE_API_URL ||
    (isLocalhost ? 'http://localhost:3000' : 'https://api.misterlao.com'),
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
