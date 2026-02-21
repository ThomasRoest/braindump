import { useRef } from 'react';
import { type NoteCard as NoteCardType } from '../../types';
import { cn } from '../../lib/utils';
import { cardColorStyles } from '../../lib/cardColors';

interface NoteCardProps {
  card: NoteCardType;
  onUpdate: (updates: Partial<NoteCardType>) => void;
}

const NoteCard = ({ card, onUpdate }: NoteCardProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const colors = cardColorStyles[card.color];

  return (
    <div className={cn('h-full flex flex-col', colors.bg)}>
      <textarea
        ref={textareaRef}
        className={cn(
          'flex-1 w-full resize-none bg-transparent outline-none text-sm leading-relaxed p-4',
          colors.text,
          colors.placeholder
        )}
        value={card.content}
        onChange={e => onUpdate({ content: e.target.value })}
        placeholder="Start typing..."
        onMouseDown={e => e.stopPropagation()}
      />
    </div>
  );
};

export default NoteCard;
