function Grid() {
    return (grid = {
        draw: function () {
            for (let i = 0; i <= grid_number; i++) {
                myGameArea.context.strokeStyle = "grey"
                myGameArea.context.moveTo(0, i * grid_width);
                myGameArea.context.lineTo(canvas_width, i * grid_width);
                myGameArea.context.stroke();
                myGameArea.context.moveTo(i * grid_width, 0);
                myGameArea.context.lineTo(i * grid_width, canvas_width);
                myGameArea.context.stroke();
            }
        },
        drawHoverEffect: function () {
            const {x, y} = gameState.grid.hoveredBlock;
            if (x !== null && y !== null) {
                fillHoverBlock(x, y);
            }
        },
        hoveredBlock: {
            x: null,
            y: null
        },
        towers: [],
        tower_lookup: []
    });
}