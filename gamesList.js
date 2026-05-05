export const games = [
  {
    id: 'ticTacToe',
    name: 'Tic Tac Toe',
    description: 'Starter placeholder for a classic 3x3 strategy game.',
    modulePath: './games/ticTacToe/game.js',
    uiPath: './games/ticTacToe/ui.js',
    stylePath: './games/ticTacToe/style.css',
    interfaceReady: false,
    placeholder: {
      showBoard: true,
      cells: 9,
      label: 'Tile',
      message: 'Tic Tac Toe will be implemented here later. This starter version only shows a placeholder board.',
    },
    hint: 'Use this folder as the first real game module when you are ready.',
  },
  {
    id: 'connectFour',
    name: 'Connect Four',
    description: 'Placeholder for a larger grid-based strategy game.',
    modulePath: './games/connectFour/game.js',
    uiPath: './games/connectFour/ui.js',
    stylePath: './games/connectFour/style.css',
    interfaceReady: false,
    placeholder: {
      showBoard: true,
      cells: 42,
      label: 'Slot',
      message: 'Connect Four is reserved as a future module and is not implemented yet.',
    },
    hint: 'The modular structure is ready for a more complex game later.',
  },
];
