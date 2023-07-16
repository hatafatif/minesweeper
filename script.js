"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cell {
    constructor() {
        this.type = "default"; // Is it an empty cell, contains a number, or a bomb, or is it default.
        this.isRevealed = false; // False when this cell has not been revealed to the player, either by clicking or has been revealed by some other cell.
        this.value = -1;
    }
    getType() {
        return this.type;
    }
    getIsRevealed() {
        return this.isRevealed;
    }
    getValue() {
        return this.value;
    }
    isNotRevealed() {
        return this.isRevealed == false;
    }
    reveal() {
        if (!this.isRevealed) {
            this.isRevealed = true;
        }
    }
    setType(type) {
        this.type = type;
    }
    setValue(value) {
        this.value = value;
    }
    toString() {
        return `${this.getValue()}  `;
    }
    printCell() {
        if (this.isRevealed) {
            return this.getValue().toString();
        }
        else {
            return "-";
        }
    }
}
class Board {
    constructor(bombs = 8, rows = 8, cols = 8) {
        this.moves = 0;
        this.bombs = bombs;
        this.rows = rows;
        this.cols = cols;
        // Setting up boardArray with default cells.
        this.boardArray = new Array(this.rows);
        for (let i = 0; i < rows; i++) {
            this.boardArray[i] = new Array(this.cols);
            for (let j = 0; j < this.cols; j++) {
                this.boardArray[i][j] = new Cell();
            }
        }
        this.bombList = null;
    }
    // It prints the board by printing each cell with a gap.
    printBoard() {
        for (let i = 0; i < this.rows; i++) {
            let line = "";
            for (let j = 0; j < this.cols; j++) {
                line += this.boardArray[i][j].printCell();
                line += "  ";
            }
            console.log(line);
        }
        console.log(" ");
    }
    makeMove(row, col) {
        // Returns true if move was successfully made, false otherwise
        // If move is outside the grid / boardArray, return false.
        if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) {
            console.error("Out of bounds");
            return false;
        }
        // If box is already revealed, return false.
        if (this.boardArray[row][col].getIsRevealed()) {
            console.log("Cell was already revealed");
            return false;
        }
        // Move is legal. We can increment number of moves.
        this.moves += 1;
        // In case of first move, set up the board
        this.moves == 1 && this.setUpBoard(row, col);
        // If clicked cell is the bomb, game is lost
        if (this.boardArray[row][col].getType() == "bomb") {
            console.log(`Game Lost, bomb pressed at ${row}${col}`);
            return true;
        }
        // Handle the logic for revealing the cell
        this.handleReveal(row, col);
        console.log("New Board:");
        this.printBoard();
        return true;
    }
    setUpBoard(row, col) {
        this.boardArray[row][col].setType("empty");
        this.boardArray[row][col].setValue(0);
        // Set the bombs first
        this.setUpBombs(row, col);
        // Traverse the list and calculate values of the cells (aka number of surrounding bombs)
        this.calculateCellValues();
    }
    setUpBombs(row, col) {
        this.bombList = this.getUniqueBombs(row, col);
        console.log("Bomb Locations:", this.bombList);
        this.bombList.forEach((pair) => {
            this.boardArray[pair[0]][pair[1]].setType("bomb");
        });
    }
    // Method takes input the pressed cell and returns the list of unique bombs in and array of tuples.
    getUniqueBombs(row, col) {
        // Set to keep track of positions that are illegal aka where bombs can not be placed.
        const illegalPositions = new Set();
        // Adding the pressed cell to set of illegals places.
        illegalPositions.add(JSON.stringify([row, col]));
        // Adding all adjacent cells of pressed cell to also be illegal for bomb placing.
        const directions = ["l", "r", "t", "b", "tr", "tl", "br", "bl"];
        directions.forEach((dir) => {
            const returnedPair = this.getAdjacentCell(row, col, dir);
            returnedPair && illegalPositions.add(JSON.stringify(returnedPair));
        });
        // While generatedPairs are less than bombs needed, keep generating new bombs, making sure none of them are illegal.
        const generatedPairs = [];
        while (generatedPairs.length < this.bombs) {
            const pair = this.getRandomPair();
            const pairKey = JSON.stringify(pair);
            if (!illegalPositions.has(pairKey)) {
                illegalPositions.add(pairKey);
                generatedPairs.push(pair);
            }
        }
        return generatedPairs;
    }
    // Generate a random pair
    getRandomPair() {
        const row = Math.floor(Math.random() * this.rows);
        const col = Math.floor(Math.random() * this.cols);
        return [row, col];
    }
    // After placing bombs, this calculates value of all cells.
    calculateCellValues() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const currentCell = this.boardArray[i][j];
                // console.log(`Checking cell at ${i} ${j}`);
                if (currentCell.getType() == "default") {
                    currentCell.setType("number");
                    const numOfAdjacentBombs = this.checkAdjacentCellsForBombs(i, j);
                    // console.log("Total Bombs returned:", numOfAdjacentBombs);
                    currentCell.setValue(numOfAdjacentBombs);
                }
                else {
                    // console.log("Not calculating value for this cell because cell type is: ", currentCell.getType());
                }
            }
        }
    }
    checkAdjacentCellsForBombs(row, col) {
        const directions = ["l", "r", "t", "b", "tr", "tl", "br", "bl"];
        let value = 0;
        directions.forEach((dir) => {
            const adjacentCellPosition = this.getAdjacentCell(row, col, dir);
            const adjCell = adjacentCellPosition &&
                this.boardArray[adjacentCellPosition[0]][adjacentCellPosition[1]];
            if (adjCell && adjCell.getType() == "bomb") {
                value++;
            }
        });
        return value;
    }
    getAdjacentCell(row, col, direction) {
        switch (direction) {
            case "l":
                if (col > 0) {
                    return [row, col - 1];
                }
                break;
            case "r":
                if (col < this.cols - 1) {
                    return [row, col + 1];
                }
                break;
            case "t":
                if (row > 0) {
                    return [row - 1, col];
                }
                break;
            case "b":
                if (row < this.rows - 1) {
                    return [row + 1, col];
                }
                break;
            case "tr":
                if (row > 0 && col < this.cols - 1) {
                    return [row - 1, col + 1];
                }
                break;
            case "tl":
                if (row > 0 && col > 0) {
                    return [row - 1, col - 1];
                }
                break;
            case "br":
                if (row < this.rows - 1 && col < this.cols - 1) {
                    return [row + 1, col + 1];
                }
                break;
            case "bl":
                if (row < this.rows - 1 && col > 0) {
                    return [row + 1, col - 1];
                }
                break;
            default:
                console.error("Wrong Direction Submitted");
        }
        return null;
    }
    handleReveal(row, col) {
        const currentCell = this.boardArray[row][col];
        currentCell.reveal();
        if (currentCell.getValue() == -1) {
            console.log("That was a bomb. Game Lost");
            return false;
        }
        // If the cell value is 0, also reveal it's adjacent cells.
        // This method is recursive
        if (currentCell.getValue() == 0) {
            // console.log("That was an empty space. Nice Job");
            const directions = ["l", "r", "t", "b", "tr", "tl", "br", "bl"];
            directions.forEach((dir) => {
                const adjacentCellPosition = this.getAdjacentCell(row, col, dir);
                if (adjacentCellPosition) {
                    const adjRow = adjacentCellPosition[0];
                    const adjCol = adjacentCellPosition[1];
                    const adjCell = this.boardArray[adjRow][adjCol];
                    // Recursion part
                    // Check if adjacent cells are unrevealed. If so, run the reveal method.
                    adjCell.isNotRevealed() &&
                        this.handleReveal(adjRow, adjCol);
                }
            });
            return true;
        }
        return true;
    }
}
const board = new Board(10, 10, 10);
console.log("Game Start");
console.log("Making Move: 0, 0");
board.makeMove(0, 0);
