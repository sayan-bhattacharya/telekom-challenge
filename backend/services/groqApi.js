// services/groqApi.js
import axios from 'axios';

const generateSummary = async (cvURL) => {
    try {
        const response = await axios.post('https://api.groq.com/summarize', { url: cvURL });
        return response.data.summary;
    } catch (error) {
        console.error('Error generating summary:', error);
        throw error;
    }
};

export default { generateSummary };