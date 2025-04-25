import { useCallback, useMemo, useState } from "react";

export const useItemSelection = (items, getId) => {
  const allIds = useMemo(() => items.map(getId), [items, getId]);

  const [selectedIds, setSelectedIds] = useState([]);

  const isSelected = useCallback(
    (id) => selectedIds.includes(id),
    [selectedIds]
  );

  const selectAll = useCallback(
    (checked) => setSelectedIds(checked ? allIds : []),
    [selectedIds]
  );

  const toggleSelect = useCallback(
    (id) => setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((_id) => _id !== id)
        : [...prev, id]
    ),
    []
  );

  const clearSelect = useCallback(() => {
    setSelectedIds([]);
  }, [])

  return {
    allIds,
    selectedIds,
    isSelected,
    selectAll,
    toggleSelect,
    clearSelect,
    allSelected: selectedIds.length === allIds.length,
  }
}