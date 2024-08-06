import { useState, useRef } from "react";

const useSearch = (initialFilterSearch = {}) => {
  const [filterSearch, setFilterSearch] = useState(initialFilterSearch);
  const [moveBack, setMoveBack] = useState(0);
  const debounceTimer = useRef<any>(null);

  const onSearch = (query:string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
      setMoveBack(0);
    }

    debounceTimer.current = setTimeout(() => {
      setFilterSearch((prev) => ({ ...prev, search: query }));
      setMoveBack(1);
    }, 300);
  };

  return { onSearch, filterSearch, moveBack };
};

export default useSearch;
