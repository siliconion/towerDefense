// initial constants
const canvas_width = 500
const grid_number = 10
const grid_width = canvas_width / grid_number

const mob_init_hp = 100
const mob_init_position_x = 0
const mob_init_position_y = canvas_width / 2 - grid_width / 2
const mob_size = 10
const mob_speed = 1
const mob_damage = 20
const mob_worth = 10

const start_gold = 100
const start_hp = 100
const tower_damage = 1
const tower_range = canvas_width * 3
const tower_cooldown = 1000
const tower_cost = 40


// global variables
let gameState;

window.onload = function () {
    addEventListeners()
    startGame();
};

let myGameArea = {
    canvas: document.createElement("canvas"),
    gold: document.getElementById("gold"),
    hp: document.getElementById("hp"),
    start: function () {
        this.canvas.width = canvas_width;
        this.canvas.height = canvas_width;
        this.context = this.canvas.getContext("2d");
        document.getElementById("game").appendChild(this.canvas);
    },
    clear: function () {
        this.context.clearRect(0, 0, canvas_width, canvas_width)
    }
};


function Timer() {
    return {
        init_time: new Date(),
        get_time: function () {
            return new Date().now() - this.init_time
        }
    }
}

function startGame() {
    // initialize board
    myGameArea.start();
    gameState = {
        gold: start_gold,
        hp: start_hp,
        level: 0,
        mobs: [],
        timer: Timer(),
        grid: Grid(),
        spawnMob: true
    }
    setInterval(runGame, 1000 / 60)
    setInterval(() => {
        gameState.spawnMob = true
    }, 3000)
}

function runGame() {
    if(gameState.hp <= 0){
        alert("GAME OVER")
        startGame()
    }
    // remove dead mobs
    gameState.mobs = gameState.mobs.filter(m => m.hp > 0).filter(m => !m.reach_the_end)

    // Redraw
    myGameArea.clear()
    grid.draw()
    grid.towers.forEach(t => t.draw())
    gameState.mobs.forEach(m => {
        m.draw()
    })
    // mob move
    gameState.mobs.forEach(m => m.move())
    // new mob spawn
    spawn()

    // towers
    grid.towers.forEach(t => t.attack());
    // build
}

function spawn() {
    // if spawnMob is true, make new mobs.
    if (gameState.spawnMob) {
        let new_mob = new Mob()
        gameState.mobs.push(new_mob)
        gameState.spawnMob = false
    }
}

function Grid() {
    return (grid = {
        draw: function () {
            for (let i = 1; i < grid_number; i++) {
                myGameArea.context.moveTo(0, i * grid_width);
                myGameArea.context.lineTo(canvas_width, i * grid_width);
                myGameArea.context.stroke();
                myGameArea.context.moveTo(i * grid_width, 0);
                myGameArea.context.lineTo(i * grid_width, canvas_width);
                myGameArea.context.stroke();
            }
        },
        towers: [],
        tower_lookup: []
    });
}

function Mob() {
    return {
        hp: mob_init_hp,
        speed: mob_speed,
        damage: mob_damage,
        x: mob_init_position_x,
        y: mob_init_position_y,
        size: mob_size,
        worth: mob_worth,
        reach_the_end: false,
        move: function (delta_x, delta_y) {
            this.x += this.speed
            this.y += 0
            if(this.x >= canvas_width) {
                console.log("mob attack!", gameState.hp)
                gameState.hp -= this.damage
                myGameArea.hp.innerText = gameState.hp
                this.reach_the_end = true
            }
        },
        draw: function () {
            myGameArea.context.beginPath();
            myGameArea.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            myGameArea.context.stroke();
            myGameArea.context.fill();
        }
    }
};

class Laser {
    constructor(mob, tower) {
      this.mob = mob;
      this.tower = tower;
    }

    draw() {
      myGameArea.context.beginPath();
      myGameArea.context.moveTo(this.tower.x, this.tower.y);
      myGameArea.context.lineTo(this.mob.x, this.mob.y);
      myGameArea.context.stroke();
      myGameArea.context.fill();
    }

    remove() {
      // TODO
      myGameArea.context.beginPath();
    }
};

function Tower(x, y) {
    return {
        x: x,
        y: y,
        damage: tower_damage,
        range: tower_range,
        cooldown: tower_cooldown,
        ready_to_attack: true,
        check_mob_in_range: function (m) {
            return (m.x <= this.x + this.range) & (m.x >= this.x - this.range) & (m.y <= this.y + this.range) & (m.y >= this.y - this.range)
        },
        get_in_range_mobs: function () {
            return gameState.mobs.filter(m => this.check_mob_in_range(m)
            ).sort(function (a, b) {
                // find the one closest to the end
                return (b.x - a.x)
            })

        },
        attack: function () {
            if (this.ready_to_attack) {
                // find the mob
                let in_range_mobs = this.get_in_range_mobs()
                if (in_range_mobs.length > 0) {
                    let targeted_mob = in_range_mobs[0]
                    laser = new Laser(targeted_mob, this)
                    laser.draw()
                    targeted_mob.hp -= this.damage
                    laser.remove()
                    if(targeted_mob.hp <= 0){
                        gameState.gold += targeted_mob.worth
                        myGameArea.gold.innerText = gameState.gold
                    }
                    setInterval(() => {
                        this.ready_to_attack = true
                    }, this.cooldown)
                }
            }
        },
        draw: function () {
            myGameArea.context.beginPath();
            myGameArea.context.moveTo(this.x + grid_width / 4, this.y - grid_width * 2 / 5);
            myGameArea.context.lineTo(this.x - grid_width / 4, this.y - grid_width * 2 / 5);
            myGameArea.context.lineTo(this.x - grid_width * 2 / 5, this.y + grid_width * 2 / 5);
            myGameArea.context.lineTo(this.x + grid_width * 2 / 5, this.y + grid_width * 2 / 5);
            myGameArea.context.fill();
        }
    }
}
;

function placeTower(e) {
    if(gameState.gold < tower_cost) return
    const xValue = e.offsetX;
    const yValue = e.offsetY;
    const x = Math.floor(xValue / grid_width) * grid_width + grid_width / 2;
    const y = Math.floor(yValue / grid_width) * grid_width + grid_width / 2;
    const uniqueXY = `${x}${y}`;
    !gameState.grid.tower_lookup.includes(uniqueXY) ? gameState.grid.tower_lookup.push(uniqueXY) : null;
    gameState.grid.towers.push(new Tower(x, y))
    gameState.gold -= tower_cost
    myGameArea.gold.innerText = gameState.gold

}

function addEventListeners() {
    document.getElementById("build-tower-button").onclick = e => {
        const canvas = myGameArea.canvas;
        canvas.addEventListener("click", placeTower);
    };
}
