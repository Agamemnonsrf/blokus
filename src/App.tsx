import { useState, MutableRefObject } from 'react';
import './App.css';
import { Active, closestCenter, pointerWithin, closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors, rectIntersection, CollisionDetection, CollisionDescriptor, DroppableContainer } from '@dnd-kit/core';
import NewGrid from './newGrid';
import Block from './blocks/block';
import Draggable from './blocks/draggable';
import { createSnapModifier } from '@dnd-kit/modifiers';
import Droppable from './blocks/droppable';
import { blocks, CELL_SIZE, colors, GRID_SIZE, OUTER_GRID_SIZE, Polyominoes } from './constants';
import { sortCollisionsDesc } from '@dnd-kit/core/dist/utilities/algorithms/helpers';
import { Collision, Rect } from '@dnd-kit/core/dist/utilities';


const getWidthAndHeight = (shapeCode: string): { width: number, height: number } => {
    switch (shapeCode) {
        case Polyominoes.monomino:
            return { width: 1, height: 1 }
        case Polyominoes.domino:
            return { width: 1, height: 2 }
        case Polyominoes.trimino1:
            return { width: 2, height: 2 }
        case Polyominoes.trimino2:
            return { width: 1, height: 3 }
        case Polyominoes.tetramino1:
            return { width: 1, height: 4 }
        case Polyominoes.tetramino2:
            return { width: 2, height: 3 }
        case Polyominoes.tetramino3:
            return { width: 3, height: 2 }
        case Polyominoes.tetramino4:
            return { width: 2, height: 2 }
        case Polyominoes.tetramino5:
            return { width: 3, height: 2 }
        case Polyominoes.pentomino1:
            return { width: 3, height: 3 }
        case Polyominoes.pentomino2:
            return { width: 1, height: 5 }
        case Polyominoes.pentomino3:
            return { width: 2, height: 4 }
        case Polyominoes.pentomino4:
            return { width: 4, height: 2 }
        case Polyominoes.pentomino5:
            return { width: 3, height: 2 }
        case Polyominoes.pentomino6:
            return { width: 3, height: 3 }
        case Polyominoes.pentomino7:
            return { width: 3, height: 2 }
        case Polyominoes.pentomino8:
            return { width: 3, height: 3 }
        case Polyominoes.pentomino9:
            return { width: 3, height: 3 }
        case Polyominoes.pentomino10:
            return { width: 3, height: 3 }
        case Polyominoes.pentomino11:
            return { width: 4, height: 2 }
        case Polyominoes.pentomino12:
            return { width: 3, height: 3 }
        default:
            return { width: 1, height: 1 }
    }
}

// const customCollisionDetection: CollisionDetection = (args) => {
//     //basically, the block has to have every one of its cells inside of the grid to be considered a valid drop
//     //so, if the block is 1x3, it has to be completely inside the grid to be a valid drop
//     //so, if we have the x and y coordinates of the block's top left corner, by adding the width and height of the block (multiplied by the cell size) to the x and y, we can get the x and y of the bottom right corner
//     //which if they are both inside the grid, then the block is completely inside the grid, probably lol
//     //but that would mean that we also need the x and y coordinates of the grid's top left corner
//     //but the grid itself has these styles: position: "absolute",left: "50%", top: "50%", transform: "translate(-50%, -50%)",

//     const { active, collisionRect, droppableContainers, droppableRects, pointerCoordinates } = args;
//     const shapeId = active.id.toString();
//     const height = determineHeight(shapeId);
//     const width = determineWidth(shapeId);
//     const cellSize = CELL_SIZE;
//     const gridTopLeftX = droppableContainers[0].rect.current?.left ?? 0;
//     const gridTopLeftY = droppableContainers[0].rect.current?.top ?? 0;
//     const gridBottomRightX = gridTopLeftX + GRID_SIZE * cellSize;
//     const gridBottomRightY = gridTopLeftY + GRID_SIZE * cellSize;
//     const blockTopLeftX = active.rect.current?.translated?.left ?? 0;
//     const blockTopLeftY = active.rect.current?.translated?.top ?? 0;

//     const blockBottomRightX = blockTopLeftX + width * cellSize;
//     const blockBottomRightY = blockTopLeftY + height * cellSize;


// }

const snapToGrid = (value: number, grid: number) => {
    return Math.round(value / grid) * grid;
}

function parseShape(shapeBinary: string) {
    const rows = [];
    for (let i = 0; i < 5; i++) {
        const row = shapeBinary.slice(i * 5, i * 5 + 5).split('').map(Number);
        rows.push(row);
    }
    return rows;
}

const customCollisionDetection2: CollisionDetection = (args) => {
    const { active, droppableContainers } = args;

    // Determine the block’s dimensions based on shape ID
    const shapeId = active.id.toString() as Polyominoes;
    const { width, height } = getWidthAndHeight(shapeId)

    // Grid bounds
    const gridTopLeftX = droppableContainers[0].rect.current?.left ?? 0;
    const gridTopLeftY = droppableContainers[0].rect.current?.top ?? 0;
    const gridBottomRightX = gridTopLeftX + GRID_SIZE * CELL_SIZE;
    const gridBottomRightY = gridTopLeftY + GRID_SIZE * CELL_SIZE;

    // Block bounds
    // const blockTopLeftX = snapToGrid(active.rect.current?.translated?.left ?? 0, CELL_SIZE - CELL_SIZE / 2)
    // const blockTopLeftY = snapToGrid(active.rect.current?.translated?.top ?? 0, CELL_SIZE - CELL_SIZE / 2)
    const blockTopLeftX = active.rect.current?.translated?.left ?? 0
    const blockTopLeftY = active.rect.current?.translated?.top ?? 0
    const blockBottomRightX = blockTopLeftX + width * CELL_SIZE;
    const blockBottomRightY = blockTopLeftY + height * CELL_SIZE;

    console.log({ blockTopLeftX, blockTopLeftY })

    // Check if the block is entirely within the grid boundaries
    const isWithinGrid = (
        blockTopLeftX >= gridTopLeftX &&
        blockTopLeftY >= gridTopLeftY &&
        blockBottomRightX <= gridBottomRightX &&
        blockBottomRightY <= gridBottomRightY
    );

    // console.log("1:", blockTopLeftX >= gridTopLeftX, "2:", blockTopLeftY >= gridTopLeftY, "3:", blockBottomRightX <= gridBottomRightX, "4:", blockBottomRightY <= gridBottomRightY)

    if (isWithinGrid) {
        return droppableContainers.map(container => ({
            id: container.id,
            data: {
                droppableContainer: container,
                value: 1 // Adjust the value to signify collision relevance or fitness
            }
        }));
    }

    // If no valid collision found, return an empty array
    return [];
};


function App() {
    const color = colors[0];
    const [activeId, setActiveId] = useState<string>("");
    const [gridState, setGridState] = useState<number[][]>(Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => 0)));
    const [isOverGrid, setIsOverGrid] = useState<boolean>(false);

    return (
        <DndContext
            // sensors={useSensors(
            //     useSensor(PointerSensor),
            //     useSensor(KeyboardSensor),
            // )}
            collisionDetection={customCollisionDetection2}
            onDragStart={(event) => {
                setActiveId(event.active.id.toString());
            }}
            onDragOver={(event) => {
                if (event.over?.id === "droppable") {
                    setIsOverGrid(true);
                } else {
                    setIsOverGrid(false);
                }
            }}
            onDragEnd={(event) => {
                setActiveId("");
                console.log("DragEnd event:", event);
                if (event.over) {
                    console.log("Dropped over:", event.over.id);
                    if (event.over.id === "droppable") {
                        console.log("dropped on main grid");
                        const { active, over } = event;
                        const shapeId = active.id.toString() as Polyominoes;
                        const shapeMatrix = parseShape(shapeId);  // Convert the binary string into a 2D matrix

                        const gridTopLeftX = over.rect.left ?? 0;
                        const gridTopLeftY = over.rect.top ?? 0;
                        const blockTopLeftX = active.rect.current?.translated?.left ?? 0;
                        const blockTopLeftY = active.rect.current?.translated?.top ?? 0;
                        const row = Math.floor((blockTopLeftY - gridTopLeftY) / CELL_SIZE);
                        const col = Math.floor((blockTopLeftX - gridTopLeftX) / CELL_SIZE);

                        const newGridState = [...gridState];

                        // Loop through the shape matrix and apply it to `newGridState`
                        for (let i = 0; i < shapeMatrix.length; i++) {
                            for (let j = 0; j < shapeMatrix[i].length; j++) {
                                if (shapeMatrix[i][j] === 1) { // Only set cells that are occupied by the shape
                                    const targetRow = row + i + 1;
                                    const targetCol = col + j + 1;
                                    if (targetRow >= 0 && targetRow < GRID_SIZE && targetCol >= 0 && targetCol < GRID_SIZE) {
                                        newGridState[targetRow][targetCol] = 1;
                                    }
                                }
                            }
                        }

                        setGridState(newGridState);

                        setIsOverGrid(false);
                    } else {
                        console.log("dropped on something else");
                    }
                } else {
                    console.log("dropped outside any droppable");
                }
            }}
        >
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
            }}>
                {/* this is the outergrid, the inner grid should be in its center */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${OUTER_GRID_SIZE}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${OUTER_GRID_SIZE * 3}, ${CELL_SIZE}px)`,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    outline: "1px solid rgba(0,0,0,0.7)",
                    backgroundColor: "white",
                    boxSizing: "border-box",
                }}>
                    {Array.from({ length: OUTER_GRID_SIZE * (OUTER_GRID_SIZE * 3) }).map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: `${CELL_SIZE}px`,
                                height: `${CELL_SIZE}px`,
                                outline: "0.5px solid rgba(0,0,0,0.2)",
                            }}
                        />
                    ))}
                    {/* this is the innergrid */}
                    <div style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}>
                        <Droppable id={"droppable"}>
                            <NewGrid gridState={gridState} />
                        </Droppable>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(4, 20px)`,
                        gridTemplateRows: `repeat(1, 20px)`,
                        gap: CELL_SIZE * 5,
                        left: 10 * CELL_SIZE,
                        bottom: 18 * CELL_SIZE,
                        position: "absolute",
                    }}>
                        {blocks.map((key, index) => {
                            if (key.shapeCode === activeId) {
                                return <Block key={index} id={key.shapeCode} shapeCode={key.shapeCode} color={"rgba(0,0,0,0.2)"} isDropped={true} />
                            }
                            return (
                                <Draggable id={key.shapeCode} key={key.shapeCode}>
                                    <Block key={index} id={key.shapeCode} shapeCode={key.shapeCode} color={activeId === key.shapeCode ? "rgba(0,0,0,0.2)" : color} isDropped={false} />
                                </Draggable>
                            )
                        })}
                    </div>
                    <DragOverlay
                        modifiers={[
                            // createSnapModifier(CELL_SIZE)
                        ]}
                    >
                        {activeId && <Block key={activeId} id={activeId} shapeCode={activeId} color={"transparent"} isDropped={true} />}
                    </DragOverlay>
                    <DragOverlay
                        modifiers={[
                            createSnapModifier(CELL_SIZE)
                        ]}
                    >
                        {activeId && <Block key={activeId} id={activeId} shapeCode={activeId} color={isOverGrid ? color : "red"} isDropped={true} />}
                    </DragOverlay>
                </div>
            </div>
        </DndContext>
    );
}

export default App;
