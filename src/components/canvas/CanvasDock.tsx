import { StickyNote, CheckSquare, ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
  shortcut: string;
}

interface CanvasDockProps {
  onAddNote: () => void;
  onAddTodo: () => void;
  onAddImage: () => void;
}

const CanvasDock = ({ onAddNote, onAddTodo, onAddImage }: CanvasDockProps) => {
  const items: DockItem[] = [
    {
      icon: <StickyNote size={20} />,
      label: 'Note',
      onClick: onAddNote,
      color: 'hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50 dark:hover:text-amber-400',
      shortcut: 'N',
    },
    {
      icon: <CheckSquare size={20} />,
      label: 'Todo',
      onClick: onAddTodo,
      color: 'hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/50 dark:hover:text-sky-400',
      shortcut: 'T',
    },
    {
      icon: <ImageIcon size={20} />,
      label: 'Image',
      onClick: onAddImage,
      color: 'hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950/50 dark:hover:text-violet-400',
      shortcut: 'I',
    },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="pointer-events-auto flex items-stretch gap-0.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-200/80 dark:border-neutral-700/80 p-1.5">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-stretch">
            <button
              onClick={item.onClick}
              title={`${item.label} (${item.shortcut})`}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 px-5 py-3 rounded-xl transition-all duration-150 text-neutral-500 dark:text-neutral-400 active:scale-95 group',
                item.color
              )}
            >
              <span className="transition-transform duration-150 group-hover:scale-110">
                {item.icon}
              </span>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </button>
            {i < items.length - 1 && (
              <div className="w-px bg-neutral-100 dark:bg-neutral-800 my-2 mx-0.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanvasDock;
