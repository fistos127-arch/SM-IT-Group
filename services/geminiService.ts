
import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    winner: {
      type: Type.STRING,
      description: "The predicted winning team. If a draw, state 'Draw'.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "A confidence score for the prediction, from 0 to 100.",
    },
    analysis: {
      type: Type.STRING,
      description: "A brief, one or two-sentence analysis explaining the prediction, considering factors like recent form, key players, and head-to-head records.",
    },
    predictedScore: {
      type: Type.STRING,
      description: "The predicted final score, e.g., '2-1'.",
    },
  },
  required: ["winner", "confidence", "analysis", "predictedScore"],
};

export const predictMatch = async (teamA: string, teamB: string): Promise<PredictionResult> => {
  const prompt = `
    Analyze the upcoming soccer match between ${teamA} and ${teamB}.
    Based on all available public data including recent form, historical head-to-head records, player injuries, team tactics, and general team strength, predict the outcome.

    Provide the following:
    1. The name of the winning team. If you predict a draw, state "Draw".
    2. A confidence score for your prediction on a scale of 0-100.
    3. A brief analysis (1-2 sentences) justifying your prediction.
    4. A predicted final score.

    Respond ONLY with a valid JSON object that adheres to the provided schema. Do not include any other text or markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    const predictionData = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed object matches our type
    if (
        typeof predictionData.winner === 'string' &&
        typeof predictionData.confidence === 'number' &&
        typeof predictionData.analysis === 'string' &&
        typeof predictionData.predictedScore === 'string'
    ) {
        return predictionData as PredictionResult;
    } else {
        throw new Error("Received malformed JSON data from API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch prediction from the AI model.");
  }
};
