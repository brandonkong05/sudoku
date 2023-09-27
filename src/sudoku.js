export function newEmpty() {
    const emptyArray = Array(9).fill().map(() => Array(9).fill(0));
    return emptyArray;
}

export function shuffleArray(array) {
    for (let i = (array.length - 1); i > 0; i--) {
        const randomSwap = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[randomSwap]] = [array[randomSwap], array[i]];
    }
    return array;
}

export function returnNextEmpty(sudokuArray) {
    const nextEmptyLocation = {row: 0, col: 0};
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudokuArray[i][j] === 0) {
                nextEmptyLocation.row = i;
                nextEmptyLocation.col = j;
                return nextEmptyLocation;
            }
        }
    }
    nextEmptyLocation.row = -1;
    nextEmptyLocation.col = -1;
    return nextEmptyLocation;
}

export function checkLegalValue(sudokuArray, num, location) {
    let row = location.row;
    let col = location.col;
    let legal_row = true;
    let legal_col = true;
    let legal_subgrid = true;
    let empty = true;
    //ROW
    for (let i = 0; i < 9; i++) {
        if (sudokuArray[row][i] === num) {
            legal_row = false;
        }
    }
    //COL
    for (let i = 0; i < 9; i++) {
        if (sudokuArray[i][col] === num) {
            legal_col = false;
        }
    }
    //SUB-GRID
    let subgrid_row = Math.floor(row / 3);
    let subgrid_col = Math.floor(col / 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudokuArray[(subgrid_row * 3) + i][(subgrid_col * 3) + j] === num) {
                legal_subgrid = false;
            }
        }
    }
    //EMPTY
    if (sudokuArray[row][col] !== 0) {
        empty = false;
    }
    return (legal_row && legal_col && legal_subgrid && empty);
}

export function solveSudokuHelper(values, sudokuArray, counter) {
    const empty = returnNextEmpty(sudokuArray);
    if (empty.row === -1 && empty.col === -1) {
        return sudokuArray;
    }
    for (let i = 0; i < 9; i++) {
        counter++;
        if (counter > 50000000) {
            throw new Error("Recursion Timeout");
        }
        if (checkLegalValue(sudokuArray, values[i], empty)) {
            sudokuArray[empty.row][empty.col] = values[i];
            if (solveSudokuHelper(values, sudokuArray)) {
                return sudokuArray;
            }
            sudokuArray[empty.row][empty.col] = 0;
        }
    }
    return false;
}

export function solveSudoku(sudokuArray) {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return solveSudokuHelper(values, sudokuArray);
}

export function hasMultipleSolutions(sudokuArray) {
    const empty = returnNextEmpty(sudokuArray);
    let numSolutions = 0;
    if (numSolutions > 1) {
        return true;
    }
    if (empty.row === -1 && empty.col === -1) {
        numSolutions++;
        return false;
    }
    for (let i = 1; i < 10; i++) {
        if (checkLegalValue(sudokuArray, i, empty)) {
            sudokuArray[empty.row][empty.col] = i;
            if (hasMultipleSolutions(sudokuArray)) {
                return true;
            }
            sudokuArray[empty.row][empty.col] = 0;
        }
    }
    return false;
}

export function newSudoku(filledArray, numEmpty) {
    let removed = [];
    let possibleHoles = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const holeIndex = {row: i, col: j};
            possibleHoles.push(holeIndex);
        }
    }
    possibleHoles = shuffleArray(possibleHoles);
    while (removed.length < numEmpty) {
        const hole = possibleHoles.pop();
        if (hole === undefined) {
            throw new Error ("Cannot make board with unique solution");
        }
        const removedRow = hole.row;
        const removedCol = hole.col;
        if (filledArray[removedRow][removedCol] !== 0) {
            removed.push({
                removedValue: filledArray[removedRow][removedCol],
                row: removedRow,
                col: removedCol,
            });
            filledArray[removedRow][removedCol] = 0;
        }
        if (hasMultipleSolutions(filledArray.map(array => array.slice()))) {
            filledArray[removedRow][removedCol] = removed.pop().removedValue;
        }
    }
    return filledArray;
}

export function sudoku(numEmpty) {
    let values = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let empty = newEmpty();
    let counter = 0;
    let fill = solveSudokuHelper(values, empty, counter);
    return newSudoku(fill, numEmpty);
}