import {Cell} from "./Cell.js";
let cols =50;
let rows = 50;

let width = window.innerWidth;
let height = window.innerHeight;
console.log(innerHeight)
console.log(innerWidth)

let cells = [];

let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");

let selectedCell = null;

let selectedCellVal = "";

let availableFunctions = ["=sum(", "=avg(", "=min(", "=max("];

/**
 * Gets the letter for the column number using math
 * If there are more than 26 then it adds correct letter to the front
 * @param {*} num 
 * @returns 
 */
function getLetter(num) {
  let alpha_num = (num)%26;
  let prenum = Math.trunc((num)/26);
  if (prenum <= 0){
    return String.fromCharCode(65+alpha_num);
  }
  else{
    return String.fromCharCode(65+prenum-1) + String.fromCharCode(65+alpha_num);
  }
}

/**
 * Sets up the cells for the spreadsheet
 */
function setupCells(){
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let xPos = x * width / cols;
      let yPos = y * height / rows;
      let cWidth = width / cols;
      let cHeight = height / rows;
      let col_letter = getLetter(x-1);

      let cell = new Cell(xPos, yPos, cWidth, cHeight, col_letter, y);

      if (x==0 && y!=0){
        cell.setCellValue(y);
        cell.setClickable(false);
      }
      else if (y==0 && x!=0){
        cell.setCellValue(col_letter);
        cell.setClickable(false);
      }
      else if (x==0 && y==0){
        cell.setClickable(false);
      }
      cells.push(cell);
    }
  }
}

/**
 * Clears the canvas 
 */
function clearCanvas(){
  let canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the spreadsheet in the inital setup as well as any calls
 * if updates were made to redraw the canvas so we dont draw spreadsheet on
 * top of another one 
 * 
 * @param {int} width 
 * @param {int} height 
 * @param {*} ctx 
 * @param {*} canvas 
 */
function drawSpreadsheet(width, height, ctx, canvas) {
  clearCanvas();
  ctx.translate(0.5, 0.5);
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = "1px solid red"

  //loop through cells and draw them
  for (let i = 0; i < cells.length; i++) {
    cells[i].drawCell(ctx);
  }
  if (selectedCell != null){
    selectedCell.highlight(ctx);
  }
}

/**
 * Gets the X and Y position of the mouse click
 * and returns the cell within that click
 * 
 * @param {float} x 
 * @param {float} y 
 * @param {float} xOffset //the x offset of the canvas 
 * @param {float} yOffset //the y offset of the canvas
 * @returns //the cell that was clicked
 */
 function getSelectedCell(x, y, xOffset, yOffset){
  let cell = cells.find((cell) => {
    return cell.x <= x+xOffset && cell.x + cell.width+xOffset >= x && cell.y <= y+yOffset && cell.y + cell.height+yOffset >= y;
  });
  return cell;
}

/**
 * Gets the canvas offset and mouse coords
 * and calls the getSelectedCell function
 * 
 * If it is clickable then it will set the selected cell to the clicked cell
 * if not it will reset the selected cell to its previous selected
 * @param {*} e the event that is passed in
 */
function highlightCell(e){
  let ctx_xOffset = canvas.getBoundingClientRect().x;
  let ctx_yOffset = canvas.getBoundingClientRect().y;
  let prevSelected = selectedCell;
  selectedCell = getSelectedCell(e.clientX, e.clientY, ctx_xOffset, ctx_yOffset);
  if (selectedCell.isClickable()){
    drawSpreadsheet(width, height, ctx, canvas);
    selectedCell.highlight(ctx);
    if (selectedCell != prevSelected){
      finalCellVal();
    }
  }
  else{
    selectedCell = prevSelected;
  }
}

/**
 * Gets the cell below the selected cell
 * to make it the new selected cell
 */
function selectCellBelow(){
  let index = cells.indexOf(selectedCell);
  if (index+cols < cells.length){
    selectedCell = cells[index+cols];
    selectedCell.highlight(ctx);
  }
}

/**
 * Passes through an array of strings with positions
 * typed by the user
 * 
 * Returns all the cells that are referenced in the array
 * if they exist
 * @param {Array} cellPositions 
 * @returns 
 */
function getCellsFromPos(cellPositions){
  let operatorCells = [];
  for (let i = 0; i < cellPositions.length; i++){
    for (let j = 0; j < cells.length; j++){
      if (cells[j].getPosition() == cellPositions[i]){
        operatorCells.push(cells[j]);
      }
    }
  }
  return operatorCells;
}

/**
 * Applies basic operations to 2 different cells
 * @returns 
 */
function applyOperations(){
  //Get all the cell positions in a single array in order
  let cellOrder = selectedCellVal.split(/[=,+,\-,*,/]+/); 

  //Remove the first element as it is empty
  cellOrder.shift();

  //Get all the operators in a single array in order
  let operatorOrder = selectedCellVal.split(/[=,A-Z,a-z,0-9]+/);

  //Remove the first and last element as they are empty
  operatorOrder.shift();
  operatorOrder.pop();

  try {
    let operatorCells = getCellsFromPos(cellOrder);
    if ((operatorCells.length!=2 && operatorOrder.length!=1)){
      selectedCell.setCellValue("Error");
      return;
    }
    selectedCell.applyOperation(operatorCells, operatorOrder[0]);
  } catch (error) {
    selectedCell.setCellValue("Error");
    return;
  }
}

/**
 * Called after the redraw to update the values of any cells
 * with operations applied to them
 */
function updateCells(){
  for (let i = 0; i < cells.length; i++){
    if (cells[i].isClickable()){
      cells[i].updateCell();
    }
  }
}

/**
 * If the selected cell value starts with a valid function
 * defined in the array, then return true
 * @param {string} str 
 * @param {Array} array 
 * @returns 
 */
function arrayStartsWith(str, array){
  return array.some(substr => str.startsWith(substr));
}

/**
 * Called when the user presses enter or clicks away from the cell
 * Resets the cell val to start afresh
 */
function finalCellVal(){
  if (arrayStartsWith(selectedCellVal, availableFunctions)){
    console.log(selectedCellVal);
    selectedCell.setCellValue("Function");
  }
  else if (selectedCellVal.startsWith("=")){
    applyOperations();
    selectedCellVal = "";
  }
  selectedCellVal = "";
  updateCells();
}

/**
 * The eveny listerners for the canvas
 */
function addListeners(){
  addEventListener("click", (e) => {
    highlightCell(e);
  });

  addEventListener("keydown", (e) => {
    const key = e.key;
    switch (key) {
      case "Enter":
        finalCellVal();
        selectCellBelow();
        break;
      case "Backspace":
        selectedCellVal = selectedCellVal.slice(0, -1);
        selectedCell.setCellValue(selectedCellVal);
        break;
      case "Tab":
        finalCellVal();
        let index = cells.indexOf(selectedCell);

        selectedCell = cells[index+1];
        selectedCell.highlight(ctx);
        break;
      case "Shift":
        break;
      default:
        //Prevents user from typing keys with multiple letters i.e. ArrowUp or ArrowDown
        if(e.key.length>1){
          return;
        }

        if (selectedCell != null){
          selectedCellVal += e.key;
          selectedCell.setCellValue(selectedCellVal);
        }
        break;
    }
    drawSpreadsheet(width, height, ctx, canvas);
  });
}

function main(){
  addListeners();

  let refreshButton = document.getElementById("refresh");

  refreshButton.addEventListener("click", () => {
    selectedCell = null;
    drawSpreadsheet(width, height, ctx, canvas);
  });

  setupCells();
  drawSpreadsheet(width, height, ctx, canvas); //Initial draw of the spreadsheet
}

main();