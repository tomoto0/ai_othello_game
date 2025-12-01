import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import GameBoard from '@/components/othello/GameBoard';
import ScorePanel from '@/components/othello/ScorePanel';
import ControlPanel from '@/components/othello/ControlPanel';
import GameOverModal from '@/components/othello/GameOverModal';
import StatusMessage from '@/components/othello/StatusMessage';
import Header from '@/components/othello/Header';

export default function Home() {
  return (
    <GameProvider>
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
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
          <Header />
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full max-w-7xl">
            {/* Game board section */}
            <div className="flex-1 flex justify-center">
              <GameBoard />
            </div>

            {/* Control panel section */}
            <div className="flex-1 flex flex-col gap-6 w-full lg:w-auto">
              <ScorePanel />
              <StatusMessage />
              <ControlPanel />
            </div>
          </div>
        </div>

        {/* Game over modal */}
        <GameOverModal />

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
          @keyframes disc-flip-3d {
            0% { transform: rotateX(0deg); }
            50% { transform: rotateX(90deg); }
            100% { transform: rotateX(0deg); }
          }
          @keyframes disc-drop {
            0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </GameProvider>
  );
}
