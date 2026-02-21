import { useRef, useState, useEffect, useCallback } from 'react';
import { type Card, type NoteCard as NoteCardType, type TodoCard as TodoCardType, type ImageCard as ImageCardType } from '../../types';
import CardWrapper from './CardWrapper';
import NoteCard from '../cards/NoteCard';
import TodoCard from '../cards/TodoCard';
import ImageCard from '../cards/ImageCard';

interface CanvasBoardProps {
  viewX: number;
  viewY: number;
  viewScale: number;
  cards: Card[];
  onViewChange: (x: number, y: number, scale: number) => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard: (cardId: string) => void;
  onBringToFront: (cardId: string) => void;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 4;

const CanvasBoard = ({
  viewX,
  viewY,
  viewScale,
  cards,
  onViewChange,
  onUpdateCard,
  onDeleteCard,
  onBringToFront,
}: CanvasBoardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Non-passive wheel listener — re-registers when view/callback changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, viewScale * factor));
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const canvasX = (mouseX - viewX) / viewScale;
        const canvasY = (mouseY - viewY) / viewScale;
        onViewChange(mouseX - canvasX * newScale, mouseY - canvasY * newScale, newScale);
      } else {
        onViewChange(viewX - e.deltaX, viewY - e.deltaY, viewScale);
      }
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [viewX, viewY, viewScale, onViewChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setSelectedCardId(null);
    isPanningRef.current = true;
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: viewX,
      offsetY: viewY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanningRef.current) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    onViewChange(panStartRef.current.offsetX + dx, panStartRef.current.offsetY + dy, viewScale);
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
  };

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setSelectedCardId(null);
    }
  }, []);

  const renderCardContent = (card: Card) => {
    switch (card.type) {
      case 'note':
        return (
          <NoteCard
            card={card as NoteCardType}
            onUpdate={updates => onUpdateCard(card.id, updates)}
          />
        );
      case 'todo':
        return (
          <TodoCard
            card={card as TodoCardType}
            onUpdate={updates => onUpdateCard(card.id, updates)}
          />
        );
      case 'image':
        return (
          <ImageCard
            card={card as ImageCardType}
            onUpdate={updates => onUpdateCard(card.id, updates)}
          />
        );

    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-default canvas-bg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          transform: `translate(${viewX}px, ${viewY}px) scale(${viewScale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {cards.map(card => (
          <CardWrapper
            key={card.id}
            card={card}
            scale={viewScale}
            isSelected={selectedCardId === card.id}
            onUpdate={updates => onUpdateCard(card.id, updates)}
            onDelete={() => onDeleteCard(card.id)}
            onSelect={() => {
              setSelectedCardId(card.id);
              onBringToFront(card.id);
            }}
          >
            {renderCardContent(card)}
          </CardWrapper>
        ))}
      </div>
    </div>
  );
};

export default CanvasBoard;
