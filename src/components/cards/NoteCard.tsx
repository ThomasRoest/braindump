import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnBulletList,
  BtnNumberedList,
  BtnUndo,
  BtnRedo,
  BtnClearFormatting,
  Separator,
  createButton,
} from 'react-simple-wysiwyg';
import type { MouseEvent } from 'react';
import { type NoteCard as NoteCardType } from '../../types';
import { cn } from '../../lib/utils';
import { cardColorStyles } from '../../lib/cardColors';

const handleEditorClick = (e: MouseEvent) => {
  if (!(e.metaKey || e.ctrlKey)) return;
  const anchor = (e.target as HTMLElement).closest('a');
  if (anchor?.href) {
    e.preventDefault();
    window.open(anchor.href, '_blank', 'noopener');
  }
};

const BtnLink = createButton('Link', '🔗', ({ $selection }) => {
  if ($selection?.nodeName === 'A') {
    document.execCommand('unlink');
    return;
  }

  const selection = window.getSelection();
  const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  const hasSelection = range && !range.collapsed;

  const url = prompt('URL', '');

  if (url && range) {
    selection!.removeAllRanges();
    selection!.addRange(range);

    if (hasSelection) {
      document.execCommand('createLink', false, url);
    } else {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.textContent = url;
      range.insertNode(anchor);
      range.setStartAfter(anchor);
      range.collapse(true);
      selection!.removeAllRanges();
      selection!.addRange(range);
    }
  }
});

interface NoteCardProps {
  card: NoteCardType;
  onUpdate: (updates: Partial<NoteCardType>) => void;
}

const NoteCard = ({ card, onUpdate }: NoteCardProps) => {
  const colors = cardColorStyles[card.color];

  return (
    <div
      className={cn('h-full flex flex-col note-card-editor', colors.bg, colors.text)}
      onMouseDown={e => e.stopPropagation()}
      onClick={handleEditorClick}
    >
      <EditorProvider>
        <Editor
          value={card.content}
          onChange={e => onUpdate({ content: e.target.value })}
          placeholder="Start typing..."
        >
          <Toolbar>
            <BtnUndo />
            <BtnRedo />
            <Separator />
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
            <BtnClearFormatting />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default NoteCard;
