function Mob() {
    return {
        hp: mob_init_hp + gameState.level * 3,
        speed: mob_speed,
        damage: mob_damage,
        x: mob_init_position_x,
        y: Math.random() * 500,
        size: mob_size,
        worth: mob_worth,
        reach_the_end: false,
        die: function () {
            if (this.hp <= 0) {
                gameState.gold += this.worth;
                myGameArea.gold.innerText = gameState.gold;
            }
        },
        move: function (delta_x, delta_y) {
            this.x += this.speed;
            this.y += 0;
            if (this.x >= canvas_width) {
                console.log("mob attack!", gameState.hp);
                gameState.hp -= this.damage;
                myGameArea.hp.innerText = gameState.hp;
                this.reach_the_end = true;
            }
        },
        draw: function () {
            myGameArea.context.beginPath();
            myGameArea.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            myGameArea.context.stroke();
            myGameArea.context.fillStyle = "#F44444"
            myGameArea.context.fill();
        }
    };
}