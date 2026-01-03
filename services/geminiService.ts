
import { GoogleGenAI, Type } from "@google/genai";
import { CDFScore, AOCEVariant, ProductionBrief } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const evaluateIdeaCDF = async (idea: string, goal: string): Promise<CDFScore> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate the following idea based on the goal.
    Goal: ${goal}
    Idea: ${idea}
    
    Criteria weights: Alignment(40%), Feasibility(20%), Impact(30%), Novelty(10%).
    Return a score between 0 and 1 for each.
    A total score >= 0.7 is a START, otherwise STOP.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          alignment: { type: Type.NUMBER },
          feasibility: { type: Type.NUMBER },
          impact: { type: Type.NUMBER },
          novelty: { type: Type.NUMBER },
          totalScore: { type: Type.NUMBER },
          decision: { type: Type.STRING },
          rationale: { type: Type.STRING }
        },
        required: ["alignment", "feasibility", "impact", "novelty", "totalScore", "decision", "rationale"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateAOCEVariants = async (constraints: string): Promise<AOCEVariant[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 8 high-performance content variants based on these constraints: ${constraints}. Ensure high hook efficiency.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            format: { type: Type.STRING },
            length: { type: Type.STRING },
            suggested_cta: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence_score: { type: Type.NUMBER }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateProductionBrief = async (idea: string): Promise<ProductionBrief> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Convert this approved idea into a professional production brief: ${idea}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          storyboard: { type: Type.ARRAY, items: { type: Type.STRING } },
          assetsList: { type: Type.ARRAY, items: { type: Type.STRING } },
          shotList: { type: Type.ARRAY, items: { type: Type.STRING } },
          editNotes: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const normalizeOutput = async (rawText: string, schemaDescription: string): Promise<any> => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Normalize this text into a JSON object matching this schema description: ${schemaDescription}. Text: ${rawText}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text);
};
