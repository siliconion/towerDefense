
function Tower(x, y) {
    return {
        x: x,
        y: y,
        damage: tower_damage,
        range: tower_range,
        cooldown: tower_cooldown,
        ready_to_attack: true,
        check_mob_in_range: function (m) {
            return (
                (m.x <= this.x + this.range) &
                (m.x >= this.x - this.range) &
                (m.y <= this.y + this.range) &
                (m.y >= this.y - this.range)
            );
        },
        get_in_range_mobs: function () {
            return gameState.mobs
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
                    targeted_mob.hp -= this.damage;
                    setTimeout(laser.remove, 300);
                    this.ready_to_attack = false;
                    this.recharge();
                }
            }
        },
        draw: function () {
            myGameArea.context.beginPath();
            myGameArea.context.moveTo(
                this.x + grid_width / 4,
                this.y - (grid_width * 2) / 5
            );
            myGameArea.context.lineTo(
                this.x - grid_width / 4,
                this.y - (grid_width * 2) / 5
            );
            myGameArea.context.lineTo(
                this.x - (grid_width * 2) / 5,
                this.y + (grid_width * 2) / 5
            );
            myGameArea.context.lineTo(
                this.x + (grid_width * 2) / 5,
                this.y + (grid_width * 2) / 5
            );
            myGameArea.context.fillStyle = "#2211ff"
            myGameArea.context.fill();
        }
    };
}
//
// function rainbow() {
//     let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet']
//     return colors[Math.floor(Math.random() * 7)]
// }
//
// class Laser {
//     constructor(mob, tower) {
//         this.mob = mob;
//         this.tower = tower;
//     }
//
//     draw() {
//         myGameArea.context.beginPath();
//         myGameArea.context.moveTo(this.tower.x, this.tower.y);
//         myGameArea.context.lineTo(this.mob.x, this.mob.y);
//         myGameArea.context.lineWidth = 5;
//         myGameArea.context.strokeStyle= rainbow()
//         myGameArea.context.stroke();
//         myGameArea.context.lineWidth = 1;
//         myGameArea.context.fill();
//     }
//
//     remove() {
//         // TODO
//         myGameArea.context.beginPath();
//     }
// }
