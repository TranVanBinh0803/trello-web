import { atom } from 'jotai';
import { BoardType } from '~/types/board';

export const boardDataAtom = atom<BoardType | null>(null);
boardDataAtom.debugLabel = "boardDataAtom";