interface CellType {
    type: "number" | "bomb" | "empty" | "default";
}

class Cell {
    private type: CellType["type"] = "default"; // Is it an empty cell, contains a number, or a bomb, or is it default.
    private isRevealed: boolean = false; // False when this cell has not been revealed to the player, either by clicking or has been revealed by some other cell.

    constructor() {}

    public getType(): CellType["type"] {
        return this.type;
    }

    public getIsRevealed(): boolean {
        return this.isRevealed;
    }

    public reveal(): void {
        if (!this.isRevealed) {
            this.isRevealed = true;
        }
    }

    public setType(type: CellType["type"]): void {
        this.type = type;
    }

    public toString() {
        return `${this.getType()}`;
    }
}

class Board {
    private bombs: number;
    private rows: number;
    private cols: number;
    private boardArray: Cell[][];
    private moves: number = 0;
    private bombList: [number, number][] | null;

    constructor(bombs: number = 8, rows: number = 8, cols: number = 8) {
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

    public printBoard() {
        for (let i = 0; i < this.rows; i++) {
            let line = "";
            for (let j = 0; j < this.cols; j++) {
                line += `${i}${j}: `;
                line += this.boardArray[i][j].toString();
                line += "  ";
            }
            console.log(line);
        }
        console.log(" ");
    }

    public makeMove(row: number, col: number) {
        this.moves += 1; // Number of which move.

        // Make sure it is within bounds.
        if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) {
            console.error("Out of bounds");
            return;
        }

        // In case of first move, set the board.
        if (this.moves == 1) {
            this.makeFirstMove(row, col);
            return;
        }

        this.boardArray[row][col].setType("number");
        console.log("New Board:");
        this.printBoard();
    }

    private makeFirstMove(row: number, col: number) {
        // console.log(`Making move: ${row} ${col}`);
        this.boardArray[row][col].setType("empty");
        this.bombList = this.getUniqueBombs(row, col);
        // console.log("Generated Pairs:", this.bombList);
        this.bombList.forEach((pair) => {
            // console.log("Pair: ", pair);
            // console.log("Before Move");
            // this.printBoard();
            this.boardArray[pair[0]][pair[1]].setType("bomb");
            // console.log("After Move");
            // this.printBoard();
        });
    }

    private getUniqueBombs(row: number, col: number) {
        const uniquePairs: Set<string> = new Set();
        uniquePairs.add(JSON.stringify([row, col]));
        const generatedPairs: [number, number][] = [];

        while (generatedPairs.length <= this.bombs) {
            const pair = this.getRandomPair();
            const pairKey = JSON.stringify(pair);
            if (!uniquePairs.has(pairKey)) {
                uniquePairs.add(pairKey);
                generatedPairs.push(pair);
            }
        }
        return generatedPairs;
    }

    private getRandomPair(): [number, number] {
        const row = Math.floor(Math.random() * this.rows);
        const col = Math.floor(Math.random() * this.cols);
        return [row, col];
    }

    public testing(row: number, col: number) {}
}

const board = new Board(5, 5, 5);
console.log("Game Start");
board.printBoard();
console.log("Making Move: 0,0");
board.makeMove(0, 0);
board.printBoard();
console.log("Making Move: 3,1");
board.makeMove(3, 1);
board.printBoard();
console.log("Making Move: 4,2");
board.makeMove(4, 1);
board.printBoard();

export {};
