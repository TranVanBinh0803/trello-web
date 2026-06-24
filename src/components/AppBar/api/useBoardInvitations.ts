import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getMyBoardsApiSpec } from "~/apis/services/board/Board";
import {
  acceptBoardInvitation,
  acceptBoardInvitationApiSpec,
  getBoardInvitations,
  getBoardInvitationsApiSpec,
  rejectBoardInvitation,
  rejectBoardInvitationApiSpec,
} from "~/apis/services/user/User";
import { BoardInvitationType } from "~/types/boardInvitation";
import { RestError, RestResponse } from "~/types/common";

const boardInvitationsQueryKey = [getBoardInvitationsApiSpec.name];

export const useBoardInvitations = (enabled: boolean) =>
  useQuery<RestResponse<BoardInvitationType[]>, RestError>({
    queryKey: boardInvitationsQueryKey,
    queryFn: getBoardInvitations,
    enabled,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
  });

export const useAcceptBoardInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<RestResponse<BoardInvitationType>, RestError, string>({
    mutationKey: [acceptBoardInvitationApiSpec.name],
    mutationFn: acceptBoardInvitation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardInvitationsQueryKey });
      await queryClient.invalidateQueries({ queryKey: [getMyBoardsApiSpec.name] });
      await queryClient.refetchQueries({
        queryKey: [getMyBoardsApiSpec.name],
        type: "active",
      });
      toast.success("Board invitation accepted");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to accept board invitation");
    },
  });
};

export const useRejectBoardInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<RestResponse<BoardInvitationType>, RestError, string>({
    mutationKey: [rejectBoardInvitationApiSpec.name],
    mutationFn: rejectBoardInvitation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardInvitationsQueryKey });
      toast.success("Board invitation rejected");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to reject board invitation");
    },
  });
};
