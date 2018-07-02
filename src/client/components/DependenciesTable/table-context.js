import React from 'react';

export const TableContext = React.createContext({
  setSortingParam: () => {},
  activeSortingParam: 'name',
  ascSort: true
});
