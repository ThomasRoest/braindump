import { useState, useEffect } from 'react';
import { Trash2, StickyNote, CheckSquare, ImageIcon, Check, X } from 'lucide-react';
import { type Board } from '../types';
import { cn } from '../lib/utils';
import { formatDate } from '../lib/utils';

interface BoardCardProps {
  board: Board;
  onClick: () => void;
  onDelete: () => void;
}

const TYPE_ICONS = {
  note: StickyNote,
  todo: CheckSquare,
  image: ImageIcon,
};

const BoardCard = ({ board, onClick, onDelete }: BoardCardProps) => {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(t);
  }, [confirming]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirming) {
      onDelete();
    } else {
      setConfirming(true);
    }
  };

  const cardTypeCounts = board.cards.reduce(
    (acc, card) => {
      acc[card.type] = (acc[card.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="h-36 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: `${board.color}18` }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {board.cards.length === 0 ? (
            <div
              className="w-12 h-12 rounded-2xl opacity-30"
              style={{ backgroundColor: board.color }}
            />
          ) : (
            <div className="relative w-32 h-20">
              {board.cards.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-xl border border-white/50 dark:border-neutral-700/50 shadow-sm"
                  style={{
                    backgroundColor: `${board.color}${['40', '30', '20'][i]}`,
                    width: 80 - i * 8,
                    height: 52 - i * 4,
                    left: i * 10,
                    top: i * 6,
                    transform: `rotate(${[-3, 0, 3][i]}deg)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: board.color }}
        />

        <div className={cn(
          'absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150',
          confirming && 'opacity-100'
        )}>
          {confirming ? (
            <>
              <span className="text-[10px] font-medium text-red-500 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm">
                Delete?
              </span>
              <button
                onClick={handleDeleteClick}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-red-500 text-white shadow-sm hover:bg-red-600 transition-colors"
              >
                <Check size={11} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setConfirming(false); }}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-white/90 dark:bg-neutral-800/90 text-neutral-500 backdrop-blur-sm shadow-sm hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                <X size={11} />
              </button>
            </>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/80 dark:bg-neutral-800/80 text-neutral-400 hover:text-red-500 transition-all duration-150 backdrop-blur-sm shadow-sm"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3
          className={cn(
            'font-semibold text-neutral-900 dark:text-neutral-100 text-sm truncate'
          )}
        >
          {board.name || 'Untitled Board'}
        </h3>
        {board.description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
            {board.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {Object.entries(cardTypeCounts).map(([type, count]) => {
              const Icon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
              return Icon ? (
                <div key={type} className="flex items-center gap-0.5 text-neutral-400">
                  <Icon size={11} />
                  <span className="text-[10px]">{count}</span>
                </div>
              ) : null;
            })}
            {board.cards.length === 0 && (
              <span className="text-xs text-neutral-400">Empty board</span>
            )}
          </div>
          <span className="text-[10px] text-neutral-400">{formatDate(board.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
