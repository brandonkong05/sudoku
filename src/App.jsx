import { useState, useEffect } from 'react'
import { newEmpty, shuffleArray, returnNextEmpty, checkLegalValue, solveSudokuHelper, solveSudoku, hasMultipleSolutions, newSudoku, sudoku } from './sudoku.js'
import './App.css'

function App() {
  const emptyPuzzle = () => {
    let puzzle = [...Array(9)].map(() => Array(9));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        puzzle[i][j] = {row: i, col: j, value: 0, prefilled: true};
      }
    }
    return puzzle;
  }

  const [sudokuPuzzle, setSudokuPuzzle] = useState(emptyPuzzle());

  const [originalPuzzle, setOriginalPuzzle] = useState(emptyPuzzle());

  const [currentLocation, setCurrentLocation] = useState({row: -1, col: -1});


  const newGame = (numEmpty) => {
    let grid = sudoku(numEmpty);
    setOriginalPuzzle(grid);
    let puzzle = [...Array(9)].map(() => Array(9));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        puzzle[i][j] = {row: i, col: j, value: grid[i][j], prefilled: (grid[i][j] > 0)};
      }
    }
    setSudokuPuzzle(puzzle);
    let boxes = document.querySelectorAll("td");
    boxes.forEach((box) => {
      box.setAttribute("clickable", "false");
    });
  };

  const showSolution = () => {
    let values = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let counter = 0;
    let solvedGrid = solveSudokuHelper(values, originalPuzzle, counter);
    console.log(solvedGrid);
    let grid = [...Array(9)].map(() => Array(9));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let val = solvedGrid[i][j];
        grid[i][j] = {row: i, col: j, value: val, prefilled: true};
      }
    }
    console.log(grid);
    setSudokuPuzzle(grid);
  }

  const check = () => {
    let grid = [...Array(9)].map(() => Array(9));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        grid[i][j] = sudokuPuzzle[i][j].value;
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let current = grid[i][j];
        grid[i][j] = 0;
        if (checkLegalValue(grid, current, {row: i, col: j})) {
          grid[i][j] = current;
        }
        else {
          return false;
        }
      }
    }
    return true;
  }

  const checkSolution = () => {
    if (check()) {
      window.alert("Congrats! You finished the puzzle!");
    }
    else {
      window.alert("There seems to be something wrong with your solution. Try again!");
    }
  }

  const changeLocation = (newRow, newCol) => {
    let location = {row: newRow, col: newCol};
    setCurrentLocation(location);
  }

  const inputValue = (input) => {
    const row = currentLocation.row;
    const col = currentLocation.col;
    let grid = [...Array(9)].map(() => Array(9));
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          grid[i][j] = sudokuPuzzle[i][j];
        }
      }
    if (row != -1 && col != -1 && sudokuPuzzle[row][col].prefilled === false) {
      grid[row][col].value = input; 
    }
    setSudokuPuzzle(grid);
  }

  useEffect(() => {
    let cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      let row = Number(cell.getAttribute("row"));
      let col = Number(cell.getAttribute("col"));
      if (sudokuPuzzle[row][col].value > 0) {
        cell.innerHTML = sudokuPuzzle[row][col].value;
      }
      else {
        cell.innerHTML = " ";
      }
      if (sudokuPuzzle[row][col].prefilled === false && cell.getAttribute("clickable") === "false") {
        cell.addEventListener("click", () => changeLocation(row, col));
        cell.setAttribute("clickable", "true");
      }
    })
    
  });

  return (
    <>
      <div className="header">
        <h1>Sudoku</h1>
        <h2>Directions:</h2>
        <p>Generate a new Sudoku board by selecting one of the three difficulties. 
          To input a value into the board, first click on the cell you wish to modify 
          and then click on one of the input buttons. The Sudoku board is completed when
          the numbers 1-9 appear only once in every row, column, and 3x3 sub-grid. You have 
          the options to check your current solution and show the correct solution.</p>
      </div>
      <div className="new-game">
        New Game:
        <div className="new-game-buttons">
          <button type="button" className="easy" onClick={() => newGame(30)}>Easy</button>
          <button type="button" className="medium" onClick={() => newGame(40)}>Medium</button>
          <button type="button" className="hard" onClick={() => newGame(50)}>Hard</button>
        </div>
      </div>
      <div className="game">
        <div className="input">
          Inputs:
          <div className="input-buttons">
            <button type="button" value="1" onClick={() => inputValue(1)}>1</button>
            <button type="button" value="2" onClick={() => inputValue(2)}>2</button>
            <button type="button" value="3" onClick={() => inputValue(3)}>3</button>
            <button type="button" value="4" onClick={() => inputValue(4)}>4</button>
            <button type="button" value="5" onClick={() => inputValue(5)}>5</button>
            <button type="button" value="6" onClick={() => inputValue(6)}>6</button>
            <button type="button" value="7" onClick={() => inputValue(7)}>7</button>
            <button type="button" value="8" onClick={() => inputValue(8)}>8</button>
            <button type="button" value="9" onClick={() => inputValue(9)}>9</button>
            <button type="button" className="erase" onClick={() => inputValue(0)}>Erase</button>
          </div>
        </div>
        <table id="board">
          <tbody>
            <tr className="row-0">
              <td row="0" col="0"></td>
              <td row="0" col="1"></td>
              <td row="0" col="2"></td>
              <td row="0" col="3"></td>
              <td row="0" col="4"></td>
              <td row="0" col="5"></td>
              <td row="0" col="6"></td>
              <td row="0" col="7"></td>
              <td row="0" col="8"></td>
            </tr>
            <tr className="row-1">
              <td row="1" col="0"></td>
              <td row="1" col="1"></td>
              <td row="1" col="2"></td>
              <td row="1" col="3"></td>
              <td row="1" col="4"></td>
              <td row="1" col="5"></td>
              <td row="1" col="6"></td>
              <td row="1" col="7"></td>
              <td row="1" col="8"></td>
            </tr>
            <tr className="row-2">
              <td row="2" col="0"></td>
              <td row="2" col="1"></td>
              <td row="2" col="2"></td>
              <td row="2" col="3"></td>
              <td row="2" col="4"></td>
              <td row="2" col="5"></td>
              <td row="2" col="6"></td>
              <td row="2" col="7"></td>
              <td row="2" col="8"></td>
            </tr>
            <tr className="row-3">
              <td row="3" col="0"></td>
              <td row="3" col="1"></td>
              <td row="3" col="2"></td>
              <td row="3" col="3"></td>
              <td row="3" col="4"></td>
              <td row="3" col="5"></td>
              <td row="3" col="6"></td>
              <td row="3" col="7"></td>
              <td row="3" col="8"></td>
            </tr>
            <tr className="row-4">
              <td row="4" col="0"></td>
              <td row="4" col="1"></td>
              <td row="4" col="2"></td>
              <td row="4" col="3"></td>
              <td row="4" col="4"></td>
              <td row="4" col="5"></td>
              <td row="4" col="6"></td>
              <td row="4" col="7"></td>
              <td row="4" col="8"></td>
            </tr>
            <tr className="row-5">
              <td row="5" col="0"></td>
              <td row="5" col="1"></td>
              <td row="5" col="2"></td>
              <td row="5" col="3"></td>
              <td row="5" col="4"></td>
              <td row="5" col="5"></td>
              <td row="5" col="6"></td>
              <td row="5" col="7"></td>
              <td row="5" col="8"></td>
            </tr>
            <tr className="row-6">
              <td row="6" col="0"></td>
              <td row="6" col="1"></td>
              <td row="6" col="2"></td>
              <td row="6" col="3"></td>
              <td row="6" col="4"></td>
              <td row="6" col="5"></td>
              <td row="6" col="6"></td>
              <td row="6" col="7"></td>
              <td row="6" col="8"></td>
            </tr>
            <tr className="row-7">
              <td row="7" col="0"></td>
              <td row="7" col="1"></td>
              <td row="7" col="2"></td>
              <td row="7" col="3"></td>
              <td row="7" col="4"></td>
              <td row="7" col="5"></td>
              <td row="7" col="6"></td>
              <td row="7" col="7"></td>
              <td row="7" col="8"></td>
            </tr>
            <tr className="row-8">
              <td row="8" col="0"></td>
              <td row="8" col="1"></td>
              <td row="8" col="2"></td>
              <td row="8" col="3"></td>
              <td row="8" col="4"></td>
              <td row="8" col="5"></td>
              <td row="8" col="6"></td>
              <td row="8" col="7"></td>
              <td row="8" col="8"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="option">
        Options:
        <div className="option-buttons">
          <button type="button" className="check" onClick={() => checkSolution()}>Check Solution</button>
          <button type="button" className="show" onClick={() => showSolution()}>Show Solution</button>
        </div>
      </div>
    </>
  )
}

export default App
