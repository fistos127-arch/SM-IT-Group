
import React from 'react';
import type { PredictionResult } from '../types';
import { TrophyIcon } from './icons';

interface PredictionDisplayProps {
  prediction: PredictionResult;
  onReset: () => void;
  teamA: string;
  teamB: string;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, onReset, teamA, teamB }) => {
    const { winner, confidence, analysis, predictedScore } = prediction;
    const isDraw = winner.toLowerCase() === 'draw';
    const winnerName = isDraw ? 'Draw' : winner;
    
    // Normalize team names for comparison
    const normWinner = winner.toLowerCase();
    const normTeamA = teamA.toLowerCase();
    const normTeamB = teamB.toLowerCase();

    const getTeamStatus = (teamName: string) => {
        if (isDraw) return 'bg-gray-700 border-gray-500';
        if (normWinner === teamName.toLowerCase()) return 'bg-green-900 border-green-500 animate-pulse';
        return 'bg-red-900 border-red-700';
    };

  return (
    <div className="text-center animate-fade-in">
        <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-300">Match Prediction</h2>
            <p className="text-4xl font-bold text-green-400 mt-2">{predictedScore}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-lg border-2 ${getTeamStatus(teamA)}`}>
                <p className="text-lg font-bold">{teamA}</p>
            </div>
             <div className={`p-4 rounded-lg border-2 ${getTeamStatus(teamB)}`}>
                <p className="text-lg font-bold">{teamB}</p>
            </div>
        </div>

      <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrophyIcon className="w-8 h-8 text-yellow-400" />
          <h3 className="text-3xl font-bold">
            {isDraw ? 'Predicted Outcome: Draw' : `Predicted Winner: ${winnerName}`}
          </h3>
        </div>

        <div className="my-6">
          <p className="text-gray-400 text-sm mb-2">Confidence</p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <p className="text-xl font-bold mt-2">{confidence}%</p>
        </div>

        <div>
            <h4 className="font-semibold text-lg text-gray-300 mb-2">AI Analysis</h4>
            <p className="text-gray-200">{analysis}</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
      >
        Predict Another Match
      </button>
    </div>
  );
};

export default PredictionDisplay;
