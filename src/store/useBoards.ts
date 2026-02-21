import { useContext } from 'react';
import { BoardsContext } from './boards';

export const useBoards = () => {
  const ctx = useContext(BoardsContext);
  if (!ctx) throw new Error('useBoards must be used within BoardsProvider');
  return ctx;
};

export const useBoardById = (id: string) => {
  const { boards } = useBoards();
  return boards.find(b => b.id === id);
};
