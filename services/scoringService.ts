
import { WEIGHTS, THRESHOLD } from '../constants';
import { CDFScore } from '../types';

/**
 * Deterministic scoring function for manual validation or local simulation.
 * Usually values come from the LLM Evaluator, but this logic ensures 
 * the totalScore calculation is robust.
 */
export const calculateCDFScore = (
  scores: { alignment: number; feasibility: number; impact: number; novelty: number },
  rationale: string
): CDFScore => {
  const totalScore = (
    scores.alignment * WEIGHTS.alignment +
    scores.feasibility * WEIGHTS.feasibility +
    scores.impact * WEIGHTS.impact +
    scores.novelty * WEIGHTS.novelty
  );

  return {
    ...scores,
    totalScore,
    decision: totalScore >= THRESHOLD ? 'START' : 'STOP',
    rationale
  };
};
