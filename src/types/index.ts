export type CardColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'white' | 'orange';
export type CardType = 'note' | 'todo' | 'image';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export interface BaseCard {
  id: string;
  type: CardType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: CardColor;
  zIndex: number;
}

export interface NoteCard extends BaseCard {
  type: 'note';
  content: string;
}

export interface TodoCard extends BaseCard {
  type: 'todo';
  title: string;
  items: TodoItem[];
}

export interface ImageCard extends BaseCard {
  type: 'image';
  src: string;
  caption: string;
}

export type Card = NoteCard | TodoCard | ImageCard;

export interface Board {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  cards: Card[];
  viewX: number;
  viewY: number;
  viewScale: number;
  color: string;
}
