import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Settings() {
  const { state, setDifficulty, setGameMode, setPlayerColor, toggleSound, toggleHints, newGame } = useGame();
  const [, navigate] = useLocation();

  const handleStartGame = () => {
    newGame();
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Starfield */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Nebula glow */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite 1s',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              OTHELLO
            </h1>
            <p className="text-gray-400 text-lg">AI対戦オセロゲーム</p>
          </div>

          {/* Settings Cards */}
          <div className="space-y-6">
            {/* Game Mode Selection */}
            <Card className="bg-slate-800/50 border-slate-700 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">ゲームモード</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setGameMode('pvc')}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    state.settings.mode === 'pvc'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white ring-2 ring-cyan-400'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  👤 vs 🤖
                  <div className="text-sm text-gray-200 mt-1">プレイヤー vs AI</div>
                </button>
                <button
                  onClick={() => setGameMode('pvp')}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    state.settings.mode === 'pvp'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ring-2 ring-purple-400'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  👤 vs 👤
                  <div className="text-sm text-gray-200 mt-1">2人プレイ</div>
                </button>
              </div>
            </Card>

            {/* Difficulty Selection (only for PvC) */}
            {state.settings.mode === 'pvc' && (
              <Card className="bg-slate-800/50 border-slate-700 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">難易度</h2>
                <div className="grid grid-cols-3 gap-4">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-4 rounded-lg font-semibold transition-all ${
                        state.settings.difficulty === level
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white ring-2 ring-yellow-400'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {level === 'easy' && '🌱'}
                      {level === 'medium' && '⚔️'}
                      {level === 'hard' && '👑'}
                      <div className="text-sm capitalize mt-1">
                        {level === 'easy' && 'イージー'}
                        {level === 'medium' && 'ノーマル'}
                        {level === 'hard' && 'ハード'}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Player Color Selection (only for PvC) */}
            {state.settings.mode === 'pvc' && (
              <Card className="bg-slate-800/50 border-slate-700 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">プレイヤーの色</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPlayerColor(1)}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      state.settings.playerColor === 1
                        ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white ring-2 ring-gray-400'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    ⚫ ブラック
                    <div className="text-sm text-gray-200 mt-1">先手</div>
                  </button>
                  <button
                    onClick={() => setPlayerColor(2)}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      state.settings.playerColor === 2
                        ? 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900 ring-2 ring-gray-200'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    ⚪ ホワイト
                    <div className="text-sm text-gray-200 mt-1">後手</div>
                  </button>
                </div>
              </Card>
            )}

            {/* Game Options */}
            <Card className="bg-slate-800/50 border-slate-700 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">ゲーム設定</h2>
              <div className="space-y-3">
                <button
                  onClick={toggleSound}
                  className={`w-full p-4 rounded-lg font-semibold transition-all text-left flex items-center justify-between ${
                    state.settings.soundEnabled
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-slate-700 text-gray-300'
                  }`}
                >
                  <span>🔊 サウンド</span>
                  <span className="text-sm">{state.settings.soundEnabled ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  onClick={toggleHints}
                  className={`w-full p-4 rounded-lg font-semibold transition-all text-left flex items-center justify-between ${
                    state.settings.showHints
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-slate-700 text-gray-300'
                  }`}
                >
                  <span>💡 ヒント表示</span>
                  <span className="text-sm">{state.settings.showHints ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </Card>

            {/* Start Game Button */}
            <button
              onClick={handleStartGame}
              className="w-full p-6 rounded-lg font-bold text-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
            >
              🎮 ゲーム開始
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>Manus LLM API を使用した AI 対戦</p>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}
