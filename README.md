# Go Game of Life

A unique board game that combines the traditional Go board game with Conway's Game of Life cellular automaton.

## Description

Go Game of Life is a turn-based strategy game played on a Go board (9x9, 13x13, or 19x19 grid). Players take turns placing black and white stones on the board intersections. The game offers two modes of play:

1. **Dice-based Mode**: After each turn, a dice is rolled, and if a 1 is rolled, Conway's Game of Life rules are applied to the board
2. **User-controlled Mode**: Players decide when to trigger Conway's Game of Life by pressing a button

## Game Rules

1. **Setup**: 
   - Choose a board size (9x9, 13x13, or 19x19)
   - Select a game mode (dice-based or user-controlled)
   - Set the maximum number of turns (default: 40)
   - For dice-based mode, select the number of dice faces (2-20)

2. **Gameplay**:
   - Players take turns placing stones on empty intersections
   - Black goes first, followed by White
   - **Dice-based Mode**: After each stone placement, a dice is rolled (1 to N, based on chosen dice faces)
   - If a 1 is rolled (in dice mode) or the "Run Game of Life Iteration" button is clicked (in user-controlled mode), Conway's Game of Life rules are applied:
     - Stones with fewer than 2 or more than 3 neighboring stones are removed
     - Empty intersections with exactly 3 neighboring stones gain a new stone (color determined by majority)

3. **Scoring**:
   - Players earn points for each of their stones on the board
   - When stones are removed during Conway's Game of Life, scores are adjusted

4. **End Game**:
   - The game ends when the maximum number of turns is reached
   - The player with the highest score wins

## Conway's Game of Life Rules

Conway's Game of Life is a cellular automaton where cells (stones in our case) follow these rules:

1. Any cell with fewer than 2 live neighbors dies (underpopulation)
2. Any cell with 2 or 3 live neighbors survives
3. Any cell with more than 3 live neighbors dies (overpopulation)
4. Any empty cell with exactly 3 live neighbors becomes a live cell (reproduction)

In our adaptation:
- The board is the Go grid
- Stones are the live cells
- When new stones appear, their color is determined by the majority of neighboring stones

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/go-conway.git
cd go-conway

# Install dependencies
npm install
```

## Running the Game

```bash
# Start the development server
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## Live Demo

Play the game online at: [https://kanhari.github.io/go-conway/](https://kanhari.github.io/go-conway/)

## Technologies Used

- React
- JavaScript
- Tailwind CSS

## Strategy Tips

### Dice-based Mode
- Adjust the dice faces to control the frequency of Game of Life iterations
- More faces = lower chance of triggering Game of Life
- Fewer faces = higher chance of triggering Game of Life
- Build patterns that can survive or generate new stones of your color

### User-controlled Mode
- Time your Game of Life iterations strategically
- Try to create patterns that will benefit your color when Conway's rules are applied
- Trigger Game of Life when your opponent has vulnerable stone formations
- Consider not triggering Game of Life if your formations are vulnerable

### General Tips
- Plan your stone placements carefully, considering the possibility of Conway's Game of Life being triggered
- Try to create stable formations that will survive Conway's Game of Life rules:
  - 2×2 square blocks
  - "Beehive" hexagonal patterns
- Pay attention to the board edges, as they affect neighbor counts
- Consider creating patterns that will generate new stones of your color if Conway's Game of Life is triggered

## Available Scripts

### `npm start`

Runs the app in the development mode.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run deploy`

Deploys the application to GitHub Pages.

## Future Enhancements

- Multiplayer online support
- Game history tracking and replay
- Additional game rule variations and customizations
- Custom board themes and stone designs
- Save/load game functionality
- AI opponent with adjustable difficulty levels
- Tutorial mode for beginners

## License

MIT

## Acknowledgements

- Inspired by the classic board game Go and Conway's Game of Life
- Built with React and Tailwind CSS
