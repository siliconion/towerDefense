// initial values
mob_init_hp = 100;
mob_init_position_x = 0;
mob_init_position_y = 0;
mob_size = 10;
start_gold = 100;
start_hp = 1000;

window.onload = function() {
  // init,
  startGame();
};
const tempTowerRecord = [];

var gameState;

function startGame() {
  // initialize board
  myGameArea.start();
  gameState = {
    gold: start_gold,
    hp: start_hp,
    level: 0,
    mobs: [],
    timer: 0,
    grid: Grid()
  };
  // grid
  setInterval(runGame, 100);
  addEventListeners();
}

function runGame() {
  // increase game clock
  // redraw
  var mobs = [];
  grid.draw();
  grid.towers.forEach(t => t.draw());
  gameState.mobs.forEach(m => m.draw());

  // mobs
  // spawn
  spawn();
  // take damage
  mobs.forEach(m => m.takeDamage());
  // move
  mobs.forEach(m => m.move());

  // towers
  // attack?
  grid.towers.forEach(t => t.target());
  // build
}

function spawn() {
  // if timer is spawn_interval, add X mobs in to mobs
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.getElementById("game").appendChild(this.canvas);
  }
};

function Grid() {
  return (grid = {
    num_x: 10,
    num_y: 10,
    draw: function() {
      dist_x = myGameArea.canvas.width / this.num_x;
      dist_y = myGameArea.canvas.height / this.num_y;
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
    },
    towers: [],
    build_tower: function(x, y) {
      // check if it's a valid location
      // if so build the tower
      const canvas = document.getElementsByTagName("canvas");
      canvas.style.backgroundColor = "blue";
    }
  });
}

function Mob() {
  return {
    hp: mob_init_hp,
    speed: mob_speed,
    location_x: mob_init_position_x,
    location_y: mob_init_position_y,
    move: function(delta_x, delta_y) {
      this.location_x += delta_x;
      this.location_y += delta_y;
    },
    targeted_damage: 0,
    take_damage: function() {
      this.hp -= this.targeted_damage; // ?????
    },
    draw: function() {
      myGameArea.context.beginPath();
      myGameArea.context.arc(location_x, location_y, mob_size, 0, 2 * Math.PI);
      myGameArea.context.stroke();
    }
  };
}

function Tower(x, y) {
  return {
    x: x,
    y: y,
    damage: tower_damage,
    range: tower_range,
    target: function() {
      // find the mob
      // add possible damage to the mob
    }
  };
}

function placeTower(e) {
  const xValue = e.offsetX;
  const yValue = e.offsetY;
  const x = Math.floor(xValue / 50);
  const y = Math.floor(yValue / 50);
  const uniqueXY = `${x}${y}`;
  !tempTowerRecord.includes(uniqueXY) ? tempTowerRecord.push(uniqueXY) : null;
}

function addEventListeners() {
  document.getElementById("build-tower-button").onclick = e => {
    const canvas = this.myGameArea.canvas;
    canvas.style.backgroundColor = "blue";
    canvas.addEventListener("click", placeTower);
  };
}
