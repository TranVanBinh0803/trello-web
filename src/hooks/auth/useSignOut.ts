import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "~/apis/services/auth/Auth";
import { accessTokenAtom, accessTokenExpiresAtAtom } from "~/atoms/AuthAtoms";


export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setAccessToken = useSetAtom(accessTokenAtom);
  const setAccessTokenExpiresAt = useSetAtom(accessTokenExpiresAtAtom);

  const signOutApi = useMutation<void, void, void>({
    mutationFn: signOut,
    onError: () => toast.error('Không lưu được nhật trình đăng xuất'),
  });

  return async () => {
    navigate('/login'); 
    queryClient.clear();
    await signOutApi.mutateAsync();
    setAccessToken(null); 
    setAccessTokenExpiresAt(null);
  };
}
