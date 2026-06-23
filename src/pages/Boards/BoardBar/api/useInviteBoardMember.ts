import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  inviteBoardMember,
  InviteBoardMemberRequest,
} from "~/apis/services/board/Board";
import { BoardInvitationType } from "~/types/boardInvitation";
import { RestError, RestResponse } from "~/types/common";

export const useInviteBoardMember = (boardId: string) => {
  return useMutation<
    RestResponse<BoardInvitationType>,
    RestError,
    InviteBoardMemberRequest
  >({
    mutationFn: (request) => inviteBoardMember(boardId, request),
    onSuccess: () => {
      toast.success("Invitation sent");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send invitation");
    },
  });
};
