// services/whisperApi.js
import axios from 'axios';

const transcribe = async (videoURL) => {
    try {
        const response = await axios.post('https://api.whisperapi.com/transcribe', { url: videoURL });
        return response.data.transcription;
    } catch (error) {
        console.error('Error transcribing video:', error);
        throw error;
    }
};

export default { transcribe };