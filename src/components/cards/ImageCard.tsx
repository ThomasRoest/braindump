import { useRef } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { type ImageCard as ImageCardType } from '../../types';
import { cn } from '../../lib/utils';

interface ImageCardProps {
  card: ImageCardType;
  onUpdate: (updates: Partial<ImageCardType>) => void;
}

const ImageCard = ({ card, onUpdate }: ImageCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ src: reader.result as string, caption: file.name.replace(/\.[^/.]+$/, '') });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ src: reader.result as string, caption: file.name.replace(/\.[^/.]+$/, '') });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full flex flex-col bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      {card.src ? (
        <>
          <div
            className="flex-1 overflow-hidden cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onMouseDown={e => e.stopPropagation()}
          >
            <img src={card.src} alt={card.caption} className="w-full h-full object-cover" />
          </div>
          <div className="px-3 py-2 bg-neutral-200 dark:bg-neutral-900 flex-shrink-0">
            <input
              className="w-full bg-transparent text-xs text-neutral-600 dark:text-neutral-400 outline-none placeholder-neutral-400 dark:placeholder-neutral-600"
              value={card.caption}
              onChange={e => onUpdate({ caption: e.target.value })}
              onMouseDown={e => e.stopPropagation()}
              placeholder="Add a caption..."
            />
          </div>
        </>
      ) : (
        <button
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-3 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-xl m-2'
          )}
          onClick={() => inputRef.current?.click()}
          onMouseDown={e => e.stopPropagation()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={handleDrop}
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
            <ImageIcon size={20} className="text-neutral-400 dark:text-neutral-500" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium">Click to upload</p>
            <p className="text-xs opacity-50 mt-0.5">or drag & drop</p>
          </div>
          <Upload size={14} className="opacity-40" />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageCard;
