import { atomWithStorage } from 'jotai/utils';
import { UserType } from '~/types/user';

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

export const user = atomWithStorage<UserType | null>('user', null, undefined, {
  getOnInit: true,
});
