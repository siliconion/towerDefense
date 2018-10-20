function Mob() {
    return {
        hp: mobInitHp + game.level * 3,
        speed: mobSpeed,
        damage: mobDamage,
        x_px: mobInitPositionX,
        y_px: Math.random() * 500,
        size: mobSize,
        worth: mobWorth,
        reach_the_end: false,
        die: function () {
            if (this.hp <= 0) {
                game.gold += this.worth;
                game.gold.innerText = game.gold;
            }
        },
        move: function () {
            this.x_px += this.speed;
            this.y_px += 0;
            if (this.x_px >= canvasWidth) {
                game.hp -= this.damage;
                hpElement.innerText = game.hp;
                this.reach_the_end = true;
            }
        },
        getDamage: function (damage) {
            this.hp -= damage
            hpElement.innerText = this.hp
        },
        draw: function () {
            ctx.beginPath();
            ctx.arc(this.x_px, this.y_px, this.size, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillStyle = "#F44444"
            ctx.fill();
        }
    };
}
