import React, { forwardRef, useState } from "react";
import { DragOverlay, useDraggable } from "@dnd-kit/core";
import { createSnapModifier } from "@dnd-kit/modifiers";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CELL_SIZE } from "../constants";

type Props = {
    id: string,
    shapeCode: string,
    color: string,
    isDropped: boolean,
}
const Block = forwardRef<HTMLDivElement, Props>(({ id, shapeCode, color, isDropped }) => {
    const [isClicked, setIsClicked] = useState(false);


    function getShapeCoordinates(shapeString: string, size = 5) {
        const coordinates = [];
        for (let i = 0; i < shapeString.length; i++) {
            if (shapeString[i] === "1") {
                const row = Math.floor(i / size);
                const col = i % size;
                coordinates.push([row, col]);
            }
        }
        return coordinates;
    }

    const shapeCoords = getShapeCoordinates(shapeCode);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    function isEdgeCell(row: number, col: number, coordinates: number[][]) {
        const isTopEdge = !coordinates.some(([r, c]) => r === row - 1 && c === col);
        const isBottomEdge = !coordinates.some(([r, c]) => r === row + 1 && c === col);
        const isLeftEdge = !coordinates.some(([r, c]) => r === row && c === col - 1);
        const isRightEdge = !coordinates.some(([r, c]) => r === row && c === col + 1);
        return { isTopEdge, isBottomEdge, isLeftEdge, isRightEdge };
    }

    const blockStyle: React.CSSProperties = {
        position: "relative",
        width: `${CELL_SIZE * 1}px`,
        height: `${CELL_SIZE * 1}px`,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        transition: "transform 0.3s ease-in-out",
        transform: isClicked ? "translateX(-20px)" : "translateX(0)",
    };

    const boxStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: isClicked ? `${CELL_SIZE * 5}px` : `${CELL_SIZE * 4}px`,
        height: isClicked ? `${CELL_SIZE * 5}px` : `${CELL_SIZE * 4}px`,
        transition: "all 0.3s ease-in-out",
        backgroundColor: isClicked ? "tomato" : "transparent",
        zIndex: -1,
    };

    // if (isDropped) {
    //     return (
    //         <div className="shape-container" style={blockStyle}>
    //             <div style={boxStyle}></div>
    //             {shapeCoords.map(([row, col], index) => (
    //                 <div
    //                     key={index}
    //                     style={{
    //                         position: "absolute",
    //                         top: `${row * CELL_SIZE}px`,
    //                         left: `${col * CELL_SIZE}px`,
    //                         width: `${CELL_SIZE}px`,
    //                         height: `${CELL_SIZE}px`,
    //                         backgroundColor: color,
    //                         outline: "0.5px solid rgba(0,0,0,0.2)",
    //                     }}
    //                     onClick={handleClick}
    //                 />
    //             ))}
    //         </div>
    //     );
    // }



    return (
        <div
            className={"shape-container"}
            style={{ ...blockStyle }}
        >

            {shapeCoords.map(([row, col], index) => {
                const { isTopEdge, isBottomEdge, isLeftEdge, isRightEdge } = isEdgeCell(row, col, shapeCoords);

                return (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            top: `${row * CELL_SIZE}px`,
                            left: `${col * CELL_SIZE}px`,
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                            backgroundColor: color,
                            outline: "0.5px solid rgba(0,0,0,0.2)",
                            cursor: "pointer",
                            borderTop: isTopEdge ? "0.5px solid rgba(0,0,0,0.6)" : "none",
                            borderBottom: isBottomEdge ? "0.5px solid rgba(0,0,0,0.6)" : "none",
                            borderLeft: isLeftEdge ? "0.5px solid rgba(0,0,0,0.6)" : "none",
                            borderRight: isRightEdge ? "0.5px solid rgba(0,0,0,0.6)" : "none",
                        }}
                        onClick={handleClick}
                    />
                )
            })}
        </div>
    );
});

export default Block;