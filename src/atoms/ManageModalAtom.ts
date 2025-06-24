import { atom } from 'jotai';

export const manageModalAtom = atom<boolean | null>(null);
manageModalAtom.debugLabel = "manageModalAtom";