// var attacker = require("./js/attacker")

window.onload = function () {
    startGame()
}

var gameState = {}

function startGame() {
    myGameArea.start();
    setInterval(runGame, 100)
}

function runGame() {
    grid.draw()
    // re draw
    // spawn attackers
    // track attacker HP
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.getElementById("game").appendChild(this.canvas);
    }
}

var grid = {
    num_x: 10,
    num_y: 10,
    draw: function () {
        dist_x = myGameArea.canvas.width / this.num_x
        dist_y = myGameArea.canvas.height / this.num_y
        for (let i = 1; i < this.num_x; i++) {
            myGameArea.context.moveTo(0, i * dist_x);
            myGameArea.context.lineTo(myGameArea.canvas.width, i * dist_x);
            myGameArea.context.stroke();
        }
        for (let i = 1; i < this.num_y; i++) {
            myGameArea.context.moveTo(i * dist_y, 0);
            myGameArea.context.lineTo(i * dist_y, myGameArea.canvas.height);
            myGameArea.context.stroke();
        }
    }
}

var mob = {

}

var tower = {

}