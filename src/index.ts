import Resolver from '@forge/resolver';
import { fetch } from '@forge/api';
import { storage } from '@forge/api';

const resolver = new Resolver();

interface CachedContent {
  content: string;
  fetchedAt: number;
  url: string;
}

const REFRESH_MS: Record<string, number> = {
  '1h': 3600000,
  '6h': 21600000,
  '24h': 86400000,
  '7d': 604800000,
};

resolver.define('fetchExternalUrl', async (req: any) => {
  const { url, refreshInterval, macroId } = req.payload;

  if (!url || typeof url !== 'string') {
    return { error: 'No URL provided' };
  }

  const cacheKey = `mermaid-cache-${macroId}`;
  const cached = (await storage.get(cacheKey)) as CachedContent | undefined;

  if (cached && refreshInterval !== 'manual') {
    const maxAge = REFRESH_MS[refreshInterval];
    if (maxAge && Date.now() - cached.fetchedAt < maxAge) {
      return { content: cached.content, fromCache: true, fetchedAt: cached.fetchedAt };
    }
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'text/plain' },
    });

    if (!response.ok) {
      if (cached) {
        return {
          content: cached.content,
          fromCache: true,
          fetchedAt: cached.fetchedAt,
          warning: `Failed to refresh (HTTP ${response.status}). Showing cached version.`,
        };
      }
      return { error: `Failed to fetch: HTTP ${response.status}` };
    }

    const content = await response.text();

    if (content.length > 50000) {
      return { error: 'Content exceeds 50KB limit' };
    }

    const cacheEntry: CachedContent = { content, fetchedAt: Date.now(), url };
    await storage.set(cacheKey, cacheEntry);

    return { content, fromCache: false, fetchedAt: Date.now() };
  } catch (err) {
    if (cached) {
      return {
        content: cached.content,
        fromCache: true,
        fetchedAt: cached.fetchedAt,
        warning: 'Network error. Showing cached version.',
      };
    }
    return { error: `Network error: ${err instanceof Error ? err.message : 'Unknown'}` };
  }
});

export const handler = resolver.getDefinitions();
