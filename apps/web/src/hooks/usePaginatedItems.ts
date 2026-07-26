import { useCallback, useEffect, useMemo, useState } from 'react';

type UsePaginatedItemsOptions = {
  initialPageSize: number;
  pageSize: number;
  resetKey: string;
};

export function usePaginatedItems<T>(
  items: T[],
  { initialPageSize, pageSize, resetKey }: UsePaginatedItemsOptions,
) {
  const [visibleCount, setVisibleCount] = useState(initialPageSize);

  useEffect(() => {
    setVisibleCount(initialPageSize);
  }, [initialPageSize, resetKey]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  const loadMore = useCallback(() => {
    setVisibleCount((currentCount) => currentCount + pageSize);
  }, [pageSize]);

  return {
    visibleItems,
    hasMore: visibleCount < items.length,
    loadMore,
  };
}
