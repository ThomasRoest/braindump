import { useState } from 'react';
import { Trash2, StickyNote, CheckSquare, ImageIcon } from 'lucide-react';
import { type Board } from '../types';
import { cn } from '../lib/utils';
import { formatDate } from '../lib/utils';
import ConfirmDialog from './ui/ConfirmDialog';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-150">
          <button
            onClick={e => { e.stopPropagation(); setShowDeleteConfirm(true); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/80 dark:bg-neutral-800/80 text-neutral-400 hover:text-red-500 transition-all duration-150 backdrop-blur-sm shadow-sm"
          >
            <Trash2 size={13} />
          </button>
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete board"
        message={`"${board.name || 'Untitled Board'}" and all its cards will be permanently deleted.`}
        onConfirm={onDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default BoardCard;
