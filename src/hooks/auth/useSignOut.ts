import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "~/apis/services/auth/Auth";
import { accessTokenAtom, accessTokenExpiresAtAtom } from "~/atoms/AuthAtoms";
import { RestResponse } from "~/types/common";


export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setAccessToken = useSetAtom(accessTokenAtom);
  const setAccessTokenExpiresAt = useSetAtom(accessTokenExpiresAtAtom);

  const logoutApi = useMutation<RestResponse<any>, void, void>({
    mutationFn: logout,
    onError: () => toast.error('Không lưu được nhật trình đăng xuất'),
  });

  return async () => {
    navigate('/login'); 
    queryClient.clear();
    await logoutApi.mutateAsync();
    setAccessToken(null); 
    setAccessTokenExpiresAt(null);
  };
}
