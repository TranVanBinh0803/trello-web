import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { login, LoginRequest, LoginResponse } from "~/apis/services/auth/Auth";
import { RestError, RestResponse } from "~/types/common";

export const useLogin = () =>
  useMutation<RestResponse<LoginResponse>, RestError, LoginRequest>({
    mutationFn: login,
    onSuccess: () => toast.success('Đăng nhập thành công'),
    onError: () => toast.error('Đăng nhập không thành công'),
  });
