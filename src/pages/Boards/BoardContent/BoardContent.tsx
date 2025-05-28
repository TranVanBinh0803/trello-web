import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { mapOrder } from "~/untils/sorts";
import ListColumns from "./ListColumns/ListColumns";
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  UniqueIdentifier,
  Active,
  Over,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/untils/formatters";
import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensors";
import { ColumnType } from "~/types/column";
import { CardType } from "~/types/card";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { useAtomValue } from "jotai";
import { boardDataAtom } from "~/atoms/BoardAtom";
import { useDragColumn } from "../api/useDragColumn";
import { useDragCard } from "../api/useDragCard";
import { useDragCardBetweenColumn } from "../api/useDragCardBetweenColumn";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
} as const;

type ActiveDragItemType =
  (typeof ACTIVE_DRAG_ITEM_TYPE)[keyof typeof ACTIVE_DRAG_ITEM_TYPE];

const BoardContent: React.FC<any> = ({ isFetching }) => {
  const board = useAtomValue(boardDataAtom);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>([]);
  const [activeDragItemId, setActiveDragItemId] =
    useState<UniqueIdentifier | null>(null);
  const [activeDragItemType, setActiveDragItemType] =
    useState<ActiveDragItemType | null>(null);
  const [activeDragItemData, setActiveDragItemData] = useState<any>(null);
  const [oldColumn, setOldColumn] = useState<ColumnType | null>(null);
  const [dragCardColumnId, setDragCardColumnId] = useState<string>("");

  const dragColumnMutation = useDragColumn(board?._id || "");
  const dragCardMutation = useDragCard(dragCardColumnId);
  const dragCardBetweenColumnMutation = useDragCardBetweenColumn();

  useEffect(() => {
    if (board?.columns && board?.columnOrderIds) {
      setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, "_id"));
    }
  }, [board]);

  if (!board) return null;

  const findColumnByCardId = (cardId: string): ColumnType | undefined => {
    return orderedColumns.find((column) =>
      column?.cards?.some((card) => card._id === cardId)
    );
  };

  const moveCardBetweenDifferentColumns = (
    overColumn: ColumnType,
    overCardId: string,
    active: Active,
    over: Over,
    activeColumn: ColumnType,
    activeDraggingCardId: string,
    activeDraggingCardData: CardType
  ) => {
    return new Promise<{
      newActiveColumnCardOrderIds: string[];
      newOverColumnCardOrderIds: string[];
    }>((resolve) => {
      setOrderedColumns((prevColumns) => {
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );

        let newCardIndex: number;
        const isBellowOverItem =
          active.rect.current?.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBellowOverItem ? 1 : 0;
        newCardIndex =
          overCardIndex !== undefined && overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length ?? 0;

        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id
        );
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id
        );

        if (nextActiveColumn) {
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );
          if (isEmpty(nextActiveColumn.cards)) {
            nextActiveColumn.cards = [
              generatePlaceholderCard(nextActiveColumn),
            ];
          }
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          );
        }
        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );

          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            {
              ...activeDraggingCardData,
              columnId: nextOverColumn._id,
            }
          );

          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => !card.FE_PlaceholderCard
          );

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          );
        }

        // Resolve với cardOrderIds mới được cập nhật
        resolve({
          newActiveColumnCardOrderIds: nextActiveColumn?.cardOrderIds || [],
          newOverColumnCardOrderIds: nextOverColumn?.cardOrderIds || [],
        });

        return nextColumns;
      });
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItemId(event.active.id);
    setActiveDragItemType(
      event.active.data.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event.active.data.current);
    if (event.active.data.current?.columnId) {
      const foundColumn = findColumnByCardId(event.active.id as string);
      setOldColumn(foundColumn ?? null);
      setDragCardColumnId(foundColumn?._id || "");
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    const { active, over } = event;
    if (!active || !over) return;

    const activeDraggingCardId = active.id as string;
    const activeDraggingCardData = active.data.current as CardType;
    const overCardId = over.id as string;

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    // Drag card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const activeDraggingCardId = active.id as string;
      const activeDraggingCardData = active.data.current as CardType;
      const overCardId = over.id as string;

      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn || !oldColumn) return;

      // Drag card between column
      if (oldColumn._id !== overColumn._id) {
        const { newActiveColumnCardOrderIds, newOverColumnCardOrderIds } =
          await moveCardBetweenDifferentColumns(
            overColumn,
            overCardId,
            active,
            over,
            activeColumn,
            activeDraggingCardId,
            activeDraggingCardData
          );

        dragCardBetweenColumnMutation.mutate({
          oldColumnId: oldColumn._id,
          oldCardOrderIds: newActiveColumnCardOrderIds,
          newColumnId: overColumn._id,
          newCardOrderIds: newOverColumnCardOrderIds,
          cardId: activeDraggingCardId,
        });
      } else {
        const oldCardIndex = oldColumn.cards.findIndex(
          (c) => c._id === activeDragItemId
        );
        const newCardIndex = overColumn.cards.findIndex(
          (c) => c._id === overCardId
        );

        const dndOrderedCards = arrayMove(
          oldColumn.cards,
          oldCardIndex,
          newCardIndex
        );

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          if (!targetColumn) return prevColumns;

          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);
          if (oldColumn?._id) {
            dragCardMutation.mutate({
              cardOrderIds: targetColumn.cardOrderIds,
            });
          }
          return nextColumns;
        });
      }
    }

    // Drag Column
    if (
      activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
      active.id !== over.id
    ) {
      const oldColumnIndex = orderedColumns.findIndex(
        (c) => c._id === active.id
      );
      const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id);

      const dndOrderedColumns = arrayMove(
        orderedColumns,
        oldColumnIndex,
        newColumnIndex
      );

      const columnOrderIds = dndOrderedColumns.map((column) => column._id);

      setOrderedColumns(dndOrderedColumns);

      if (board?._id) {
        dragColumnMutation.mutate({
          columnOrderIds: columnOrderIds,
        });
      }
    }

    setActiveDragItemId(null);
    setActiveDragItemData(null);
    setActiveDragItemType(null);
    setOldColumn(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCorners}
    >
      <Box
        sx={{
          flex: 1,
          height: (theme) => theme.trello.boardContentHeight,
          width: "100%",
          p: "10px 0",
          display: "flex",
          alignItems: isFetching ? "center" : "flex-start",
          justifyContent: isFetching ? "center" : "flex-start",
        }}
      >
        {isFetching ? (
          <CircularProgress />
        ) : (
          <>
            <ListColumns columns={orderedColumns} />

            <DragOverlay dropAnimation={dropAnimation}>
              {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
              activeDragItemData ? (
                <Column
                  isDragging
                  column={activeDragItemData as ColumnType}
                  isUsingDragOverlay
                />
              ) : activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD &&
                activeDragItemData ? (
                <Card card={activeDragItemData as CardType} isDragging />
              ) : null}
            </DragOverlay>
          </>
        )}
      </Box>
    </DndContext>
  );
};

export default BoardContent;
