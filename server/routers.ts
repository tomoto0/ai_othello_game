import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import type { Message } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  game: router({
    getAIMove: publicProcedure
      .input(
        z.object({
          board: z.array(z.array(z.number())),
          difficulty: z.enum(['easy', 'medium', 'hard']),
          validMoves: z.array(z.object({ row: z.number(), col: z.number() })),
          currentPlayer: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const { board, difficulty, validMoves, currentPlayer } = input;

        try {
          // Generate prompt based on difficulty
          const boardString = board
            .map((row: number[], i: number) => `${i}: [${row.map((c: number) => c === 0 ? '.' : c === 1 ? 'B' : 'W').join(' ')}]`)
            .join('\n');

          const validMovesString = validMoves
            .map((m: any) => `(${m.row}, ${m.col})`)
            .join(', ');

          const playerColor = currentPlayer === 1 ? 'Black (B)' : 'White (W)';

          let prompt = `You are playing Othello/Reversi as ${playerColor}.\n\nCurrent Board State (. = empty, B = Black, W = White):\n${boardString}\n\nValid moves for your turn: ${validMovesString}\n\n`;

          if (difficulty === 'easy') {
            prompt += `Choose any valid move. Just pick one randomly from the valid moves.\n\nRespond with ONLY a JSON object in this exact format:\n{"row": <number>, "col": <number>}`;
          } else if (difficulty === 'medium') {
            prompt += `Apply basic Othello strategy:\n1. PRIORITIZE corners (0,0), (0,7), (7,0), (7,7) - they cannot be flipped\n2. AVOID squares adjacent to corners if corner is empty\n3. Prefer edge positions\n4. Maximize the number of discs you flip\n\nAnalyze the board and choose the best move based on these priorities.\n\nRespond with ONLY a JSON object in this exact format:\n{"row": <number>, "col": <number>, "reasoning": "<brief explanation>"}`;
          } else {
            prompt += `Apply advanced Othello strategy:\n\nSTRATEGIC PRIORITIES (in order):\n1. CORNERS: Always take corners when available - they are permanent\n2. STABLE DISCS: Build chains of discs that cannot be flipped\n3. AVOID X-SQUARES: Never play diagonally adjacent to empty corners\n4. AVOID C-SQUARES: Avoid positions adjacent to corners on edges when corner is empty\n5. EDGE CONTROL: Secure edges, especially completed edge lines\n6. MOBILITY: Prefer moves that maximize your future valid moves\n7. PARITY: In endgame, try to play last in each region\n8. TEMPO: Sometimes sacrifice discs early to gain positional advantage\n\nAnalyze deeply and choose the optimal move.\n\nRespond with ONLY a JSON object in this exact format:\n{"row": <number>, "col": <number>, "reasoning": "<strategic analysis>"}`;
          }

          const messages: Message[] = [
            {
              role: 'system',
              content: 'You are an expert Othello/Reversi player. Always respond with valid JSON containing your move coordinates.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ];

          const response = await invokeLLM({
            messages,
          });

          const content = response.choices[0]?.message?.content;
          const responseText = typeof content === 'string' ? content : '';

          // Parse JSON from response
          const jsonMatch = responseText.match(/\{[^}]+\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (typeof parsed.row === 'number' && typeof parsed.col === 'number') {
              // Verify the move is valid
              const isValid = validMoves.some(
                (m: any) => m.row === parsed.row && m.col === parsed.col
              );
              if (isValid) {
                return {
                  move: { row: parsed.row, col: parsed.col },
                  reasoning: responseText || 'AI move',
                  source: 'ai' as const,
                };
              }
            }
          }

          // Fallback to random move
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          return {
            move: randomMove,
            reasoning: responseText || 'Fallback to random move (AI response parsing failed)',
            source: 'fallback' as const,
          };
        } catch (error) {
          console.error('AI move error:', error);
          // Fallback to random move on error
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          return {
            move: randomMove,
            reasoning: `Fallback to random move (API error: ${error instanceof Error ? error.message : 'Unknown error'})`,
            source: 'error-fallback' as const,
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
