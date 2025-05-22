import axios from "axios";
import { BoardType } from "~/types/board";
import { ColumnType, NewColumn } from "~/types/column";
import { API_ROOT } from "~/untils/constants";


export const fetchBoardDetailsAPI = async (boardId: string) => {
  const response = await axios.get<BoardType>(`${API_ROOT}/v1/boards/${boardId}`);
  return response.data;
};

export const createNewColumnAPI = async (newColumnData: NewColumn) => {
  const response = await axios.post<ColumnType>(`${API_ROOT}/v1/columns`, newColumnData);
  return response.data;
};
