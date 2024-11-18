// src/utils/sentimentAnalysis.js
import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

export const analyzeSentiment = (text) => {
    const result = sentimentAnalyzer.analyze(text);
    return {
        positive: result.positive.length,
        negative: result.negative.length,
        neutral: result.words.length - result.positive.length - result.negative.length,
        overall: result.score,
    };
};