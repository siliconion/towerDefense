function Grid(grid_number) {
    let grid = {
        gridNumber: grid_number,
        gridMap: new Array(grid_number).fill(0).map(row => new Array(grid_number).fill(null)),
        get_towers: function () {
            return this.gridMap.reduce((acc, val) => acc.concat(val), []).filter(t=>t)
        },
        draw: function () {
            // draw each tile in the grid
            this.gridMap.forEach((yv, yi) => yv.forEach((xv, xi) => this.drawTile(xv, xi, yi)))
        },
        drawTile: function (tower, xi, yi) {
            // draw the grid
            ctx.lineWidth = "2";
            ctx.strokeStyle = "red";
            ctx.fillStyle = "#DCE4EC";
            ctx.rect(xi * gridWidth, yi * gridWidth, gridWidth, gridWidth);
            if (game.userInputState == 'building' && mouseInRect(game.mouseX, game.mouseY, xi, yi)) {
                ctx.fillStyle = "#FF6A6A";
                let highlight_coords = calcCoords(game.mouseX, game.mouseY);
                ctx.fillRect(highlight_coords[0], highlight_coords[1], gridWidth, gridWidth);
            }
            ctx.stroke();
            // draw the tower
            if (tower != null) {
                tower.draw()
            }
        }
    }
    return grid
}

function mouseInRect(x, y, xi, yi) {
    const mouse_in_x = (x >= xi * gridWidth) && (x < (xi + 1) * gridWidth);
    const mouse_in_y = (y >= yi * gridWidth) && (y < (yi + 1) * gridWidth);
    return mouse_in_x && mouse_in_y
}

function calcCoords(offsetX, offsetY) {
    const x = Math.floor(offsetX / gridWidth) * gridWidth;
    const y = Math.floor(offsetY / gridWidth) * gridWidth;
    return [x, y];
}