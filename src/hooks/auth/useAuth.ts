import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { accessTokenAtom, accessTokenExpiresAtAtom } from '~/atoms/AuthAtoms';

export function useAuth() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [accessTokenExpiresAt] = useAtom(accessTokenExpiresAtAtom);

  const isAuthenticated = () => accessToken && accessTokenExpiresAt;

  const isAccessTokenExpired = () => dayjs().isAfter(dayjs(accessTokenExpiresAt));

  return { isAuthenticated, isAccessTokenExpired };
}
