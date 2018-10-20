// initial constants
const canvasWidth = 500;
const gridNumber = 10;
const gridWidth = canvasWidth / gridNumber;

const mobInitHp = 100;
const mobInitPositionX = 0;
const mobInitPositionY = canvasWidth / 2 - gridWidth / 2;
const mobSize = 10;
const mobSpeed = 1;
const mobDamage = 10;
const mobWorth = 2;
const mobSpawnCountdown = 3000;

const startGold = 200;
const startHp = 100;
const towerDamage = 100;
const towerRange = gridWidth * 2;
const towerCooldown = 1000;
const towerCost = 40;


let canvas = document.getElementById("canvas");
canvas.width = canvasWidth;
canvas.height = canvasWidth;
let ctx = canvas.getContext("2d");
let goldElement = document.getElementById("gold");
let hpElement = document.getElementById("hp");
let levelElement = document.getElementById("level");
let mouseX = -1;
let mouseY = -1

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.grid.draw();
    game.mobs.forEach(m => {
        m.draw();
    });
}

function processInput() {
    // build towers?
    // if click on build tower button
    if (game.userInputState == 'building') {
        // highlight selected grid
    }
    // if click on the grid when underInputState is 1
    if (game.userInputState == 'built') {
        // add tower to grid
        game.userInputState = 'idle'
    }

}

function update() {

    // towers attach mobs
    game.grid.get_towers().forEach(t => t.attack())

    // remove dead mobs
    game.mobs = game.mobs
        .filter(m => m.hp > 0)
        .filter(m => !m.reach_the_end);

    // mob moves
    game.mobs.forEach(m => m.move());
    spawn();
}


let game = {
    gold: startGold,
    hp: startHp,
    level: 0,
    grid: [],
    mobs: [],
    spawnMob: true,
    spawn_countdown: null,
    userInputState: 'idle'
}

function initGame() {
    game.gold = startGold;
    game.hp = startHp;
    game.level = 0;
    game.mobs = [];
    game.grid = new Grid(gridNumber);
    // game.timer = new Timer();
    game.spawnMob = true
    runGame();
}

function runGame() {
    // Check if the game is over
    if (game.hp <= 0) {
        endGame()
    }
    // process input
    processInput()
    // update
    update()
    // render
    render()

    requestAnimationFrame(runGame);
}

function endGame() {
    console.log('the game has ended')
    clearTimeout(game.spawn_countdown)
    // game.start();
}


window.onload = () => {
    addEventListeners();
    initGame();
};


function spawn() {
    // if spawnMob is true, make new mobs.
    if (game.spawnMob) {
        let new_mob = new Mob();
        game.mobs.push(new_mob);
        game.level += 1;
        levelElement.innerText = Math.floor((game.level) / 10);

        game.spawnMob = false;
        game.spawn_cooldown = mobSpawnCountdown * Math.pow(0.995, game.level)
        game.spawn_countdown =
            setTimeout(() => {
                game.spawnMob = true;
            }, game.spawn_cooldown)
    }
}
