
import React, { useState, useCallback } from 'react';
import { predictMatch } from './services/geminiService';
import type { PredictionResult } from './types';
import TeamInput from './components/TeamInput';
import PredictionDisplay from './components/PredictionDisplay';
import Loader from './components/Loader';
import { SoccerBallIcon, TrophyIcon } from './components/icons';

const App: React.FC = () => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrediction = useCallback(async () => {
    if (!teamA || !teamB) {
      setError('Please enter both team names.');
      return;
    }
    if (teamA.toLowerCase() === teamB.toLowerCase()) {
      setError('Please enter two different teams.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await predictMatch(teamA, teamB);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      setError('Failed to get prediction. The AI might be busy. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [teamA, teamB]);

  const resetState = () => {
    setTeamA('');
    setTeamB('');
    setPrediction(null);
    setError(null);
    setIsLoading(false);
  };

  const isButtonDisabled = isLoading || !teamA || !teamB;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans bg-cover bg-center" style={{backgroundImage: 'url("https://picsum.photos/seed/soccer/1920/1080")'}}>
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <main className="w-full max-w-2xl mx-auto z-10">
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-4">
                <TrophyIcon className="w-10 h-10 text-green-400" />
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  AI Soccer Predictor
                </h1>
              </div>
              <p className="mt-4 text-lg text-gray-300">
                Enter two teams to predict the match outcome.
              </p>
            </div>

            {!prediction && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <TeamInput
                    label="Team A"
                    value={teamA}
                    onChange={(e) => setTeamA(e.target.value)}
                    placeholder="e.g., Real Madrid"
                  />
                  <TeamInput
                    label="Team B"
                    value={teamB}
                    onChange={(e) => setTeamB(e.target.value)}
                    placeholder="e.g., Barcelona"
                  />
                </div>

                <button
                  onClick={handlePrediction}
                  disabled={isButtonDisabled}
                  className={`w-full flex items-center justify-center gap-3 text-lg font-semibold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out ${
                    isButtonDisabled
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-500 transform hover:-translate-y-1 shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <SoccerBallIcon className="w-6 h-6" />
                      <span>Predict Match</span>
                    </>
                  )}
                </button>
              </div>
            )}
            
            {error && !isLoading && (
              <div className="mt-6 text-center bg-red-900 bg-opacity-50 border border-red-700 text-red-300 p-4 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            {prediction && !isLoading && (
              <PredictionDisplay prediction={prediction} onReset={resetState} teamA={teamA} teamB={teamB}/>
            )}
          </div>
        </div>
        <footer className="text-center mt-8 text-gray-400 text-sm">
            <p>Powered by Gemini API. Predictions are for entertainment purposes only.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
