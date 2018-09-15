var attacker = require("./js/attacker")

window.onload = function () {
    ctx = document.getElementById('game').getContext('2d')
    var a1 = attacker("attacker")
    a1.move(10)
}

