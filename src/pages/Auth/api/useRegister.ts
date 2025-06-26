import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  register,
  RegisterRequest,
  RegisterResponse,
} from "~/apis/services/auth/Auth";
import { RestError, RestResponse } from "~/types/common";

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation<RestResponse<RegisterResponse>, RestError, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Đăng ký tài khoản thành công");
      navigate("/login");
    },
    onError: () => toast.error("Đăng ký tài khoản thất bại"),
  });
};
