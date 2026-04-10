import { useEffect, useCallback, useRef, useSyncExternalStore, useMemo } from 'react';

const STORAGE_PREFIX = 'pokomplete:';

type Listener = () => void;

// Global subscription registry so all useKV hooks sharing a key stay in sync
const listeners = new Map<string, Set<Listener>>();

function subscribe(key: string, listener: Listener): () => void {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key)!.add(listener);
  return () => {
    listeners.get(key)!.delete(listener);
    if (listeners.get(key)!.size === 0) {
      listeners.delete(key);
    }
  };
}

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function readFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`useKV: failed to write key "${key}" to localStorage`, e);
  }
}

// Cross-tab sync via the storage event
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith(STORAGE_PREFIX)) {
      const appKey = event.key.slice(STORAGE_PREFIX.length);
      notify(appKey);
    }
  });
}

/**
 * A localStorage-backed hook with the same API as Spark's useKV.
 * Supports functional updates, cross-component sync, cross-tab sync,
 * dynamic keys, and graceful fallback on malformed data.
 */
export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const defaultRef = useRef(defaultValue);
  defaultRef.current = defaultValue;

  const getSnapshot = useCallback(() => {
    return localStorage.getItem(STORAGE_PREFIX + key);
  }, [key]);

  const subscribeToKey = useCallback(
    (onStoreChange: () => void) => {
      return subscribe(key, onStoreChange);
    },
    [key],
  );

  const rawValue = useSyncExternalStore(subscribeToKey, getSnapshot, () => null);

  // Memoize parsed value so object/array refs are stable across renders
  const value: T = useMemo(() => {
    if (rawValue === null) return defaultRef.current;
    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return defaultRef.current;
    }
  }, [rawValue]);

  // Initialize storage with default value if not set (run once per key)
  const initializedKeys = useRef(new Set<string>());
  useEffect(() => {
    if (!initializedKeys.current.has(key) && localStorage.getItem(STORAGE_PREFIX + key) === null) {
      writeToStorage(key, defaultRef.current);
      initializedKeys.current.add(key);
    }
  }, [key]);

  const setValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      const current = readFromStorage(key, defaultRef.current);
      const next = typeof update === 'function' ? (update as (prev: T) => T)(current) : update;
      writeToStorage(key, next);
      notify(key);
    },
    [key],
  );

  return [value, setValue];
}
