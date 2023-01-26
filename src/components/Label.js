function point(x, y) {
    return {
        x: x,
        y: y
    };
}

function dist(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}
    

function getHandle(mouse, label, handleSize) {
        if (dist(mouse, point(label.x, label.y)) <= handleSize) return 'topleft';
        if (dist(mouse, point(label.x + label.w, label.y)) <= handleSize) return 'topright';
        if (dist(mouse, point(label.x, label.y + label.h)) <= handleSize) return 'bottomleft';
        if (dist(mouse, point(label.x + label.w, label.y + label.h)) <= handleSize) return 'bottomright';
        if (dist(mouse, point(label.x + label.w / 2, label.y)) <= handleSize) return 'top';
        if (dist(mouse, point(label.x, label.y + label.h / 2)) <= handleSize) return 'left';
        if (dist(mouse, point(label.x + label.w / 2, label.y + label.h)) <= handleSize) return 'bottom';
        if (dist(mouse, point(label.x + label.w, label.y + label.h / 2)) <= handleSize) return 'right';
        return false;
}
    

class Label {
    constructor(id, x, y, w, h, type, options) {
        this.id = id;
        /*
            coordinates = [
                top-left, top-right, bottom-right, bottom-left
            ]
        */ 
        this.type = type;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.coordinates = [
            [x, y],
            [x+w, y],
            [x+w, y+h],
            [x, y+h]
        ];
        /*
            lines = [
                (top-left to top-right),
                (top-right to bottom-right),
                (bottom-right to bottom-left),
                (bottom-left to top-left)
            ]
        */

        // this.lines = [
        //     (this.coordinates[0], this.coordinates[1]),
        //     (this.coordinates[1], this.coordinates[2]),
        //     (this.coordinates[2], this.coordinates[3]),
        //     (this.coordinates[3], this.coordinates[0]),
        // ];

        // TODO :  Add child / parent pointers

        this.currentHandle = true;
        this.drag = true;
        this.options = options;

    }

    draw(ctx) {

        ctx.lineWidth = "1";
        ctx.strokeStyle = this.options.labelHighlightColor;
        
       
        // ctx.setLineDash([20, 4]);            
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        ctx.closePath();
        console.log(this.currentHandle);
        if (this.currentHandle) {
            var posHandle = point(this.x, this.y);
            switch (this.currentHandle) {
                case 'topleft':
                    posHandle.x = this.x;
                    posHandle.y = this.y;
                    break;
                case 'topright':
                    posHandle.x = this.x + this.w;
                    posHandle.y = this.y;
                    break;
                case 'bottomleft':
                    posHandle.x = this.x;
                    posHandle.y = this.y + this.h;
                    break;
                case 'bottomright':
                    posHandle.x = this.x + this.w;
                    posHandle.y = this.y + this.h;
                    break;
                case 'top':
                    posHandle.x = this.x + this.w / 2;
                    posHandle.y = this.y;
                    break;
                case 'left':
                    posHandle.x = this.x;
                    posHandle.y = this.y + this.h / 2;
                    break;
                case 'bottom':
                    posHandle.x = this.x + this.w / 2;
                    posHandle.y = this.y + this.h;
                    break;
                case 'right':
                    posHandle.x = this.x + this.w;
                    posHandle.y = this.y + this.h / 2;
                    break;
            }
            ctx.globalCompositeOperation = 'xor';
            ctx.beginPath();
            ctx.arc(posHandle.x, posHandle.y, this.options.handleSize, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    toggleEditMode() {
        this.editable = true;
    }

    mouseDown(e, ctx, offsetLeft, offsetTop) {
        let mousePos = point(e.pageX - offsetLeft, e.pageY - offsetTop);
        console.log("REACHED MOUSE-DOWN", this.drag);
        if (this.currentHandle) this.drag = true;
        this.draw(ctx);
    }
    
    mouseUp(e, ctx, offsetLeft, offsetTop) {
        console.log("REACHED MOUSE-UP");
        this.drag = false;
        this.currentHandle = false;
        this.draw(ctx);
    }
    
    mouseMove(e, ctx, offsetLeft, offsetTop) {
        console.log("REACHED MOUSE-MOVE");
        var previousHandle = this.currentHandle;
        if (!this.drag) {
                this.currentHandle = getHandle(
                    point(e.pageX - offsetLeft, e.pageY - offsetTop),  this.options.handleSize
                );
            }
        if (this.currentHandle && this.drag) {
            let mousePos = point(e.pageX - offsetLeft, e.pageY - offsetTop);
            switch (this.currentHandle) {
                case 'topleft':
                    this.w += this.x - mousePos.x;
                    this.h += this.y - mousePos.y;
                    this.x = mousePos.x;
                    this.y = mousePos.y;
                    break;
                case 'topright':
                    this.w = mousePos.x - this.x;
                    this.h += this.y - mousePos.y;
                    this.y = mousePos.y;
                    break;
                case 'bottomleft':
                    this.w += this.x - mousePos.x;
                    this.x = mousePos.x;
                    this.h = mousePos.y - this.y;
                    break;
                case 'bottomright':
                    this.w = mousePos.x - this.x;
                    this.h = mousePos.y - this.y;
                    break;
    
                case 'top':
                    this.h += this.y - mousePos.y;
                    this.y = mousePos.y;
                    break;
    
                case 'left':
                    this.w += this.x - mousePos.x;
                    this.x = mousePos.x;
                    break;
    
                case 'bottom':
                    this.h = mousePos.y - this.y;
                    break;
    
                case 'right':
                    this.w = mousePos.x - this.x;
                    break;
            }
        }
        if (this.drag || this.currentHandle != previousHandle) this.draw(ctx);
    }

}


export default Label;