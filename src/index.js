import {Cell} from "./Cell.js";
let cols =30;
let rows = 30;

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

      let cell = new Cell(xPos, yPos, cWidth, cHeight, col_letter + (y).toString());

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
 * Draws the spreadsheet in the inital setup as well as any calls
 * if updates were made to redraw the canvas so we dont draw spreadsheet on
 * top of another one 
 * 
 * @param {*} width 
 * @param {*} height 
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
 * Clears the canvas 
 */
function clearCanvas(){
  console.log("clearing canvas");
  let canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Gets the X and Y position of the mouse click
 * @param {*} x 
 * @param {*} y 
 * @param {*} xOffset //the x offset of the canvas 
 * @param {*} yOffset //the y offset of the canvas
 * @returns //the cell that was clicked
 */
 function getCell(x, y, xOffset, yOffset){
  let cell = cells.find((cell) => {
    return cell.x <= x+xOffset && cell.x + cell.width+xOffset >= x && cell.y <= y+yOffset && cell.y + cell.height+yOffset >= y;
  });
  return cell;
}

function highlightCell(e){
  let ctx_xOffset = canvas.getBoundingClientRect().x;
  let ctx_yOffset = canvas.getBoundingClientRect().y;
  let prevSelected = selectedCell;
  selectedCell = getCell(e.clientX, e.clientY, ctx_xOffset, ctx_yOffset);
  if (selectedCell.isClickable()){
    drawSpreadsheet(width, height, ctx, canvas);
    selectedCell.highlight(ctx);
    if (selectedCell != prevSelected){
      selectedCellVal = "";
    }
  }
  else{
    selectedCell = prevSelected;
  }
}

function main(){
  addEventListener("click", (e) => {
    highlightCell(e);
  });

  addEventListener("keypress", (e) => {
    if (selectedCell != null){
      selectedCellVal += e.key;
      selectedCell.setCellValue(selectedCellVal);
      drawSpreadsheet(width, height, ctx, canvas);
    }
  });

  let refreshButton = document.getElementById("refresh");

  refreshButton.addEventListener("click", () => {
    selectedCell = null;
    drawSpreadsheet(width, height, ctx, canvas);
  });

  setupCells();
  drawSpreadsheet(width, height, ctx, canvas);
}

main();