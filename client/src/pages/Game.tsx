import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLocation } from 'wouter';
import GameBoard from '@/components/othello/GameBoard';
import ScorePanel from '@/components/othello/ScorePanel';
import StatusMessage from '@/components/othello/StatusMessage';
import GameOverModal from '@/components/othello/GameOverModal';

export default function Game() {
  const { state, undoMove, newGame } = useGame();
  const [, navigate] = useLocation();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackHome}
            className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition-colors text-xs font-semibold flex items-center gap-2"
          >
            ← ホーム
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            OTHELLO
          </h1>
        </div>
        <div className="text-xs text-gray-400">
          {state.settings.mode === 'pvc' ? '👤 vs 🤖' : '👤 vs 👤'}
          {state.settings.mode === 'pvc' && ` • ${state.settings.difficulty === 'easy' ? '🌱' : state.settings.difficulty === 'medium' ? '⚔️' : '👑'}`}
        </div>
      </div>

      {/* Main game area */}
      <div className="flex h-[calc(100vh-64px)] gap-4 p-4 overflow-hidden">
        {/* Left side - Game board (larger) */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-0">
          <div className="w-full h-full flex items-center justify-center max-w-[600px] max-h-[600px]">
            <GameBoard />
          </div>
        </div>

        {/* Right side - Info panel (compact) */}
        <div className="w-72 flex flex-col gap-3 overflow-y-auto pr-2">
          {/* Score */}
          <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700 flex-shrink-0">
            <ScorePanel />
          </div>

          {/* Status */}
          <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700 flex-shrink-0">
            <StatusMessage />
          </div>

          {/* Controls */}
          <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700 space-y-2 flex-shrink-0">
            <button
              onClick={newGame}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all whitespace-nowrap"
            >
              🔄 新規ゲーム
            </button>
            <button
              onClick={undoMove}
              disabled={state.moveHistory.length === 0 || state.isAIThinking}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white text-xs font-semibold hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              ↶ 戻す
            </button>
            <button
              onClick={handleBackHome}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white text-xs font-semibold hover:bg-slate-600 transition-all whitespace-nowrap"
            >
              ← ホーム
            </button>
          </div>

          {/* Game info */}
          <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700 text-xs space-y-1 flex-shrink-0">
            <div className="text-gray-400 space-y-1">
              <div className="truncate">移動数: {state.moveHistory.length}</div>
              <div className="truncate">有効な移動: {state.validMoves.length}</div>
              {state.isAIThinking && <div className="text-yellow-400 mt-1 truncate">🤖 AI思考中...</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {state.gameOver && <GameOverModal />}
    </div>
  );
}
