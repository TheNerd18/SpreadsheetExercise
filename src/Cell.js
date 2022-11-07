export class Cell {
    constructor(x, y, width, height, position) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = "";
        this.position = position;
        this.clickable = true;
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

    setCellValue(value) {
        this.value = value;
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

}