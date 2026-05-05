/**
 * Shared AI engine for every game.
 *
 * Required game interface:
 *   getInitialState() -> any
 *   getMoves(state) -> array of moves
 *   applyMove(state, move) -> nextState
 *   isGameOver(state) -> boolean
 *   evaluate(state) -> number
 *
 * Notes:
 * - The AI is intentionally generic and only depends on the interface above.
 * - "evaluate(state)" should score the position from the perspective of the AI player
 *   used by the specific game implementation.
 * - The engine supports simple difficulty levels so every future game can share the same AI.
 */

const DEFAULT_DEPTH_BY_DIFFICULTY = {
  easy: 1,
  normal: 2,
  hard: 4,
};

function randomChoice(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function scoreMove(state, move, game, depth, alpha, beta, maximizingPlayer) {
  const nextState = game.applyMove(state, move);

  if (depth <= 1 || game.isGameOver(nextState)) {
    return game.evaluate(nextState);
  }

  const nextMoves = game.getMoves(nextState);
  if (!nextMoves.length) {
    return game.evaluate(nextState);
  }

  if (maximizingPlayer) {
    let best = -Infinity;
    for (const nextMove of nextMoves) {
      best = Math.max(
        best,
        scoreMove(nextState, nextMove, game, depth - 1, alpha, beta, false)
      );
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Infinity;
  for (const nextMove of nextMoves) {
    best = Math.min(
      best,
      scoreMove(nextState, nextMove, game, depth - 1, alpha, beta, true)
    );
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

export function chooseAIMove(state, game, difficulty = 'normal') {
  if (!game || typeof game.getMoves !== 'function') return null;

  const moves = game.getMoves(state);
  if (!moves || moves.length === 0) return null;

  if (difficulty === 'easy') {
    return randomChoice(moves);
  }

  const depth = DEFAULT_DEPTH_BY_DIFFICULTY[difficulty] ?? DEFAULT_DEPTH_BY_DIFFICULTY.normal;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const nextState = game.applyMove(state, move);
    const score =
      depth <= 1 || game.isGameOver(nextState)
        ? game.evaluate(nextState)
        : scoreMove(nextState, null, game, depth - 1, -Infinity, Infinity, false);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
