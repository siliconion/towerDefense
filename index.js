// initial constants
const canvas_width = 500
const grid_number = 10
const grid_width = canvas_width / grid_number

const mob_init_hp = 100
const mob_init_position_x = 0
const mob_init_position_y = 0
const mob_size = 10
const mob_speed = 20

const start_gold = 100
const start_hp = 1000
const tower_damage = 1
const tower_range = 100

window.onload = function() {
  // init,
  startGame();
};
const tempTowerRecord = [];

var gameState;

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
        gird: Grid(),
        spawnMob: true
    }
    setInterval(runGame, 1000)
    setInterval(() => {
        gameState.spawnMob = true
    }, 3000)
}

function runGame() {
    console.log("run game")
    // increase game clock
    // redraw
    grid.draw()
    grid.towers.forEach(t => t.draw())
    gameState.mobs.forEach(m => {
        console.log("line 57")
        console.log(m)
        m.draw()
    })
    console.log(gameState.mobs)
    // mobs
    // spawn
    spawn()
    // take damage
    gameState.mobs.forEach(m => m.take_damage())
    // move
    gameState.mobs.forEach(m => m.move())

  // towers
  // attack?
  grid.towers.forEach(t => t.target());
  // build
}

function spawn() {
    // if timer is spawn_interval, add X mobs in to mobs
    // if timer % internal = 0 then mobs.add(10 new mobs)
    if (gameState.spawnMob) {
        let new_mob = new Mob()
        gameState.mobs.push(new_mob)
        console.log("creating new mob")
        console.log(new_mob)
        gameState.spawnMob = false
    }
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
        speed: 5,
        location_x: 123,
        location_y: 432,
        move: function(delta_x, delta_y) {
            this.location_x += this.speed
            this.location_y += 0
            // check if reaches the edge
        },
        targeted_damage: 0,
        take_damage: function() {
            this.hp -= this.targeted_damage // ?????
        },
        draw: function() {
            console.log(this)
            console.log("draw at ", this.location_x, this.location_y)
            myGameArea.context.beginPath();
            myGameArea.context.arc(this.location_x, this.location_y, 100, 0, 2 * Math.PI);
            myGameArea.context.stroke();
        }
    }
  };

function Tower(x, y) {
    return {
        x: x,
        y: y,
        damage: tower_damage,
        range: tower_range,
        target: function () {
            // find the mob
            let in_range_mobs = gameState.mobs.filter(m => {
                return (m.x <= this.x + this.range) & (m.x >= this.x - this.range) & (m.y <= this.y + this.range) & (m.y >= this.y - this.range)
            }).sort(function (a, b) {
                // find the one closest to the end
                return (a.x - b.x)
            })
            if (in_range_mobs.length > 0) {
                let targeted_mob = in_range_mobs[0]
                targeted_mob.take_damage(this.damage)
                if (targeted_mob.hp <= 0) {
                    // remove mob
                    let targeted_mob_index = gameState.findIndex(targeted_mob)
                    gameState.mobs.splice(targeted_mob_index, 1)
                }

            }
        }
    }
  };

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
