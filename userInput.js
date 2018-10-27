function addEventListeners() {
    document.getElementById("build-tower-button").addEventListener("click", buildingTower)
}

function buildingTower() {
    game.userInputState = 'building'
    canvas.addEventListener("mousemove", trackingMouse);
    canvas.addEventListener("click", buildTower);
}

function trackingMouse(e) {
    const mousePos = getMousePos(canvas, e);    
    game.mouseX = mousePos.x;
    game.mouseY = mousePos.y;
}

function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
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
        canvas.removeEventListener("mousemove", buildingTower, true);
        canvas.removeEventListener("click", buildTower, true);
    }
}

function calculateCoordinate(offsetX, offsetY) {
    const x = Math.floor(offsetX / gridWidth);
    const y = Math.floor(offsetY / gridWidth);
    return [x, y];
}

