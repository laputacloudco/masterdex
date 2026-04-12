import { useCallback, useMemo } from 'react';
import { useKV } from './useKV';

/**
 * Centralized hook for managing checked (owned) card state.
 *
 * Backed by localStorage via useKV. The storage key is derived from the
 * collection's storageKey to keep different setlists' ownership data separate.
 *
 * Provides O(1) lookup via a derived Set, plus toggle/check/uncheck helpers.
 */
export function useCheckedCards(storageKey: string) {
  const [checkedCardIds, setCheckedCardIds] = useKV<string[]>(
    `checklist-${storageKey}`,
    [],
  );

  const checkedSet = useMemo(
    () => new Set(checkedCardIds ?? []),
    [checkedCardIds],
  );

  const isChecked = useCallback(
    (cardId: string) => checkedSet.has(cardId),
    [checkedSet],
  );

  const toggle = useCallback(
    (cardId: string) => {
      setCheckedCardIds((current) => {
        const list = current ?? [];
        return list.includes(cardId)
          ? list.filter((id) => id !== cardId)
          : [...list, cardId];
      });
    },
    [setCheckedCardIds],
  );

  const checkedCount = checkedSet.size;

  return {
    checkedCardIds: checkedCardIds ?? [],
    checkedSet,
    checkedCount,
    isChecked,
    toggle,
  } as const;
}
