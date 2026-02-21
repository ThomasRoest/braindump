import { ArrowLeft, ZoomIn, ZoomOut, Download, Sun, Moon, Maximize } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToolbarProps {
  boardName: string;
  onBoardNameChange: (name: string) => void;
  onBack: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onExport: () => void;
  zoom: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

const ToolbarButton = ({
  onClick,
  title,
  children,
  className,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      'w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-150',
      className
    )}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-700 mx-0.5" />;

const Toolbar = ({
  boardName,
  onBoardNameChange,
  onBack,
  onZoomIn,
  onZoomOut,
  onResetView,
  onExport,
  zoom,
  isDark,
  onToggleTheme,
}: ToolbarProps) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 select-none flex-shrink-0">
      <ToolbarButton onClick={onBack} title="Back to boards">
        <ArrowLeft size={15} />
      </ToolbarButton>

      <Divider />

      <input
        className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-transparent outline-none border-none min-w-0 max-w-[200px] hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-neutral-100 dark:focus:bg-neutral-800 px-2 py-1 rounded-lg transition-colors"
        value={boardName}
        onChange={e => onBoardNameChange(e.target.value)}
        placeholder="Untitled Board"
      />

      <div className="flex-1" />
      <Divider />

      <ToolbarButton onClick={onZoomOut} title="Zoom out (-)">
        <ZoomOut size={15} />
      </ToolbarButton>
      <button
        onClick={onResetView}
        title="Reset zoom"
        className="px-2 h-8 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors min-w-[52px]"
      >
        {Math.round(zoom * 100)}%
      </button>
      <ToolbarButton onClick={onZoomIn} title="Zoom in (+)">
        <ZoomIn size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={onResetView} title="Fit to screen">
        <Maximize size={14} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton onClick={onToggleTheme} title="Toggle theme">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </ToolbarButton>
      <ToolbarButton onClick={onExport} title="Export as JSON">
        <Download size={15} />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
