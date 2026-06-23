import { useMutation } from "@tanstack/react-query";
import {
  resetPassword,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "~/apis/services/auth/Auth";
import { RestError, RestResponse } from "~/types/common";

export const useResetPassword = () =>
  useMutation<RestResponse<ResetPasswordResponse>, RestError, ResetPasswordRequest>({
    mutationFn: resetPassword,
  });
