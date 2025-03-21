# Go Game of Life

A unique board game that combines the traditional Go board game with Conway's Game of Life cellular automaton.

## Description

Go Game of Life is a turn-based strategy game played on a Go board (9x9, 13x13, or 19x19 grid). Players take turns placing black and white stones on the board intersections. The twist? At the end of each turn, a dice is rolled, and if a 1 is rolled, Conway's Game of Life rules are applied to the board, potentially changing the game state dramatically!

## Game Rules

1. **Setup**: 
   - Choose a board size (9x9, 13x13, or 19x19)
   - Set the maximum number of turns (default: 40)
   - Select the number of dice faces (2-20)

2. **Gameplay**:
   - Players take turns placing stones on empty intersections
   - Black goes first, followed by White
   - After each stone placement, a dice is rolled (1 to N, based on chosen dice faces)
   - If a 1 is rolled, Conway's Game of Life rules are applied to the board:
     - Stones with fewer than 2 or more than 3 neighboring stones are removed
     - Empty intersections with exactly 3 neighboring stones gain a new stone (color determined by majority)

3. **Scoring**:
   - Players earn points for each of their stones on the board
   - When stones are removed during Conway's Game of Life, scores are adjusted

4. **End Game**:
   - The game ends when the maximum number of turns is reached
   - The player with the highest score wins

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

## Technologies Used

- React
- JavaScript
- Tailwind CSS

## Strategy Tips

- Plan your stone placements carefully, considering the possibility of Conway's Game of Life being triggered
- Try to create stable formations that will survive Conway's Game of Life rules
- Pay attention to the board edges, as they affect neighbor counts
- Consider creating patterns that will generate new stones of your color if Conway's Game of Life is triggered

## Available Scripts

### `npm start`

Runs the app in the development mode.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Future Enhancements

- Multiplayer support
- Game history tracking
- Additional game rule variations
- Custom board themes

## License

MIT

## Acknowledgements

- Inspired by the classic board game Go and Conway's Game of Life
- Built with React and Tailwind CSS
