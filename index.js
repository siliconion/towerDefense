// initial constants
const canvas_width = 500
const grid_number = 10
const grid_width = canvas_width / grid_number

const mob_init_hp = 10
const mob_init_position_x = 0
const mob_init_position_y = canvas_width / 2 - grid_width / 2
const mob_size = 10
const mob_speed = 1
const mob_damage = 20
const mob_worth = 10

const start_gold = 100
const start_hp = 100

const tower_damage = 10
const tower_range = grid_width * 3
const tower_cooldown = 1000
const tower_cost = 40

//helpers
function calculateXYPixels(x, y) {
    const xPosition = x * grid_width;
    const yPosition = y * grid_width;
    return {xPosition, yPosition, xPixel: grid_width, yPixel: grid_width};
}
function calculateCoordinate(offsetX, offsetY) {
    const x = Math.floor(offsetX / grid_width);
    const y = Math.floor(offsetY / grid_width);
    return {x, y};
}
// const debounceChangeColorOnHover = changeColorOnHover;
const debounceChangeColorOnHover = debounce(100, changeColorOnHover);

function debounce(milliseconds, context) {
    const originalFunction = context;
    const wait = milliseconds;
    let timer = null;
    return function () {
        const self = context || this;
        const args = arguments;

        function complete() {
            originalFunction.apply(context, args);
            timer = null;
        }

        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(complete, wait);
    };
}

// global variables
let gameState;

window.onload = function () {
    addEventListeners();
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
    myGameArea.gold.innerText = gameState.gold
    myGameArea.hp.innerText = gameState.hp
    setInterval(runGame, 1000 / 60)
    setInterval(() => {
        gameState.spawnMob = true
    }, 3000)
}

function runGame() {
    if (gameState.hp <= 0) {
        alert("GAME OVER")
        startGame()
    }
    // remove dead mobs
    gameState.mobs = gameState.mobs.filter(m => m.hp > 0).filter(m => !m.reach_the_end)

    // Redraw
    myGameArea.clear();
    grid.drawHoverEffect();
    grid.draw();
    grid.towers.forEach(t => t.draw());
    gameState.mobs.forEach(m => {
        m.draw();
    });
    // mob move
    gameState.mobs.forEach(m => m.move());
    // new mob spawn
    spawn();

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
        gameState.level += 1
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

function Mob() {
    return {
        hp: mob_init_hp + 10 * gameState.level,
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
            if (this.x >= canvas_width) {
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
}

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
        attack: function () {
            if (this.ready_to_attack) {
                // find the mob
                let in_range_mobs = this.get_in_range_mobs();
                if (in_range_mobs.length > 0) {
                    let targeted_mob = in_range_mobs[0];
                    laser = new Laser(targeted_mob, this);
                    laser.draw();
                    targeted_mob.hp -= this.damage;
                    laser.remove();
                    if (targeted_mob.hp <= 0) {
                        gameState.gold += targeted_mob.worth;
                        myGameArea.gold.innerText = gameState.gold;
                    }
                    setInterval(() => {
                        this.ready_to_attack = true;
                    }, this.cooldown);
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
            myGameArea.context.fill();
        }
    }
}

function placeTower(e) {
    if (gameState.gold < tower_cost) return;
    const xValue = e.offsetX;
    const yValue = e.offsetY;
    const {x, y} = calculateCoordinate(xValue, yValue);
    const xTower = Math.floor(xValue / grid_width) * grid_width + grid_width / 2;
    const yTower = Math.floor(yValue / grid_width) * grid_width + grid_width / 2;
    const uniqueXY = `${x}${y}`;
    !gameState.grid.tower_lookup.includes(uniqueXY)
        ? gameState.grid.tower_lookup.push(uniqueXY)
        : null;
    gameState.grid.towers.push(new Tower(xTower, yTower));
    gameState.gold -= tower_cost;
    myGameArea.gold.innerText = gameState.gold;

    finalizeTower();
}

function fillHoverBlock(x, y) {
    const {xPosition, yPosition, xPixel, yPixel} = calculateXYPixels(x, y);
    myGameArea.context.fillRect(xPosition, yPosition, xPixel, yPixel);
}

function changeColorOnHover(e) {
    const {x, y} = calculateCoordinate(e.offsetX, e.offsetY);
    const uniqueXY = `${x}${y}`;
    gameState.grid.tower_lookup.includes(uniqueXY)
        ? (gameState.grid.hoveredBlock = {x: null, y: null})
        : (gameState.grid.hoveredBlock = {x, y});
}

function setTimeoutResetHover() {
    // reset needs to be in set time out to override debounce setTimeOut
    setTimeout(resetHover, 100);
}

function resetHover() {
    gameState.grid.hoveredBlock = {x: null, y: null};
}

function finalizeTower() {
    // upon "finish building"
    setTimeoutResetHover();

    const canvas = myGameArea.canvas;
    canvas.removeEventListener("click", placeTower);
    canvas.removeEventListener("mouseleave", setTimeoutResetHover);
    canvas.removeEventListener("mousemove", debounceChangeColorOnHover);
    canvas.removeEventListener("mouseover", debounceChangeColorOnHover);

    const button = document.getElementById("build-tower-button");
    button.disabled = false;
    // const submitButton = document.getElementById("submit-tower");
    // submitButton.parentNode.removeChild(submitButton);
}

function addEventListeners() {
    document.getElementById("build-tower-button").addEventListener("click", e => {
        const button = e.target;
        button.disabled = true;
        // const submitButton = document.createElement("button");
        // submitButton.innerText = "Start Game";
        // submitButton.id = "submit-tower";
        // const buildArea = document
        //   .getElementById("build_area")
        //   .appendChild(submitButton);
        // submitButton.addEventListener("click", finalizeTower);
        const canvas = myGameArea.canvas;
        canvas.addEventListener("mouseleave", setTimeoutResetHover);
        canvas.addEventListener("mouseover", debounceChangeColorOnHover);
        canvas.addEventListener("mousemove", debounceChangeColorOnHover);
        canvas.addEventListener("click", placeTower);
    });
}
