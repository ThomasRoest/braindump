import { describe, expect, test } from 'vitest';
import { BoardSchema, CardSchema } from '../lib/boardSchema';

const baseCard = {
  id: 'card-1',
  x: 10,
  y: 20,
  width: 200,
  height: 150,
  color: 'yellow' as const,
  zIndex: 1,
};

const validBoard = {
  id: 'board-1',
  name: 'My Board',
  description: 'A test board',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  cards: [],
  viewX: 0,
  viewY: 0,
  viewScale: 1,
  color: '#ff0000',
};

describe('CardSchema', () => {
  describe('NoteCard', () => {
    test('accepts a valid note card', () => {
      const card = { ...baseCard, type: 'note', content: 'Hello world' };
      expect(CardSchema.safeParse(card).success).toBe(true);
    });

    test('rejects note card missing content', () => {
      const card = { ...baseCard, type: 'note' };
      expect(CardSchema.safeParse(card).success).toBe(false);
    });
  });

  describe('TodoCard', () => {
    test('accepts a valid todo card', () => {
      const card = {
        ...baseCard,
        type: 'todo',
        title: 'My List',
        items: [{ id: 'item-1', text: 'Do thing', done: false }],
      };
      expect(CardSchema.safeParse(card).success).toBe(true);
    });

    test('accepts a todo card with empty items', () => {
      const card = { ...baseCard, type: 'todo', title: 'Empty', items: [] };
      expect(CardSchema.safeParse(card).success).toBe(true);
    });

    test('rejects todo card with invalid item shape', () => {
      const card = {
        ...baseCard,
        type: 'todo',
        title: 'My List',
        items: [{ id: 'item-1', text: 'Do thing' }], // missing done
      };
      expect(CardSchema.safeParse(card).success).toBe(false);
    });
  });

  describe('ImageCard', () => {
    test('accepts a valid image card', () => {
      const card = { ...baseCard, type: 'image', src: 'data:image/png;base64,abc', caption: '' };
      expect(CardSchema.safeParse(card).success).toBe(true);
    });

    test('rejects image card missing src', () => {
      const card = { ...baseCard, type: 'image', caption: 'A photo' };
      expect(CardSchema.safeParse(card).success).toBe(false);
    });
  });

  test('rejects unknown card type', () => {
    const card = { ...baseCard, type: 'unknown', content: 'x' };
    expect(CardSchema.safeParse(card).success).toBe(false);
  });

  test('rejects invalid color', () => {
    const card = { ...baseCard, type: 'note', content: 'x', color: 'red' };
    expect(CardSchema.safeParse(card).success).toBe(false);
  });

  test('accepts all valid colors', () => {
    const colors = ['yellow', 'pink', 'blue', 'green', 'purple', 'white', 'orange'] as const;
    for (const color of colors) {
      const card = { ...baseCard, type: 'note', content: 'x', color };
      expect(CardSchema.safeParse(card).success).toBe(true);
    }
  });
});

describe('BoardSchema', () => {
  test('accepts a valid board with no cards', () => {
    expect(BoardSchema.safeParse(validBoard).success).toBe(true);
  });

  test('accepts a board with mixed card types', () => {
    const board = {
      ...validBoard,
      cards: [
        { ...baseCard, id: 'c1', type: 'note', content: 'Note text' },
        { ...baseCard, id: 'c2', type: 'todo', title: 'Todos', items: [] },
        { ...baseCard, id: 'c3', type: 'image', src: 'data:image/png;base64,abc', caption: '' },
      ],
    };
    const result = BoardSchema.safeParse(board);
    expect(result.success).toBe(true);
  });

  test('rejects board missing required fields', () => {
    const withoutName = {
      id: validBoard.id,
      description: validBoard.description,
      createdAt: validBoard.createdAt,
      updatedAt: validBoard.updatedAt,
      cards: validBoard.cards,
      viewX: validBoard.viewX,
      viewY: validBoard.viewY,
      viewScale: validBoard.viewScale,
      color: validBoard.color,
    };
    expect(BoardSchema.safeParse(withoutName).success).toBe(false);
  });

  test('rejects board with invalid card inside', () => {
    const board = {
      ...validBoard,
      cards: [{ ...baseCard, type: 'note' }], // missing content
    };
    expect(BoardSchema.safeParse(board).success).toBe(false);
  });

  test('returns parsed data with correct types', () => {
    const board = {
      ...validBoard,
      cards: [{ ...baseCard, type: 'note', content: 'Hello' }],
    };
    const result = BoardSchema.safeParse(board);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.cards[0].type).toBe('note');
  });

  describe('import round-trip', () => {
    test('parses JSON-serialised board back correctly', () => {
      const board = {
        ...validBoard,
        cards: [
          { ...baseCard, id: 'c1', type: 'note', content: 'Round-trip' },
          {
            ...baseCard,
            id: 'c2',
            type: 'todo',
            title: 'List',
            items: [{ id: 'i1', text: 'Item', done: true }],
          },
        ],
      };
      const json = JSON.stringify(board);
      const result = BoardSchema.safeParse(JSON.parse(json));
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.id).toBe('board-1');
      expect(result.data.cards).toHaveLength(2);
    });

    test('rejects corrupted JSON import (extra unknown card type)', () => {
      const board = {
        ...validBoard,
        cards: [{ ...baseCard, type: 'drawing', points: [] }],
      };
      const result = BoardSchema.safeParse(JSON.parse(JSON.stringify(board)));
      expect(result.success).toBe(false);
    });

    test('rejects import with missing board-level field', () => {
      const withoutViewScale = {
        id: validBoard.id,
        name: validBoard.name,
        description: validBoard.description,
        createdAt: validBoard.createdAt,
        updatedAt: validBoard.updatedAt,
        cards: validBoard.cards,
        viewX: validBoard.viewX,
        viewY: validBoard.viewY,
        color: validBoard.color,
      };
      const result = BoardSchema.safeParse(JSON.parse(JSON.stringify(withoutViewScale)));
      expect(result.success).toBe(false);
    });
  });
});
