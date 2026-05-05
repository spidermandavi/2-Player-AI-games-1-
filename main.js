import { games } from './config/gamesList.js';
import { createGameRegistry, getGameById } from './engine/gameLoader.js';
import { chooseAIMove } from './engine/ai.js';

const appStatus = document.getElementById('appStatus');
const gameSelector = document.getElementById('gameSelector');
const difficultySelect = document.getElementById('difficultySelect');
const gameTitle = document.getElementById('gameTitle');
const gameDescription = document.getElementById('gameDescription');
const gameArea = document.getElementById('gameArea');
const gameHint = document.getElementById('gameHint');

const registry = createGameRegistry(games);
let currentGameId = games[0]?.id ?? null;

const appState = {
  difficulty: difficultySelect.value,
  gameId: currentGameId,
};

function setStatus(message) {
  appStatus.textContent = message;
}

function renderGameSelector() {
  gameSelector.innerHTML = '';

  registry.forEach((game) => {
    const button = document.createElement('button');
    button.className = 'selector-btn' + (game.id === appState.gameId ? ' active' : '');
    button.type = 'button';
    button.innerHTML = `
      <span class="selector-name">${game.name}</span>
      <span class="selector-meta">${game.description}</span>
    `;
    button.addEventListener('click', () => {
      appState.gameId = game.id;
      renderAll();
      setStatus(`Loaded ${game.name}`);
    });
    gameSelector.appendChild(button);
  });
}

function renderPlaceholderBoard(game) {
  const board = document.createElement('div');
  board.className = 'board';

  const totalCells = game.placeholder?.cells ?? 9;
  const label = game.placeholder?.label ?? 'Cell';

  for (let i = 0; i < totalCells; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = `${label} ${i + 1}`;
    board.appendChild(cell);
  }

  return board;
}

function renderGameArea(game) {
  gameArea.innerHTML = '';

  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder-card';

  const content = document.createElement('div');
  content.style.maxWidth = '560px';
  content.style.display = 'grid';
  content.style.gap = '14px';

  const title = document.createElement('div');
  title.innerHTML = `<h3>${game.name} preview</h3>`;
  const body = document.createElement('p');
  body.className = 'muted';
  body.textContent = game.placeholder?.message ?? 'This area is reserved for the game UI. The real game logic can be added later without changing the platform shell.';

  content.appendChild(title);
  content.appendChild(body);

  if (game.placeholder?.showBoard !== false) {
    content.appendChild(renderPlaceholderBoard(game));
  }

  placeholder.appendChild(content);
  gameArea.appendChild(placeholder);
}

function renderGameDetails(game) {
  gameTitle.textContent = game.name;
  gameDescription.textContent = game.description;
  gameHint.textContent = game.hint ?? 'Placeholder game loaded. Implement the game module when you are ready.';
}

function maybePreviewSharedAI(game) {
  const gameModule = getGameById(registry, game.id);
  const hasInterface = Boolean(gameModule?.interfaceReady);

  if (!hasInterface) {
    return `AI ready for ${game.name}, waiting for the game interface.`;
  }

  const demoState = gameModule.getInitialState();
  const move = chooseAIMove(demoState, gameModule, appState.difficulty);
  return move ? `AI can analyze ${game.name}. Sample move: ${JSON.stringify(move)}` : `AI found no legal move for ${game.name}.`;
}

function renderAll() {
  const game = getGameById(registry, appState.gameId) ?? registry[0];

  if (!game) {
    setStatus('No games configured');
    gameTitle.textContent = 'No games available';
    gameDescription.textContent = 'Add games to config/gamesList.js to populate the selector.';
    gameArea.innerHTML = '';
    return;
  }

  renderGameSelector();
  renderGameDetails(game);
  renderGameArea(game);

  const aiMessage = maybePreviewSharedAI(game);
  gameHint.textContent = aiMessage;
}

difficultySelect.addEventListener('change', () => {
  appState.difficulty = difficultySelect.value;
  setStatus(`AI difficulty set to ${appState.difficulty}`);
});

renderAll();
setStatus(`Loaded ${registry.length} game(s)`);
