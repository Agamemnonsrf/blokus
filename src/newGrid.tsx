import React from "react";
import { colors, GRID_SIZE, CELL_SIZE } from "./constants";

type NewGridProps = {
    gridState: number[][],
};

const NewGrid = ({ gridState }: NewGridProps) => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                justifyContent: "center",
                alignItems: "center",
                outline: "1px solid rgba(0,0,0,0.7)",
                boxSizing: "border-box",
            }}
        >
            {gridState.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                            backgroundColor: cell === 1 ? colors[2] : "transparent",
                            outline: "0.5px solid rgba(0,0,0,0.2)",
                            boxSizing: "border-box",
                        }}
                    />
                ))
            )}
        </div>
    );
}

export default NewGrid;
