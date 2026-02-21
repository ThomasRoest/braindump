import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sun, Moon, Brain, Layers, Upload } from 'lucide-react';
import { useBoards } from '../store/boards';
import { useTheme } from '../store/theme';
import { type Board } from '../types';
import BoardCard from '../components/BoardCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const BOARD_COLORS = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
];

const BoardsOverview = () => {
  const navigate = useNavigate();
  const { boards, createBoard, deleteBoard, importBoard } = useBoards();
  const { isDark, toggleTheme } = useTheme();

  const [isCreating, setIsCreating] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0]);

  const [importCandidate, setImportCandidate] = useState<Board | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const board = JSON.parse(reader.result as string) as Board;
        if (!board.id || !board.name) throw new Error('Invalid board file');
        setImportCandidate(board);
      } catch {
        alert('Failed to parse board file. Make sure it is a valid braindump JSON export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!importCandidate) return;
    importBoard(importCandidate);
    navigate(`/board/${importCandidate.id}`);
    setImportCandidate(null);
  };

  const handleCreate = () => {
    if (!boardName.trim()) return;
    const board = createBoard(boardName.trim(), boardDescription.trim(), selectedColor);
    setIsCreating(false);
    setBoardName('');
    setBoardDescription('');
    setSelectedColor(BOARD_COLORS[0]);
    navigate(`/board/${board.id}`);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setBoardName('');
    setBoardDescription('');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Brain size={15} className="text-white" />
            </div>
            <span className="font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              braindump
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => importInputRef.current?.click()}
              title="Import board from JSON"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <Upload size={15} />
            </button>
            <input ref={importInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
            <Button size="sm" onClick={() => setIsCreating(true)}>
              <Plus size={14} />
              New Board
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center mb-4">
              <Layers size={28} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No boards yet
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-xs">
              Create your first board to start brainstorming, organizing ideas, and capturing thoughts.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} />
              Create your first board
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  My Boards
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {boards.length} {boards.length === 1 ? 'board' : 'boards'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setIsCreating(true)}
                className="group h-[168px] rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-indigo-500"
              >
                <div className="w-9 h-9 rounded-xl border-2 border-current flex items-center justify-center transition-transform group-hover:scale-110">
                  <Plus size={18} />
                </div>
                <span className="text-xs font-medium">New Board</span>
              </button>

              {boards.map(board => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onClick={() => navigate(`/board/${board.id}`)}
                  onDelete={() => deleteBoard(board.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Modal isOpen={!!importCandidate} onClose={() => setImportCandidate(null)} title="Import board">
        {importCandidate && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {boards.some(b => b.id === importCandidate.id) ? (
                <>
                  A board named <span className="font-semibold text-neutral-900 dark:text-neutral-100">{importCandidate.name}</span> already exists. Importing will <span className="font-semibold text-red-500">overwrite</span> it with the contents of the file.
                </>
              ) : (
                <>
                  Import <span className="font-semibold text-neutral-900 dark:text-neutral-100">{importCandidate.name}</span> with {importCandidate.cards.length} {importCandidate.cards.length === 1 ? 'card' : 'cards'}?
                </>
              )}
            </p>
            <div className="flex gap-2 pt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setImportCandidate(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirmImport}>
                Import
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isCreating} onClose={handleCloseModal} title="Create new board">
        <div className="flex flex-col gap-4">
          <Input
            label="Board name"
            id="board-name"
            placeholder="e.g. Project Ideas, Weekly Planning..."
            value={boardName}
            onChange={e => setBoardName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
          />

          <Input
            label="Description (optional)"
            id="board-description"
            placeholder="What's this board for?"
            value={boardDescription}
            onChange={e => setBoardDescription(e.target.value)}
          />

          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {BOARD_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                  style={{
                    backgroundColor: color,
                    outline: selectedColor === color ? `2px solid ${color}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="secondary" className="flex-1" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleCreate} disabled={!boardName.trim()}>
              Create Board
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BoardsOverview;
