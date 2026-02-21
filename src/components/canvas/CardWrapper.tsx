import { useRef, useState } from 'react';
import { GripVertical, X, Palette } from 'lucide-react';
import { type Card, type CardColor } from '../../types';
import { cn } from '../../lib/utils';
import { cardColorStyles, COLOR_DOT_CLASSES, CARD_COLORS } from '../../lib/cardColors';

interface CardWrapperProps {
  card: Card;
  scale: number;
  isSelected: boolean;
  onUpdate: (updates: Partial<Card>) => void;
  onDelete: () => void;
  onSelect: () => void;
  children: React.ReactNode;
}

const CardWrapper = ({ card, scale, isSelected, onUpdate, onDelete, onSelect, children }: CardWrapperProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colors = cardColorStyles[card.color];

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; cardX: number; cardY: number } | null>(null);
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; width: number; height: number } | null>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setShowColorPicker(false);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cardX: card.x,
      cardY: card.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = (e.clientX - dragStartRef.current.mouseX) / scale;
      const dy = (e.clientY - dragStartRef.current.mouseY) / scale;
      onUpdate({ x: dragStartRef.current.cardX + dx, y: dragStartRef.current.cardY + dy });
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: card.width,
      height: card.height,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;
      const dx = (e.clientX - resizeStartRef.current.mouseX) / scale;
      const dy = (e.clientY - resizeStartRef.current.mouseY) / scale;
      onUpdate({
        width: Math.max(160, resizeStartRef.current.width + dx),
        height: Math.max(100, resizeStartRef.current.height + dy),
      });
    };

    const handleMouseUp = () => {
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleCardMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setShowColorPicker(false);
  };

  const handleColorSelect = (color: CardColor) => {
    onUpdate({ color });
    setShowColorPicker(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: card.x,
        top: card.y,
        width: card.width,
        height: card.height + 32,
        zIndex: card.zIndex,
      }}
      className="group"
      onMouseDown={handleCardMouseDown}
    >
      <div
        className={cn(
          'flex items-center gap-1 px-2 h-8 rounded-t-xl border border-b-0 cursor-grab active:cursor-grabbing',
          colors.headerBg,
          colors.border
        )}
        onMouseDown={handleDragStart}
      >
        <GripVertical size={13} className={cn(colors.text, 'opacity-30')} />
        <div className="flex-1" />

        <div className="relative" onMouseDown={e => e.stopPropagation()}>
          <button
            onClick={() => setShowColorPicker(v => !v)}
            className={cn(
              'p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
              colors.text,
              'opacity-50 hover:opacity-100'
            )}
          >
            <Palette size={12} />
          </button>
          {showColorPicker && (
            <div className="absolute bottom-full right-0 mb-1 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-700 p-2 flex gap-1.5 z-[100]">
              {CARD_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    'w-5 h-5 rounded-full transition-transform hover:scale-110 border',
                    COLOR_DOT_CLASSES[color],
                    card.color === color && 'ring-2 ring-offset-1 ring-indigo-500'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          onMouseDown={e => e.stopPropagation()}
          className={cn(
            'p-1 rounded hover:bg-red-500/20 hover:text-red-500 transition-colors',
            colors.text,
            'opacity-50 hover:opacity-100'
          )}
        >
          <X size={12} />
        </button>
      </div>

      <div
        className={cn(
          'w-full rounded-b-xl border overflow-hidden shadow-lg transition-shadow',
          colors.border,
          isSelected && 'shadow-xl ring-2 ring-indigo-500/40'
        )}
        style={{ height: card.height }}
      >
        {children}
      </div>

      <div
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        onMouseDown={handleResizeStart}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" className="text-neutral-400">
          <path d="M0 8L8 0M3 8L8 3M6 8L8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

export default CardWrapper;
