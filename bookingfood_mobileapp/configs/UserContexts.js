import { createContext, useState } from "react";

export const MyUserContext = createContext()
export const MyDispatchContext = createContext()

export const SearchContext = createContext()
export const SearchProvider = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState('')
  const [filters, setFilters] = useState({
    priceRange: null,
    categories: [],
  })

  return (
    <SearchContext.Provider value={{ searchKeyWord, setSearchKeyWord, filters, setFilters }}>
      {children}
    </SearchContext.Provider>
  );
};


