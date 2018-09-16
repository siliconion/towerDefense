class Laser {
    constructor(mob, tower) {
        this.mob = mob;
        this.tower = tower;
    }

    draw() {
        myGameArea.context.beginPath();
        var gradient = myGameArea.context.createLinearGradient(
            this.tower.x,
            this.tower.y,
            this.mob.x,
            this.mob.y);
        gradient.addColorStop(.2, 'red');
        gradient.addColorStop(.4, 'orange');
        gradient.addColorStop(.6, 'yellow');
        gradient.addColorStop(0.8, 'green');
        gradient.addColorStop(1, 'blue');
        myGameArea.context.strokeStyle = gradient;
        myGameArea.context.lineWidth = 5;
        myGameArea.context.moveTo(this.mob.x, this.mob.y);
        myGameArea.context.lineTo(this.tower.x, this.tower.y);
        myGameArea.context.stroke();
        myGameArea.context.lineWidth = 1;
    }
}
