import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { type TodoCard as TodoCardType, type TodoItem } from '../../types';
import { cn } from '../../lib/utils';
import { cardColorStyles } from '../../lib/cardColors';
import { generateId } from '../../lib/utils';

interface TodoCardProps {
  card: TodoCardType;
  onUpdate: (updates: Partial<TodoCardType>) => void;
}

const TodoCard = ({ card, onUpdate }: TodoCardProps) => {
  const [newItemText, setNewItemText] = useState('');
  const colors = cardColorStyles[card.color];

  const addItem = () => {
    if (!newItemText.trim()) return;
    const newItem: TodoItem = {
      id: generateId(),
      text: newItemText.trim(),
      done: false,
    };
    onUpdate({ items: [...card.items, newItem] });
    setNewItemText('');
  };

  const toggleItem = (itemId: string) => {
    onUpdate({
      items: card.items.map(item => (item.id === itemId ? { ...item, done: !item.done } : item)),
    });
  };

  const deleteItem = (itemId: string) => {
    onUpdate({ items: card.items.filter(item => item.id !== itemId) });
  };

  const updateItemText = (itemId: string, text: string) => {
    onUpdate({
      items: card.items.map(item => (item.id === itemId ? { ...item, text } : item)),
    });
  };

  const doneCount = card.items.filter(i => i.done).length;

  return (
    <div className={cn('h-full flex flex-col', colors.bg)}>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {card.items.length > 0 && (
          <div className={cn('text-xs opacity-50 text-right px-1', colors.text)}>
            {doneCount}/{card.items.length}
          </div>
        )}
        {card.items.map(item => (
          <div key={item.id} className="flex items-center gap-2 group rounded-md px-1 py-0.5 hover:bg-black/5 dark:hover:bg-white/5">
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => toggleItem(item.id)}
              className={cn(
                'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all',
                item.done
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-neutral-400 dark:border-neutral-500 hover:border-indigo-500'
              )}
            >
              {item.done && <Check size={9} className="text-white" strokeWidth={3} />}
            </button>
            <input
              className={cn(
                'flex-1 bg-transparent text-xs outline-none leading-relaxed min-w-0',
                colors.text,
                item.done && 'line-through opacity-50'
              )}
              value={item.text}
              onChange={e => updateItemText(item.id, e.target.value)}
              onMouseDown={e => e.stopPropagation()}
            />
            <button
              onClick={() => deleteItem(item.id)}
              onMouseDown={e => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-400 transition-opacity flex-shrink-0"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>

      <div className={cn('px-3 py-2 border-t', colors.border)}>
        <div className="flex items-center gap-2">
          <Plus size={12} className={cn('opacity-40 flex-shrink-0', colors.text)} />
          <input
            className={cn('flex-1 bg-transparent text-xs outline-none', colors.text, colors.placeholder)}
            value={newItemText}
            onChange={e => setNewItemText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addItem();
            }}
            onMouseDown={e => e.stopPropagation()}
            placeholder="Add item..."
          />
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
