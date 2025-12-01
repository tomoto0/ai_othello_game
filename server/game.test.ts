import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

// Mock the LLM module
vi.mock('./_core/llm', () => ({
  invokeLLM: vi.fn(async ({ messages }) => {
    // Return a mock AI response
    return {
      choices: [
        {
          message: {
            content: '{"row": 2, "col": 3}',
          },
        },
      ],
    };
  }),
}));

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };
}

describe('game.getAIMove', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createTestContext();
    caller = appRouter.createCaller(ctx);
  });

  it('should return a valid move for easy difficulty', async () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const validMoves = [
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 4 },
    ];

    const result = await caller.game.getAIMove({
      board,
      difficulty: 'easy',
      validMoves,
      currentPlayer: 1,
    });

    expect(result).toBeDefined();
    expect(result.move).toBeDefined();
    expect(result.move.row).toBeGreaterThanOrEqual(0);
    expect(result.move.row).toBeLessThan(8);
    expect(result.move.col).toBeGreaterThanOrEqual(0);
    expect(result.move.col).toBeLessThan(8);
    expect(result.reasoning).toBeDefined();
    expect(result.source).toMatch(/^(ai|heuristic|fallback|error-fallback)$/);
  });

  it('should return a valid move for medium difficulty', async () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const validMoves = [
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 4 },
    ];

    const result = await caller.game.getAIMove({
      board,
      difficulty: 'medium',
      validMoves,
      currentPlayer: 1,
    });

    expect(result).toBeDefined();
    expect(result.move).toBeDefined();
    expect(validMoves.some(m => m.row === result.move.row && m.col === result.move.col)).toBe(true);
  });

  it('should return a valid move for hard difficulty', async () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const validMoves = [
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 4 },
    ];

    const result = await caller.game.getAIMove({
      board,
      difficulty: 'hard',
      validMoves,
      currentPlayer: 2,
    });

    expect(result).toBeDefined();
    expect(result.move).toBeDefined();
    expect(validMoves.some(m => m.row === result.move.row && m.col === result.move.col)).toBe(true);
  });

  it('should return a fallback move when valid moves list is provided', async () => {
    const board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const validMoves = [
      { row: 2, col: 3 },
      { row: 3, col: 2 },
    ];

    const result = await caller.game.getAIMove({
      board,
      difficulty: 'easy',
      validMoves,
      currentPlayer: 1,
    });

    expect(result).toBeDefined();
    expect(result.move).toBeDefined();
    expect(validMoves.some(m => m.row === result.move.row && m.col === result.move.col)).toBe(true);
  });
});
