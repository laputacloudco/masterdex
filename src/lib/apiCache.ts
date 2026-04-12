import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'pokomplete-cache';
const DB_VERSION = 2;  // Bump to invalidate stale pre-variant-expansion data
const STORE_NAME = 'api-cache';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// TTLs in milliseconds
export const CACHE_TTL = {
  POKE_API: 30 * 24 * 60 * 60 * 1000, // 30 days — species/evolution data rarely changes
  TCG_SETS: 24 * 60 * 60 * 1000,       // 1 day — new sets release infrequently
  TCG_CARDS: 60 * 60 * 1000,            // 1 hour — card data is mostly stable
} as const;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    }).catch(() => {
      // IndexedDB unavailable — will fall back to in-memory
      dbPromise = null;
      throw new Error('IndexedDB unavailable');
    });
  }
  return dbPromise;
}

// In-memory fallback when IndexedDB is unavailable
const memoryCache = new Map<string, CacheEntry<unknown>>();

export async function cacheGet<T>(key: string): Promise<T | undefined> {
  try {
    const db = await getDB();
    const entry = await db.get(STORE_NAME, key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      await db.delete(STORE_NAME, key);
      return undefined;
    }
    return entry.value;
  } catch {
    const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      return undefined;
    }
    return entry.value;
  }
}

export async function cacheSet<T>(key: string, value: T, ttl: number): Promise<void> {
  const entry: CacheEntry<T> = {
    value,
    expiresAt: Date.now() + ttl,
  };

  try {
    const db = await getDB();
    await db.put(STORE_NAME, entry, key);
  } catch {
    memoryCache.set(key, entry as CacheEntry<unknown>);
  }
}

export async function cacheClear(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
  } catch {
    memoryCache.clear();
  }
}

export async function cacheDeleteByPrefix(prefix: string): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    let cursor = await store.openCursor();
    while (cursor) {
      if (typeof cursor.key === 'string' && cursor.key.startsWith(prefix)) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }
    await tx.done;
  } catch {
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  }
}
