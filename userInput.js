function addEventListeners() {
    document.getElementById("build-tower-button").addEventListener("click", buildingTower)
}

function buildingTower() {
    game.userInputState = 'building'
    canvas.addEventListener("mousemove", trackingMouse);
    canvas.addEventListener("click", buildTower);
}

function trackingMouse(e) {
    let coordinate = calculateCoordinate(e.offsetX, e.offsetY);
    mouseX = coordinate[0]
    mouseY = coordinate[1]
}

function buildTower(e) {
    if (game.gold < towerCost) return;
    let coordinate = calculateCoordinate(e.offsetX, e.offsetY);
    console.log(coordinate)
    let xi = coordinate[0]
    let yi = coordinate[1]
    if (game.grid.gridMap[yi][xi] == null){
        game.grid.gridMap[yi][xi] = new Tower(xi, yi)
        game.gold -= towerCost
        goldElement.innerText = game.gold
        game.userInputState = 'built'
        canvas.removeEventListener("mousemove", buildingTower)
        canvas.removeEventListener("click", buildTower)
    }
}

function calculateCoordinate(offsetX, offsetY) {
    const x = Math.floor(offsetX / gridWidth);
    const y = Math.floor(offsetY / gridWidth);
    return [x, y];
}

