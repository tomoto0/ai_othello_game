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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 flex-shrink-0">
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

      {/* Main game area - Responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden min-h-0 lg:justify-center lg:items-center">
        {/* Top info panel (mobile) / Left side (desktop) - Game board */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 lg:min-w-0 lg:max-w-6xl">
          {/* Score and Status - Top on mobile, left on desktop */}
          <div className="flex flex-col gap-3 lg:hidden flex-shrink-0">
            {/* Score */}
            <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700">
              <ScorePanel />
            </div>

            {/* Status */}
            <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700">
              <StatusMessage />
            </div>
          </div>

          {/* Game board - Full width on mobile, flex-1 on desktop */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 lg:min-w-0">
            <div className="w-full h-full flex items-center justify-center max-w-[600px] max-h-[600px] lg:max-w-[500px] lg:max-h-[500px]">
              <GameBoard />
            </div>
          </div>

          {/* Right side - Info panel (desktop only) */}
          <div className="hidden lg:flex lg:flex-col gap-3 lg:w-80 overflow-y-auto pr-2">
            {/* Score */}
            <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700 flex-shrink-0">
              <ScorePanel />
            </div>

            {/* Status */}
            <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700 flex-shrink-0">
              <StatusMessage />
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700 space-y-2 flex-shrink-0">
              <button
                onClick={newGame}
                className="w-full px-3 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all whitespace-nowrap"
              >
                🔄 新規ゲーム
              </button>
              <button
                onClick={undoMove}
                disabled={state.moveHistory.length === 0 || state.isAIThinking}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
              >
                ↶ 戻す
              </button>
              <button
                onClick={handleBackHome}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-600 transition-all whitespace-nowrap"
              >
                ← ホーム
              </button>
            </div>

            {/* Game info */}
            <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-700 text-sm space-y-2 flex-shrink-0">
              <div className="text-gray-400 space-y-1.5">
                <div className="truncate">移動数: {state.moveHistory.length}</div>
                <div className="truncate">有効な移動: {state.validMoves.length}</div>
                {state.isAIThinking && <div className="text-yellow-400 mt-2 truncate">🤖 AI思考中...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls and info (mobile only) */}
      <div className="lg:hidden flex flex-col gap-3 px-4 pb-4 flex-shrink-0">
        {/* Controls */}
        <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700 space-y-2">
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
        <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-slate-700 text-xs space-y-1">
          <div className="text-gray-400 space-y-1">
            <div className="truncate">移動数: {state.moveHistory.length}</div>
            <div className="truncate">有効な移動: {state.validMoves.length}</div>
            {state.isAIThinking && <div className="text-yellow-400 mt-1 truncate">🤖 AI思考中...</div>}
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {state.gameOver && <GameOverModal />}
    </div>
  );
}
