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
            ctx.fillStyle = "#DCE4EC"
            ctx.lineWidth = "2";
            ctx.strokeStyle = "red";
            ctx.rect(xi * gridWidth, yi * gridWidth, gridWidth, gridWidth);
            ctx.stroke();
            // if (game.userInputState == 'building' && mouseX == xi && mouseY == yi) {
            //     ctx.fillStyle = "#FF6A6A";
            //     ctx.fill();
            // }
            // draw the tower
            if (tower != null) {
                tower.draw()
            }
        }
    }
    return grid
}
