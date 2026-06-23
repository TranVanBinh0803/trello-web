import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  updateProfile,
  UpdateProfileRequest,
} from "~/apis/services/user/User";
import { RestError, RestResponse } from "~/types/common";
import { UserType } from "~/types/user";

export const useUpdateProfile = () =>
  useMutation<RestResponse<UserType>, RestError, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: () => toast.success("Profile updated"),
    onError: (error) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });
