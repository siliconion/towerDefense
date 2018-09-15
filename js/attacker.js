function attacker(name) {
    return {
        name: name,
        move: function (x) {
            console.log('========' + name + " attacks! " + x)
        }
    }
}

module.exports = attacker
