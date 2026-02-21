import { z } from 'zod';

const CardColorSchema = z.enum(['yellow', 'pink', 'blue', 'green', 'purple', 'white', 'orange']);

const BaseCardSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  color: CardColorSchema,
  zIndex: z.number(),
});

const NoteCardSchema = BaseCardSchema.extend({
  type: z.literal('note'),
  content: z.string(),
});

const TodoItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean(),
});

const TodoCardSchema = BaseCardSchema.extend({
  type: z.literal('todo'),
  title: z.string(),
  items: z.array(TodoItemSchema),
});

const ImageCardSchema = BaseCardSchema.extend({
  type: z.literal('image'),
  src: z.string(),
  caption: z.string(),
});

export const CardSchema = z.discriminatedUnion('type', [
  NoteCardSchema,
  TodoCardSchema,
  ImageCardSchema,
]);

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  cards: z.array(CardSchema),
  viewX: z.number(),
  viewY: z.number(),
  viewScale: z.number(),
  color: z.string(),
});

// Derived TypeScript types — schemas are the single source of truth
export type CardColor = z.infer<typeof CardColorSchema>;
export type CardType = z.infer<typeof CardSchema>['type'];
export type TodoItem = z.infer<typeof TodoItemSchema>;
export type BaseCard = z.infer<typeof BaseCardSchema>;
export type NoteCard = z.infer<typeof NoteCardSchema>;
export type TodoCard = z.infer<typeof TodoCardSchema>;
export type ImageCard = z.infer<typeof ImageCardSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Board = z.infer<typeof BoardSchema>;
