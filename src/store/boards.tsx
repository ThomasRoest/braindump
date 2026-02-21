import { createContext, useContext, useReducer, useEffect } from 'react';
import { type Board, type Card } from '../types';
import { generateId } from '../lib/utils';

interface BoardsState {
  boards: Board[];
}

type Action =
  | { type: 'CREATE_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: { id: string; updates: Partial<Board> } }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'IMPORT_BOARD'; payload: Board }
  | { type: 'ADD_CARD'; payload: { boardId: string; card: Card } }
  | { type: 'UPDATE_CARD'; payload: { boardId: string; cardId: string; updates: Partial<Card> } }
  | { type: 'DELETE_CARD'; payload: { boardId: string; cardId: string } }
  | { type: 'UPDATE_VIEW'; payload: { boardId: string; viewX: number; viewY: number; viewScale: number } };

const STORAGE_KEY = 'braindump-boards';

const loadFromStorage = (): BoardsState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { boards: JSON.parse(saved) };
  } catch {
    // ignore parse errors
  }
  return { boards: [] };
};

const reducer = (state: BoardsState, action: Action): BoardsState => {
  switch (action.type) {
    case 'CREATE_BOARD':
      return { boards: [...state.boards, action.payload] };

    case 'UPDATE_BOARD':
      return {
        boards: state.boards.map(b =>
          b.id === action.payload.id
            ? { ...b, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : b
        ),
      };

    case 'DELETE_BOARD':
      return { boards: state.boards.filter(b => b.id !== action.payload) };

    case 'IMPORT_BOARD': {
      const exists = state.boards.some(b => b.id === action.payload.id);
      return {
        boards: exists
          ? state.boards.map(b => (b.id === action.payload.id ? action.payload : b))
          : [...state.boards, action.payload],
      };
    }

    case 'ADD_CARD':
      return {
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? { ...b, cards: [...b.cards, action.payload.card], updatedAt: new Date().toISOString() }
            : b
        ),
      };

    case 'UPDATE_CARD':
      return {
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? {
                ...b,
                cards: b.cards.map(c =>
                  c.id === action.payload.cardId
                    ? ({ ...c, ...action.payload.updates } as Card)
                    : c
                ),
                updatedAt: new Date().toISOString(),
              }
            : b
        ),
      };

    case 'DELETE_CARD':
      return {
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? {
                ...b,
                cards: b.cards.filter(c => c.id !== action.payload.cardId),
                updatedAt: new Date().toISOString(),
              }
            : b
        ),
      };

    case 'UPDATE_VIEW':
      return {
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? {
                ...b,
                viewX: action.payload.viewX,
                viewY: action.payload.viewY,
                viewScale: action.payload.viewScale,
              }
            : b
        ),
      };

    default:
      return state;
  }
};

interface BoardsContextType {
  boards: Board[];
  createBoard: (name: string, description: string, color: string) => Board;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  importBoard: (board: Board) => void;
  addCard: (boardId: string, card: Card) => void;
  updateCard: (boardId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  updateView: (boardId: string, viewX: number, viewY: number, viewScale: number) => void;
  exportBoard: (id: string) => void;
}

const BoardsContext = createContext<BoardsContextType>({} as BoardsContextType);

export const BoardsProvider = ({ children }: { children: React.ReactNode }) => {
  // Load from localStorage synchronously as initial state — no race condition
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.boards));
  }, [state.boards]);

  const createBoard = (name: string, description: string, color: string): Board => {
    const board: Board = {
      id: generateId(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: [],
      viewX: 0,
      viewY: 0,
      viewScale: 1,
      color,
    };
    dispatch({ type: 'CREATE_BOARD', payload: board });
    return board;
  };

  const updateBoard = (id: string, updates: Partial<Board>) => {
    dispatch({ type: 'UPDATE_BOARD', payload: { id, updates } });
  };

  const deleteBoard = (id: string) => {
    dispatch({ type: 'DELETE_BOARD', payload: id });
  };

  const importBoard = (board: Board) => {
    dispatch({ type: 'IMPORT_BOARD', payload: board });
  };

  const addCard = (boardId: string, card: Card) => {
    dispatch({ type: 'ADD_CARD', payload: { boardId, card } });
  };

  const updateCard = (boardId: string, cardId: string, updates: Partial<Card>) => {
    dispatch({ type: 'UPDATE_CARD', payload: { boardId, cardId, updates } });
  };

  const deleteCard = (boardId: string, cardId: string) => {
    dispatch({ type: 'DELETE_CARD', payload: { boardId, cardId } });
  };

  const updateView = (boardId: string, viewX: number, viewY: number, viewScale: number) => {
    dispatch({ type: 'UPDATE_VIEW', payload: { boardId, viewX, viewY, viewScale } });
  };

  const exportBoard = (id: string) => {
    const board = state.boards.find(b => b.id === id);
    if (!board) return;
    const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${board.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <BoardsContext.Provider
      value={{
        boards: state.boards,
        createBoard,
        updateBoard,
        deleteBoard,
        importBoard,
        addCard,
        updateCard,
        deleteCard,
        updateView,
        exportBoard,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBoards = () => {
  const ctx = useContext(BoardsContext);
  if (!ctx) throw new Error('useBoards must be used within BoardsProvider');
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBoardById = (id: string) => {
  const { boards } = useBoards();
  return boards.find(b => b.id === id);
};
