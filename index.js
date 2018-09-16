// initial constants
const canvas_width = 500;
const grid_number = 10;
const grid_width = canvas_width / grid_number;

const mob_init_hp = 100;
const mob_init_position_x = 0;
const mob_init_position_y = canvas_width / 2 - grid_width / 2;
const mob_size = 10;
const mob_speed = 1;
const mob_damage = 20;
const mob_worth = 10;

const start_gold = 100;
const start_hp = 100;
const tower_damage = 1;
const tower_range = canvas_width * 3;
const tower_cooldown = 1000;
const tower_cost = 40;

// global variables
let gameState;

window.onload = function() {
  addEventListeners();
  startGame();
};

let myGameArea = {
  canvas: document.createElement("canvas"),
  gold: document.getElementById("gold"),
  hp: document.getElementById("hp"),
  start: function() {
    this.canvas.width = canvas_width;
    this.canvas.height = canvas_width;
    this.context = this.canvas.getContext("2d");
    document.getElementById("game").appendChild(this.canvas);
  },
  clear: function() {
    this.context.clearRect(0, 0, canvas_width, canvas_width);
  }
};

let tempTowerRecord = [];

function calculateXYPixels(x, y) {
  // These sets of width height and num might want to be moved to outside....
  const width = myGameArea.canvas.width;
  const height = myGameArea.canvas.height;
  // this is currently hardcoded as
  const num_x = window.gameState.grid.num_x;
  const num_y = window.gameState.grid.num_y;

  const xPixel = width / num_x;
  const yPixel = height / num_y;

  const xPosition = x * xPixel;
  const yPosition = y * yPixel;

  return { xPosition, yPosition, xPixel, yPixel };
}
// const debounceChangeColorOnHover = changeColorOnHover;
const debounceChangeColorOnHover = debounce(100, changeColorOnHover);

function debounce(milliseconds, context) {
  const originalFunction = context;
  const wait = milliseconds;
  let timer = null;
  return function() {
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

function Timer() {
  return {
    init_time: new Date(),
    get_time: function() {
      return new Date().now() - this.init_time;
    }
  };
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
  };
  setInterval(runGame, 1000 / 60);
  setInterval(() => {
    gameState.spawnMob = true;
  }, 3000);
}

function runGame() {
  if (gameState.hp <= 0) {
    alert("GAME OVER");
    startGame();
  }
  // remove dead mobs
  gameState.mobs = gameState.mobs
    .filter(m => m.hp > 0)
    .filter(m => !m.reach_the_end);

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
    let new_mob = new Mob();
    gameState.mobs.push(new_mob);
    gameState.spawnMob = false;
  }
}

function Grid() {
  return (grid = {
    draw: function() {
      for (let i = 1; i < grid_number; i++) {
        myGameArea.context.moveTo(0, i * grid_width);
        myGameArea.context.lineTo(canvas_width, i * grid_width);
        myGameArea.context.stroke();
        myGameArea.context.moveTo(i * grid_width, 0);
        myGameArea.context.lineTo(i * grid_width, canvas_width);
        myGameArea.context.stroke();
      }
    },
    drawHoverEffect: function() {
      const { current, prev } = window.gameState.grid.hoveredBlock;
      const currentX = current.x;
      const currentY = current.y;
      const prevX = prev.x;
      const prevY = prev.y;

      if (currentX !== null && currentY !== null) {
        fillHoverBlock(currentX, currentY);
      }
      if (prevX !== null && prevY !== null) {
        cleanHoverBlock(prevX, prevY);
      }
    },
    hoveredBlock: {
      current: {
        x: null,
        y: null
      },
      prev: {
        x: null,
        y: null
      }
    },
    towers: [],
    tower_lookup: []
  });
}

function fillHoverBlock(x, y) {
  const { xPosition, yPosition, xPixel, yPixel } = calculateXYPixels(x, y);
  myGameArea.context.fillRect(xPosition, yPosition, xPixel, yPixel);
}

function cleanHoverBlock(x, y) {
  const { xPosition, yPosition, xPixel, yPixel } = calculateXYPixels(x, y);
  myGameArea.context.clearRect(xPosition, yPosition, xPixel, yPixel);
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
    move: function(delta_x, delta_y) {
      this.x += this.speed;
      this.y += 0;
      if (this.x >= canvas_width) {
        console.log("mob attack!", gameState.hp);
        gameState.hp -= this.damage;
        myGameArea.hp.innerText = gameState.hp;
        this.reach_the_end = true;
      }
    },
    draw: function() {
      myGameArea.context.beginPath();
      myGameArea.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      myGameArea.context.stroke();
      myGameArea.context.fill();
    }
  };
}

function Tower(x, y) {
  return {
    x: x,
    y: y,
    damage: tower_damage,
    range: tower_range,
    cooldown: tower_cooldown,
    ready_to_attack: true,
    check_mob_in_range: function(m) {
      return (
        (m.x <= this.x + this.range) &
        (m.x >= this.x - this.range) &
        (m.y <= this.y + this.range) &
        (m.y >= this.y - this.range)
      );
    },
    get_in_range_mobs: function() {
      return gameState.mobs
        .filter(m => this.check_mob_in_range(m))
        .sort(function(a, b) {
          // find the one closest to the end
          return b.x - a.x;
        });
    },
    attack: function() {
      if (this.ready_to_attack) {
        // find the mob
        let in_range_mobs = this.get_in_range_mobs();
        if (in_range_mobs.length > 0) {
          let targeted_mob = in_range_mobs[0];
          targeted_mob.hp -= this.damage;
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
    draw: function() {
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
  };
}
function placeTower(e) {
  if (gameState.gold < tower_cost) return;
  const xValue = e.offsetX;
  const yValue = e.offsetY;
  const x = Math.floor(xValue / grid_width) * grid_width + grid_width / 2;
  const y = Math.floor(yValue / grid_width) * grid_width + grid_width / 2;
  const uniqueXY = `${x}${y}`;
  !gameState.grid.tower_lookup.includes(uniqueXY)
    ? gameState.grid.tower_lookup.push(uniqueXY)
    : null;
  gameState.grid.towers.push(new Tower(x, y));
  gameState.gold -= tower_cost;
  myGameArea.gold.innerText = gameState.gold;
}

function changeColorOnHover(e) {
  const { hoveredBlock } = window.gameState.grid;
  const { current } = hoveredBlock;
  const { x, y } = calculateCoordinate(e.offsetX, e.offsetY);
  if (current.x && current.y) {
    hoveredBlock.prev = current;
  }
  hoveredBlock.current = { x, y };
}

function setTimeoutResetHover() {
  // reset needs to be in set time out to override debounce setTimeOut
  setTimeout(resetHover, 100);
}

function calculateCoordinate(offsetX, offsetY) {
  const width = myGameArea.canvas.width;
  const height = myGameArea.canvas.height;
  // this is currently hardcoded as
  const num_x = window.gameState.grid.num_x;
  const num_y = window.gameState.grid.num_y;

  const xPixel = width / num_x;
  const yPixel = height / num_y;

  const x = Math.floor(offsetX / xPixel);
  const y = Math.floor(offsetY / yPixel);
  return { x, y };
}

function resetHover() {
  const { x, y } = gameState.grid.hoveredBlock.current;
  const prevX = gameState.grid.hoveredBlock.prev.x;
  const prevY = gameState.grid.hoveredBlock.prev.y;
  cleanHoverBlock(x, y);
  cleanHoverBlock(prevX, prevY);
  window.gameState.grid.hoveredBlock.current.x = null;
  window.gameState.grid.hoveredBlock.current.y = null;
  window.gameState.grid.hoveredBlock.prev.x = null;
  window.gameState.grid.hoveredBlock.prev.y = null;
}

function finalizeTower() {
  // upon "finish building"
  const canvas = window.myGameArea.canvas;
  canvas.removeEventListener("mousemove", debounceChangeColorOnHover);
  canvas.removeEventListener("click", placeTower);
  canvas.removeEventListener("mouseleave", setTimeoutResetHover);
  canvas.removeEventListener("mouseover", debounceChangeColorOnHover);
  canvas.style.backgroundColor = "#dce4ec";
  resetHover();
  const button = document.getElementById("build-tower-button");
  button.disabled = false;
  const submitButton = document.getElementById("submit-tower");
  submitButton.parentNode.removeChild(submitButton);
}

function addEventListeners() {
  document.getElementById("build-tower-button").addEventListener("click", e => {
    const canvas = this.myGameArea.canvas;
    const button = e.target;
    button.disabled = true;

    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit Tower";
    submitButton.id = "submit-tower";
    const buildArea = document
      .getElementById("build_area")
      .appendChild(submitButton);
    submitButton.addEventListener("click", finalizeTower);

    canvas.style.backgroundColor = "grey";
    canvas.addEventListener("mouseleave", setTimeoutResetHover);
    canvas.addEventListener("mouseover", debounceChangeColorOnHover);
    canvas.addEventListener("mousemove", debounceChangeColorOnHover);
    canvas.addEventListener("click", placeTower);
  });
}
