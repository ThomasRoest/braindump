import { type CardColor } from '../types';

export interface CardColorStyle {
  bg: string;
  text: string;
  border: string;
  headerBg: string;
  placeholder: string;
}

export const cardColorStyles: Record<CardColor, CardColorStyle> = {
  yellow: {
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    text: 'text-amber-900 dark:text-amber-100',
    border: 'border-amber-200 dark:border-amber-800',
    headerBg: 'bg-amber-100 dark:bg-amber-900/60',
    placeholder: 'placeholder-amber-400 dark:placeholder-amber-600',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950/60',
    text: 'text-pink-900 dark:text-pink-100',
    border: 'border-pink-200 dark:border-pink-800',
    headerBg: 'bg-pink-100 dark:bg-pink-900/60',
    placeholder: 'placeholder-pink-400 dark:placeholder-pink-600',
  },
  blue: {
    bg: 'bg-sky-50 dark:bg-sky-950/60',
    text: 'text-sky-900 dark:text-sky-100',
    border: 'border-sky-200 dark:border-sky-800',
    headerBg: 'bg-sky-100 dark:bg-sky-900/60',
    placeholder: 'placeholder-sky-400 dark:placeholder-sky-600',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-900 dark:text-emerald-100',
    border: 'border-emerald-200 dark:border-emerald-800',
    headerBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    placeholder: 'placeholder-emerald-400 dark:placeholder-emerald-600',
  },
  purple: {
    bg: 'bg-violet-50 dark:bg-violet-950/60',
    text: 'text-violet-900 dark:text-violet-100',
    border: 'border-violet-200 dark:border-violet-800',
    headerBg: 'bg-violet-100 dark:bg-violet-900/60',
    placeholder: 'placeholder-violet-400 dark:placeholder-violet-600',
  },
  white: {
    bg: 'bg-white dark:bg-neutral-800',
    text: 'text-neutral-900 dark:text-neutral-100',
    border: 'border-neutral-200 dark:border-neutral-700',
    headerBg: 'bg-neutral-50 dark:bg-neutral-800/80',
    placeholder: 'placeholder-neutral-400 dark:placeholder-neutral-500',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/60',
    text: 'text-orange-900 dark:text-orange-100',
    border: 'border-orange-200 dark:border-orange-800',
    headerBg: 'bg-orange-100 dark:bg-orange-900/60',
    placeholder: 'placeholder-orange-400 dark:placeholder-orange-600',
  },
};

export const COLOR_DOT_CLASSES: Record<CardColor, string> = {
  white: 'bg-white border-2 border-neutral-300 dark:border-neutral-500',
  yellow: 'bg-amber-300',
  pink: 'bg-pink-300',
  blue: 'bg-sky-300',
  green: 'bg-emerald-300',
  purple: 'bg-violet-300',
  orange: 'bg-orange-300',
};

export const CARD_COLORS: CardColor[] = ['white', 'yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
