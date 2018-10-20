function Tower(x, y) {
    return {
        x: x,
        y: y,
        x_px: ( x + 0.5) * gridWidth,
        y_px: ( y + 0.5) * gridWidth,
        damage: towerDamage,
        range: towerRange,
        cooldown: towerCooldown,
        ready_to_attack: true,
        check_mob_in_range: function (m) {
            return (
                (m.x_px <= this.x_px + this.range) &
                (m.x_px >= this.x_px - this.range) &
                (m.y_px <= this.y_px + this.range) &
                (m.y_px >= this.y_px - this.range)
            );
        },
        get_in_range_mobs: function () {
            return game.mobs
                .filter(m => this.check_mob_in_range(m))
                .sort(function (a, b) {
                    // find the one closest to the end
                    return b.x - a.x;
                });
        },
        recharge: function () {
            setTimeout(() => {
                this.ready_to_attack = true;
            }, this.cooldown);
        },
        attack: function () {
            if (this.ready_to_attack) {
                // find the mob
                let in_range_mobs = this.get_in_range_mobs();

                if (in_range_mobs.length > 0) {
                    let targeted_mob = in_range_mobs[0];
                    laser = new Laser(targeted_mob, this);
                    laser.draw();
                    targeted_mob.getDamage(this.damage)
                    setTimeout(laser.remove, 300);
                    this.ready_to_attack = false;
                    this.recharge();
                }
            }
        },
        draw: function () {
            // draw tower itself
            ctx.strokeStyle = "#2211ff"
            ctx.beginPath();
            ctx.moveTo(
                this.x_px + gridWidth / 4,
                this.y_px - (gridWidth * 2) / 5
            );
            ctx.lineTo(
                this.x_px - gridWidth / 4,
                this.y_px - (gridWidth * 2) / 5
            );
            ctx.lineTo(
                this.x_px - (gridWidth * 2) / 5,
                this.y_px + (gridWidth * 2) / 5
            );
            ctx.lineTo(
                this.x_px + (gridWidth * 2) / 5,
                this.y_px + (gridWidth * 2) / 5
            );
            ctx.fillStyle = "#2211ff"
            ctx.fill();
            // draw laser
            // move draw laser here
        }
    };
}

class Laser {
    constructor(mob, tower) {
        this.mob = mob;
        this.tower = tower;
    }

    draw() {
        ctx.beginPath();
        var gradient = ctx.createLinearGradient(
            this.tower.x_px,
            this.tower.y_px,
            this.mob.x_px,
            this.mob.y_px);
        gradient.addColorStop(.2, 'red');
        gradient.addColorStop(.4, 'orange');
        gradient.addColorStop(.6, 'yellow');
        gradient.addColorStop(0.8, 'green');
        gradient.addColorStop(1, 'blue');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 5;
        ctx.moveTo(this.mob.x_px, this.mob.y_px);
        ctx.lineTo(this.tower.x_px, this.tower.y_px);
        ctx.stroke();
        ctx.lineWidth = 1;
    }
}
