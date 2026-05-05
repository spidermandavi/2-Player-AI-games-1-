/**
 * Game loader for the platform shell.
 *
 * The loader keeps game registration separate from the UI so adding a new game later
 * should only require:
 *   1) adding a new folder under /games
 *   2) adding an entry in /config/gamesList.js
 *   3) implementing the standard game interface when ready
 *
 * Standard game interface:
 *   getInitialState()
 *   getMoves(state)
 *   applyMove(state, move)
 *   isGameOver(state)
 *   evaluate(state)
 *
 * Placeholder folders may exist before the game logic is implemented.
 * This loader currently focuses on metadata and registry creation, not full game execution.
 */

export function createGameRegistry(games) {
  if (!Array.isArray(games)) return [];
  return games.map((game) => ({
    id: game.id,
    name: game.name,
    description: game.description ?? '',
    modulePath: game.modulePath ?? null,
    uiPath: game.uiPath ?? null,
    stylePath: game.stylePath ?? null,
    placeholder: game.placeholder ?? {},
    hint: game.hint ?? '',
    interfaceReady: Boolean(game.interfaceReady),
  }));
}

export function getGameById(registry, gameId) {
  return registry.find((game) => game.id === gameId) ?? null;
}

/**
 * Future hook:
 * In a later version this function can dynamically import game modules once they are real.
 * For now it returns the registry entry so the shell can render the selected game safely.
 */
export async function loadGame(gameId, registry) {
  return getGameById(registry, gameId);
}
