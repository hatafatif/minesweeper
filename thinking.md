# Minesweeper
Object Oriented, DSA and TS Practice.

## Breaking Down the project
We can break it down as: <br>

TODO: Wrap all the game logic in a Game class.

- Start the game
- Initialize a board with every cell empty and wait for user to click
- On first click, develop a random arrangement of bombs and numbers, and the first cell is not a bomb
- Develop an algorithm that calculates the new value for all the elements in the board
    - Let us use array or arrays as a data structure for the board, because that is what a square board is like.
    - The array of arrays would contain Cell objects
    - **Cell Object**:
        - Value Attribute: Is it a Bomb, Number or Empty. Separating Empty from Number is important because results of clicking them is different. Number reveals just that cell whereas empty reveals that cell and all the other cells surrounding them.  
        - Revealed Attribute: Is the cell revealed or not. If it is not revealed, we can remove the click handler from it.
        - Reveal Method(): If not revealed then reveal else nothing.
    - **Board Object**:
        - Bombs, Rows and Columns Attributes: Board is initialized with these values. 
        - Cells Attribute: Array of Arrays initialized from the inputted rows and columns to form the board.
        - Create Board Method: Constructor to create all cells empty
        - Game Start Method: This would run after the user makes their first click. 
            - It would first take the cell that user took as input. This cell needs to be empty (neither bomb nor number) in every case.
            - Set the bombs; assume 10.
                - Find 10 random cell numbers and place bombs in them. 
                - We can create two helper functions that would translate ROWxCOL of cell to Number of Cell. 
                    - Let's assume a grid of 5x5
                        - The cell grid[3][2] is the 4th row, 3rd column. This would be the (4-1)*len(row) + 3rd cell. In this case, this would be (4-1) * 5 + 3 = 18th cell.
                        - The 16th cell would be 16 / len(row) + 1 row and 16 % len(row) column, in this would be 4th row and 1st column, which would be grid[3][0]
                - We need to do this first before finding the numbers of other cells because if we are traversing the array of arrays, we already need to know ahead of time if there is a bomb in any of the direction. 
            - Find the values of cells:
                - Traverse the complete grid. 
                - For every grid, check all directions. We can create helper functions here who would input a cell and return L, R, T, B, TR, TL, BR and BL cells. 
                - A function would check how many of these cells have bombs. If there are any, then this would sum all of these and store as value of that cell.
        - Make Move Method: Every other move after the first move has been made will be done using this method.
            - This method needs to see which Cell was clicked. 
            - If cell was already revealed, do nothing.
            - If clicked was a bomb: game end (LOST)
            - If clicked was a number: reveal number.
            - If clicked was empty/number 0: Reveal that number and also use reveal on all other cells around this cell.
            - Check if numbers of cells left are equal to number of bombs. If so, game end (WIN)
            