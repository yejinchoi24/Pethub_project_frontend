import React, { createContext, useContext, useState } from 'react';

const RankingContext = createContext();

export const useRanking = () => useContext(RankingContext);

export const RankingProvider = ({ children }) => {
  const [trigger, setTrigger] = useState(false);

  const updateRanking = () => setTrigger(!trigger); // trigger 값 변경으로 리렌더링 트리거

  return (
    <RankingContext.Provider value={{ trigger, updateRanking }}>
      {children}
    </RankingContext.Provider>
  );
};
