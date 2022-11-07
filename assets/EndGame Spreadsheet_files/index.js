import {Cell} from "./Cell.js";
import {FixedCell} from "./FixedCell.js";
let cols = 100
let rows = 100

let width = window.innerWidth;
let height = window.innerHeight;
console.log(innerHeight)
console.log(innerWidth)

let cells = [];
    
async function createSpreadsheet(width, height, cols, rows) {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  let ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  canvas.style.border = "1px solid red"

  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      let cell = new Cell(y * width / cols, x * height / rows, width / cols, height / rows);
      cell.drawCell(ctx);
      cells.push(cell);
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      await sleep(1000);
    }
  }
}

function highlightCell(x, y) {
}

function main(){
  addEventListener("click", (e) => {
    //highlightCell(e.clientX, e.clientY);
  });

  createSpreadsheet(width, height, cols, rows);
}

main();