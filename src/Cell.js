export class Cell {
    constructor(x, y, width, height, letter, row) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.value = "";
        this.row = row;
        this.letter = letter;
        this.position = letter+row.toString();

        this.clickable = true;

        this.operation = "";
        this.function = "";
    }

    drawCell(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        let font_height = this.height * 0.5;
        ctx.font = font_height.toString()+"px Arial";
        ctx.fillText(this.value, this.x + 10, this.y + this.height/2+font_height/4);
    }

   
    highlight(ctx){
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    setClickable(isClickable){
        this.clickable = isClickable;
    }

    isClickable(){
        return this.clickable;
    }

    setCellValue(value) {
        if(this.isClickable){
            this.value = value;
            this.operation = "";
        }
    }

    getPosition(){
        return this.position;
    }

    validCells(cells){
        for (let i = 0; i < cells.length; i++){
            if (Object.is(parseFloat(cells[i].value), NaN)){
                return false;
            }
        }
        return true;
    }

    applyOperation(cells, operator){
        let result = 0;
        if (!this.validCells(cells)){
            this.value = "Error";
            return;
        }
        else{
            this.value = "Success";
            let num1 = parseFloat(cells[0].value);
            let num2 = parseFloat(cells[1].value);
            try{
                switch(operator){
                    case "+":
                        result = num1 + num2;
                        break;
                    case "-":
                        result = num1 - num2;
                        break;
                    case "*":
                        result = num1 * num2;
                        break;
                    case "/":
                        if (num2 == 0){
                            this.value = "Undefined";
                        }
                        result = num1 / num2;
                    }
            }
            catch(err){
                this.value = "Error";
                return;
            }
            this.operation = [cells, operator];
            this.value = result;
        }
    }

    applyFunction(cells, func){
        let result = 0;
        if (!this.validCells(cells)){
            this.value = "Error";
            return;
        }

        switch(func){
            case "=sum(":
                for (let i = 0; i < cells.length; i++){
                    result += parseFloat(cells[i].value);
                }
                break;
            case "=avg(":
                for (let i = 0; i < cells.length; i++){
                    result += parseFloat(cells[i].value);
                }
                result = result / cells.length;
                break;
            case "=min(":
                result = Number.MAX_VALUE;
                for (let i = 0; i < cells.length; i++){
                    if (parseFloat(cells[i].value) < result){
                        result = parseFloat(cells[i].value);
                    }
                }
                break;
            case "=max(":
                result = Number.MIN_VALUE;
                for (let i = 0; i < cells.length; i++){
                    if (parseFloat(cells[i].value) > result){
                        result = parseFloat(cells[i].value);
                    }
                }
                break;
        }
        this.function = [cells, func];
        this.value = result;
    }

    updateCell(){
        if (this.operation != ""){
            this.applyOperation(this.operation[0], this.operation[1]);
        }
        else if (this.function != ""){
            this.applyFunction(this.function[0], this.function[1]);
        }
    }
}