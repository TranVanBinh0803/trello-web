import { atom } from "jotai";

export const onlineUserIdsAtom = atom<string[]>([]);
onlineUserIdsAtom.debugLabel = "onlineUserIdsAtom";
