import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLocation } from 'wouter';
import GameBoard from '@/components/othello/GameBoard';
import ScorePanel from '@/components/othello/ScorePanel';
import StatusMessage from '@/components/othello/StatusMessage';
import GameOverModal from '@/components/othello/GameOverModal';
import { Button } from '@/components/ui/button';

export default function Game() {
  const { state, undoMove, newGame } = useGame();
  const [, navigate] = useLocation();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackHome}
            className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition-colors text-sm font-semibold flex items-center gap-2"
          >
            ← ホーム
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            OTHELLO
          </h1>
        </div>
        <div className="text-xs text-gray-400">
          {state.settings.mode === 'pvc' ? '👤 vs 🤖' : '👤 vs 👤'}
          {state.settings.mode === 'pvc' && ` • ${state.settings.difficulty === 'easy' ? '🌱' : state.settings.difficulty === 'medium' ? '⚔️' : '👑'}`}
        </div>
      </div>

      {/* Main game area */}
      <div className="flex gap-4 h-[calc(100vh-120px)]">
        {/* Left side - Game board (larger) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <GameBoard />
          </div>
        </div>

        {/* Right side - Info panel (compact) */}
        <div className="w-64 flex flex-col gap-3 overflow-y-auto">
          {/* Score */}
          <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700">
            <ScorePanel />
          </div>

          {/* Status */}
          <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700">
            <StatusMessage />
          </div>

          {/* Controls */}
          <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700 space-y-2">
            <button
              onClick={newGame}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              🔄 新規ゲーム
            </button>
            <button
              onClick={undoMove}
              disabled={state.moveHistory.length === 0 || state.isAIThinking}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ↶ 戻す
            </button>
            <button
              onClick={handleBackHome}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-600 transition-all"
            >
              ← ホーム
            </button>
          </div>

          {/* Game info */}
          <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700 text-xs space-y-1">
            <div className="text-gray-400">
              <div>移動数: {state.moveHistory.length}</div>
              <div>有効な移動: {state.validMoves.length}</div>
              {state.isAIThinking && <div className="text-yellow-400 mt-1">🤖 AI思考中...</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {state.gameOver && <GameOverModal />}
    </div>
  );
}
