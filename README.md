# Tower Defense

Shoot down the patriarchy with our rainbow laser :rainbow: :rainbow: :rainbow:

Started at Women Who Code Austin 4th Diversity Hackthon with the following awesome crew:
* [siliconion](https://github.com/siliconion)
* [s3rj](https://github.com/s3rj)
* [rachiebytes](https://github.com/rachiebytes)
* [cutofmyjib](https://github.com/cutofmyjib)
* [t886515](https://github.com/t886515)

The goal for this project is to learn about canvas and game developing.

### Tech Stack
HTML5 canvas. Pure ES6!
 

### Quick Start
Open index.html in your browser, and begin to play!

Currently the game is only tested in Chrome 69.

### Code Walk-through

##### Components
A tower defense game is consists of 3 different types of components:
* Grid: the play area. It contains info about where the towers are.
* Mob: the enemies that are attacking you! They can only move, until the reach the end and burst.
* Tower: your defense. They shoot lasers towards mobs that are in range.
Each of them are a class, that has a `draw` function that draws itself. Each of the class are in the file with corresponding names. 

##### Game Loop
For these 3 things to interact with each other, we use [GAME LOOP](http://gameprogrammingpatterns.com/game-loop.html). 

Games are like movie films, consisting of still pictures shown consecutively. The game loop shows the pictures (`render()`), and also processes user inputs (`processInput()`) and update the game status (`update()`).

The game loop in in `index.js`.

####### render
`render` simply draws all components.

####### process user input
`processInput` deals with user inputs. In this game, user can only build a tower. User input uses the [state pattern](http://gameprogrammingpatterns.com/state.html), and for this game, user can be one of the 3 states: 
* `idle` 
* `building`: user clicked the button to build a tower, but hasn't decide where to build.
* `built`: user that in the building state, chose a valid place on the grid to build. The game loop will build the tower, and the user state will go back to idle.

####### update the game status
 `update` calls the components in the games to do their actions. Towers will attach the mobs, and mobs will move. 



