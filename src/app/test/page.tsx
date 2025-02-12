"use client";
import {
  createContext,
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ReactDOM from "react-dom";
import invariant from "tiny-invariant";
import { DragHandleButton } from "@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button";

import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { Box, xcss } from "@atlaskit/primitives";
import { token } from "@atlaskit/tokens";
import { cn } from "@/lib/utils";

type ItemPosition = "first" | "last" | "middle" | "only";

type CleanupFn = () => void;

type ItemEntry = { itemId: string; element: HTMLElement };

type ListContextValue = {
  getListLength: () => number;
  registerItem: (entry: ItemEntry) => CleanupFn;
  reorderItem: (args: {
    startIndex: number;
    indexOfTarget: number;
    closestEdgeOfTarget: Edge | null;
  }) => void;
  instanceId: symbol;
};

const ListContext = createContext<ListContextValue | null>(null);

function useListContext() {
  const listContext = useContext(ListContext);
  invariant(listContext !== null);
  return listContext;
}

type Item = {
  id: string;
  label: string;
};

const itemKey = Symbol("item");
type ItemData = {
  [itemKey]: true;
  item: Item;
  index: number;
  instanceId: symbol;
};

function getItemData({
  item,
  index,
  instanceId,
}: {
  item: Item;
  index: number;
  instanceId: symbol;
}): ItemData {
  return {
    [itemKey]: true,
    item,
    index,
    instanceId,
  };
}

function isItemData(data: Record<string | symbol, unknown>): data is ItemData {
  return data[itemKey] === true;
}

function getItemPosition({
  index,
  items,
}: {
  index: number;
  items: Item[];
}): ItemPosition {
  if (items.length === 1) {
    return "only";
  }

  if (index === 0) {
    return "first";
  }

  if (index === items.length - 1) {
    return "last";
  }

  return "middle";
}

const listItemContainerStyles = xcss({
  position: "relative",
  backgroundColor: "elevation.surface",
  borderWidth: "border.width.0",
  borderBottomWidth: token("border.width", "1px"),
  borderStyle: "solid",
  borderColor: "color.border",
  // eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
  ":last-of-type": {
    borderWidth: "border.width.0",
  },
});

const listItemStyles = xcss({
  position: "relative",
  padding: "space.100",
});

const listItemDisabledStyles = xcss({ opacity: 0.4 });

type DraggableState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "dragging" };

const idleState: DraggableState = { type: "idle" };
const draggingState: DraggableState = { type: "dragging" };

const listItemPreviewStyles = xcss({
  paddingBlock: "space.050",
  paddingInline: "space.100",
  borderRadius: "border.radius.100",
  backgroundColor: "elevation.surface.overlay",
  maxWidth: "360px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const itemLabelStyles = xcss({
  flexGrow: 1,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
});

function ListItem({
  item,
  index,
  position,
  children,
  className,
}: {
  item: Item;
  index: number;
  position: ItemPosition;
  children?: any;
  className?: string;
}) {
  const { registerItem, instanceId } = useListContext();

  const ref = useRef<HTMLDivElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const dragHandleRef = useRef<HTMLButtonElement>(null);

  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState);

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef?.current;
    invariant(element);
    invariant(dragHandle);

    const data = getItemData({ item, index, instanceId });

    return combine(
      registerItem({ itemId: item.id, element }),
      draggable({
        element: dragHandle,
        getInitialData: () => data,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: token("space.200", "16px"),
              y: token("space.100", "8px"),
            }),
            render({ container }) {
              setDraggableState({ type: "preview", container });

              return () => setDraggableState(draggingState);
            },
          });
        },
        onDragStart() {
          setDraggableState(draggingState);
        },
        onDrop() {
          setDraggableState(idleState);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isItemData(source.data) && source.data.instanceId === instanceId
          );
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDrag({ self, source }) {
          const isSource = source.element === element;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data.index;
          invariant(typeof sourceIndex === "number");

          const isItemBeforeSource = index === sourceIndex - 1;
          const isItemAfterSource = index === sourceIndex + 1;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top");

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      })
    );
  }, [instanceId, item, index, registerItem]);

  return (
    <Fragment>
      <Box ref={ref} xcss={listItemContainerStyles}>
        <div className={cn("flex flex-row items-center gap-x-1", className)}>
          <DragHandleButton
            className="drag-grab"
            ref={dragHandleRef}
            label={`Reorder ${item.label}`}
          />
          <div className="flex flex-col flex-grow">{children}</div>
        </div>
        {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
      </Box>
      {draggableState.type === "preview" &&
        ReactDOM.createPortal(
          <Box xcss={listItemPreviewStyles}>{item.label}</Box>,
          draggableState.container
        )}
    </Fragment>
  );
}

const defaultItems: Item[] = [
  {
    id: "task-1",
    label: "Organize a team-building event",
  },
  {
    id: "task-2",
    label: "Create and maintain office inventory",
  },
  {
    id: "task-3",
    label: "Update company website content",
  },
  {
    id: "task-4",
    label: "Plan and execute marketing campaigns",
  },
  {
    id: "task-5",
    label: "Coordinate employee training sessions",
  },
  {
    id: "task-6",
    label: "Manage facility maintenance",
  },
  {
    id: "task-7",
    label: "Organize customer feedback surveys",
  },
  {
    id: "task-8",
    label: "Coordinate travel arrangements",
  },
];

const containerStyles = xcss({
  maxWidth: "400px",
  borderWidth: "border.width",
  borderStyle: "solid",
  borderColor: "color.border",
});

function getItemRegistry() {
  const registry = new Map<string, HTMLElement>();

  function register({ itemId, element }: ItemEntry) {
    registry.set(itemId, element);

    return function unregister() {
      registry.delete(itemId);
    };
  }

  function getElement(itemId: string): HTMLElement | null {
    return registry.get(itemId) ?? null;
  }

  return { register, getElement };
}

type ListState = {
  items: Item[];
  lastCardMoved: {
    item: Item;
    previousIndex: number;
    currentIndex: number;
    numberOfItems: number;
  } | null;
};
export const ListBetterDragDrop: FC<{
  data: any[];
  children: any;
  onChange: (data: any) => void | Promise<void>;
  className?: string;
  classContainer?: string;
}> = ({ children, data, onChange, className, classContainer }) => {
  const [{ items, lastCardMoved }, setListState] = useState<ListState>({
    items: defaultItems,
    lastCardMoved: null,
  });
  const [registry] = useState(getItemRegistry);

  // Isolated instances of this component from one another
  const [instanceId] = useState(() => Symbol("instance-id"));

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: "vertical",
      });

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return;
      }

      setListState((listState) => {
        const item = listState.items[startIndex];

        return {
          items: reorder({
            list: listState.items,
            startIndex,
            finishIndex,
          }),
          lastCardMoved: {
            item,
            previousIndex: startIndex,
            currentIndex: finishIndex,
            numberOfItems: listState.items.length,
          },
        };
      });
      onChange(items);
    },
    []
  );

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data) && source.data.instanceId === instanceId;
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;
        if (!isItemData(sourceData) || !isItemData(targetData)) {
          return;
        }

        const indexOfTarget = items.findIndex(
          (item) => item.id === targetData.item.id
        );
        if (indexOfTarget < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        reorderItem({
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget,
        });
      },
    });
  }, [instanceId, items, reorderItem]);

  // once a drag is finished, we have some post drop actions to take
  useEffect(() => {
    if (lastCardMoved === null) {
      return;
    }

    const { item, previousIndex, currentIndex, numberOfItems } = lastCardMoved;
    const element = registry.getElement(item.id);
    if (element) {
      triggerPostMoveFlash(element);
    }
  }, [lastCardMoved, registry]);

  // cleanup the live region when this component is finished
  useEffect(() => {
    return function cleanup() {
      liveRegion.cleanup();
    };
  }, []);

  const getListLength = useCallback(() => items.length, [items.length]);

  const contextValue: ListContextValue = useMemo(() => {
    return {
      registerItem: registry.register,
      reorderItem,
      instanceId,
      getListLength,
    };
  }, [registry.register, reorderItem, instanceId, getListLength]);
  if (!items?.length) return <></>;
  return (
    <ListContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-y-1 w-full", classContainer)}>
        {items.map((item, index) => (
          <ListItem
            key={item.id}
            item={item}
            index={index}
            position={getItemPosition({ index, items })}
            children={<>{item?.label}</>}
            className={className}
          />
        ))}
      </div>
    </ListContext.Provider>
  );
};
function HomePage() {
  const [{ items, lastCardMoved }, setListState] = useState<ListState>({
    items: defaultItems,
    lastCardMoved: null,
  });
  const [registry] = useState(getItemRegistry);

  // Isolated instances of this component from one another
  const [instanceId] = useState(() => Symbol("instance-id"));

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: "vertical",
      });

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return;
      }

      setListState((listState) => {
        const item = listState.items[startIndex];

        return {
          items: reorder({
            list: listState.items,
            startIndex,
            finishIndex,
          }),
          lastCardMoved: {
            item,
            previousIndex: startIndex,
            currentIndex: finishIndex,
            numberOfItems: listState.items.length,
          },
        };
      });
      console.log(items);
    },
    []
  );

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data) && source.data.instanceId === instanceId;
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;
        if (!isItemData(sourceData) || !isItemData(targetData)) {
          return;
        }

        const indexOfTarget = items.findIndex(
          (item) => item.id === targetData.item.id
        );
        if (indexOfTarget < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        reorderItem({
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget,
        });
      },
    });
  }, [instanceId, items, reorderItem]);

  // once a drag is finished, we have some post drop actions to take
  useEffect(() => {
    if (lastCardMoved === null) {
      return;
    }

    const { item, previousIndex, currentIndex, numberOfItems } = lastCardMoved;
    const element = registry.getElement(item.id);
    if (element) {
      triggerPostMoveFlash(element);
    }
  }, [lastCardMoved, registry]);

  // cleanup the live region when this component is finished
  useEffect(() => {
    return function cleanup() {
      liveRegion.cleanup();
    };
  }, []);

  const getListLength = useCallback(() => items.length, [items.length]);

  const contextValue: ListContextValue = useMemo(() => {
    return {
      registerItem: registry.register,
      reorderItem,
      instanceId,
      getListLength,
    };
  }, [registry.register, reorderItem, instanceId, getListLength]);

  return (
    <div className="flex flex-col max-w-screen h-screen">
      <div
        className={cx(
          "flex-grow relative  flex flex-row items-center justify-center bg-primary"
        )}
      >
        <div className="flex flex-grow max-w-screen-xl justify-center">
          <div className="flex  w-3/4 bg-gradient-white shadow-md rounded-md ">
            <ListContext.Provider value={contextValue}>
              <div className="flex flex-col w-full">
                {items.map((item, index) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    index={index}
                    position={getItemPosition({ index, items })}
                    children={
                      <div className="flex flex-col">
                        <div>{item?.label}</div>
                        <div className="flex flex-grow items-center p-4 bg-red-500">
                          {item?.label}
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            </ListContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
