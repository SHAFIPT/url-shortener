const KEY = 'pending_url';
const TEN_MIN = 10 * 60 * 1000;

export const savePendingUrl = (url: string) => {
  localStorage.setItem(KEY, JSON.stringify({ url, savedAt: Date.now() }));
};

export const popPendingUrl = (maxAgeMs = TEN_MIN): string | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  localStorage.removeItem(KEY);

  try {
    const { url, savedAt } = JSON.parse(raw);
    if (!url || !savedAt) return null;
    if (Date.now() - savedAt > maxAgeMs) return null;
    return url;
  } catch {
    return null;
  }
};