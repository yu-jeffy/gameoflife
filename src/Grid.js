import React, { useState, useEffect } from 'react';

const rows = 18; // Hardcoded number of rows
const columns = 40; // Hardcoded number of columns

// Helper function to count neighbors
function countNeighbors(grid, x, y, rows, columns) {
    let count = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue; // Skip the cell itself
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newY >= 0 && newX < rows && newY < columns) {
                count += grid[newX][newY] ? 1 : 0;
            }
        }
    }
    return count;
}

// Function to calculate the next state
function getNextState(grid) {
    const nextState = grid.map((row, x) =>
        row.map((cell, y) => {
            const neighbors = countNeighbors(grid, x, y, grid.length, row.length);
            const nextCellState =
                (cell && (neighbors === 2 || neighbors === 3)) || (!cell && neighbors === 3);
            return nextCellState;
        })
    );
    return nextState;
}

const Grid = ({ isRunning, resetFlag }) => {


    // Initialize the grid state with all dead cells
    const initialGridState = Array(rows)
        .fill(null)
        .map(() => Array(columns).fill(false));

    // React state to hold the grid
    const [grid, setGrid] = useState(initialGridState);

    // State to track the last action (fill or clear) while dragging
    const [fillMode, setFillMode] = React.useState(null);

    // Reset the grid to its initial state
    const resetGrid = () => {
        setGrid(initialGridState);
    };

    // Function to fill a cell
    const fillCell = (rowIndex, colIndex) => {
        const newGrid = [...grid];
        newGrid[rowIndex][colIndex] = true; // Set the cell to alive when dragging
        setGrid(newGrid);
    };

    // mouse drag state
    const [isDragging, setIsDragging] = React.useState(false);

    // Handles the mouse down event
    const handleMouseDown = (rowIndex, colIndex) => {
        setIsDragging(true);
        setFillMode(!grid[rowIndex][colIndex]); // Set the fill mode based on the initial cell state
        toggleCellState(rowIndex, colIndex); // Toggle the initial cell state
    };

    // Handles the mouse enter event when dragging
    const handleMouseEnter = (rowIndex, colIndex) => {
        if (isDragging) {
            // Only update the cell if it's different from the fill mode
            if (grid[rowIndex][colIndex] !== fillMode) {
                toggleCellState(rowIndex, colIndex);
            }
        }
    };

    // Handles the mouse up event
    const handleMouseUp = () => {
        setIsDragging(false);
        setFillMode(null); // Reset the fill mode
    };


    // Function to toggle cell state
    const toggleCellState = (rowIndex, colIndex) => {
        const newGrid = [...grid];
        newGrid[rowIndex] = [...newGrid[rowIndex]]; // Create a new array for the row
        newGrid[rowIndex][colIndex] = !newGrid[rowIndex][colIndex]; // Toggle the cell state
        setGrid(newGrid);
    };

    // Calculate cell size based on the screen width and number of columns
    const cellSize = `${99 / columns}vw`;

    // Function to get the filled (alive) cells
    const getFilledCells = () => {
        const filledCells = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                if (grid[row][col]) {
                    filledCells.push({ row, col });
                }
            }
        }
        return filledCells;
    };

    // mouse dragging event
    useEffect(() => {
        const handleMouseUpGlobal = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        window.addEventListener('mouseup', handleMouseUpGlobal);

        return () => {
            window.removeEventListener('mouseup', handleMouseUpGlobal);
        };
    }, [isDragging]);

    // Effect to handle the running state of the simulation
    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => {
                setGrid(prevGrid => getNextState(prevGrid));
            }, 500); // Update every 500ms. Adjust the speed as necessary.
        } else {
            clearInterval(intervalId); // Clear the interval if isRunning is false
        }

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [isRunning]);

    // Effect to reset the grid when needed
    useEffect(() => {
        resetGrid();
    }, [resetFlag]); // Only listen for changes in resetFlag



    // Render the grid
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, ${cellSize})`,
                justifyContent: 'center',
                gridGap: '0px',
            }}
            onMouseLeave={handleMouseUp} // handle the mouse leaving the grid
        >
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                            width: cellSize,
                            height: cellSize,
                            backgroundColor: cell ? '#E6E6FA' : 'white',
                            border: '1px solid #ddd',
                        }}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleMouseUp}
                    />
                ))
            )}
        </div>
    );
}

export default Grid;

