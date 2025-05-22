import { atomWithStorage } from 'jotai/utils';

export const accessTokenAtom = atomWithStorage<string | null>('access-token', null, undefined, {
  getOnInit: true,
});

export const accessTokenExpiresAtAtom = atomWithStorage<string | null>(
  'access-token-expires-at',
  null,
  undefined,
  {
    getOnInit: true,
  }
);
