import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createPrivateUpgradePayment,
  createPrivateUpgradePaymentApiSpec,
  PrivateUpgradePaymentResponse,
} from "~/apis/services/board/Board";
import { RestError, RestResponse } from "~/types/common";
import { getMutationErrorMessage } from "~/untils/mutations";

export const useCreatePrivateUpgradePayment = () => {
  return useMutation<RestResponse<PrivateUpgradePaymentResponse>, RestError, string>(
    {
      mutationKey: [createPrivateUpgradePaymentApiSpec.name],
      mutationFn: createPrivateUpgradePayment,
      onSuccess: (response) => {
        window.location.assign(response.data.paymentUrl);
      },
      onError: (error) => {
        toast.error(
          getMutationErrorMessage(error, "Failed to create payment link.")
        );
      },
    }
  );
};
