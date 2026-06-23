import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "~/apis/services/auth/Auth";
import { RestError, RestResponse } from "~/types/common";

export const useForgotPassword = () =>
  useMutation<
    RestResponse<ForgotPasswordResponse>,
    RestError,
    ForgotPasswordRequest
  >({
    mutationFn: forgotPassword,
  });
