import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useBoards } from '../store/useBoards';
import { useTheme } from '../store/useTheme';
import { type Card, type NoteCard, type TodoCard, type ImageCard } from '../types';
import { generateId, debounce, randomItem } from '../lib/utils';
import { CARD_COLORS } from '../lib/cardColors';
import CanvasBoard from '../components/canvas/CanvasBoard';
import Toolbar from '../components/canvas/Toolbar';
import CanvasDock from '../components/canvas/CanvasDock';

const CanvasPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, updateBoard, addCard, updateCard, deleteCard, updateView, exportBoard } = useBoards();
  const { isDark, toggleTheme } = useTheme();

  const board = boards.find(b => b.id === id);

  const [view, setView] = useState(() =>
    board ? { x: board.viewX, y: board.viewY, scale: board.viewScale } : { x: 0, y: 0, scale: 1 }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveView = useCallback(
    debounce((x: number, y: number, scale: number) => {
      if (id) updateView(id, x, y, scale);
    }, 800),
    [id]
  );

  useEffect(() => {
    return () => {
      if (id) updateView(id, view.x, view.y, view.scale);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'n' || e.key === 'N') handleAddNote();
      if (e.key === 't' || e.key === 'T') handleAddTodo();
      if (e.key === 'i' || e.key === 'I') handleAddImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  if (!board) return <Navigate to="/" />;

  const getViewCenter = () => ({
    x: (window.innerWidth / 2 - view.x) / view.scale,
    y: (window.innerHeight / 2 - view.y) / view.scale,
  });

  const getMaxZIndex = () =>
    board.cards.length > 0 ? Math.max(...board.cards.map(c => c.zIndex || 0)) : 0;

  const handleViewChange = (x: number, y: number, scale: number) => {
    setView({ x, y, scale });
    saveView(x, y, scale);
  };

  const handleAddNote = () => {
    const { x, y } = getViewCenter();
    const card: NoteCard = {
      id: generateId(),
      type: 'note',
      x: x - 120,
      y: y - 80,
      width: 240,
      height: 160,
      color: randomItem(CARD_COLORS),
      content: '',
      zIndex: getMaxZIndex() + 1,
    };
    addCard(board.id, card);
  };

  const handleAddTodo = () => {
    const { x, y } = getViewCenter();
    const card: TodoCard = {
      id: generateId(),
      type: 'todo',
      x: x - 130,
      y: y - 150,
      width: 260,
      height: 300,
      color: randomItem(CARD_COLORS),
      title: 'To-do',
      items: [],
      zIndex: getMaxZIndex() + 1,
    };
    addCard(board.id, card);
  };

  const handleAddImage = () => {
    const { x, y } = getViewCenter();
    const card: ImageCard = {
      id: generateId(),
      type: 'image',
      x: x - 150,
      y: y - 100,
      width: 300,
      height: 220,
      color: randomItem(CARD_COLORS),
      src: '',
      caption: '',
      zIndex: getMaxZIndex() + 1,
    };
    addCard(board.id, card);
  };

  const handleUpdateCard = (cardId: string, updates: Partial<Card>) => {
    updateCard(board.id, cardId, updates);
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCard(board.id, cardId);
  };

  const handleBringToFront = (cardId: string) => {
    updateCard(board.id, cardId, { zIndex: getMaxZIndex() + 1 });
  };

  const handleZoomIn = () => {
    const newScale = Math.min(4, view.scale * 1.2);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const canvasX = (cx - view.x) / view.scale;
    const canvasY = (cy - view.y) / view.scale;
    handleViewChange(cx - canvasX * newScale, cy - canvasY * newScale, newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.1, view.scale * 0.8);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const canvasX = (cx - view.x) / view.scale;
    const canvasY = (cy - view.y) / view.scale;
    handleViewChange(cx - canvasX * newScale, cy - canvasY * newScale, newScale);
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <Toolbar
        boardName={board.name}
        onBoardNameChange={name => updateBoard(board.id, { name })}
        onBack={() => navigate('/')}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={() => handleViewChange(0, 0, 1)}
        onExport={() => exportBoard(board.id)}
        zoom={view.scale}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 overflow-hidden relative">
        <CanvasBoard
          viewX={view.x}
          viewY={view.y}
          viewScale={view.scale}
          cards={board.cards}
          onViewChange={handleViewChange}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          onBringToFront={handleBringToFront}
        />
        <CanvasDock
          onAddNote={handleAddNote}
          onAddTodo={handleAddTodo}
          onAddImage={handleAddImage}
        />
      </div>
    </div>
  );
};

export default CanvasPage;
