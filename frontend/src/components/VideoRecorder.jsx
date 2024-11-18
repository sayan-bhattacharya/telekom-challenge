// src/components/VideoRecorder.jsx
// src/pages/VideoRecorder.jsx
import React, { useState, useRef } from 'react';
import '../styles/VideoRecorder.css'; // Import specific styles for VideoRecorder here

// Component code...

function VideoRecorder({ onSave }) {
const [isRecording, setIsRecording] = useState(false);
const [videoURL, setVideoURL] = useState('');
const mediaRecorderRef = useRef(null);
const chunks = useRef([]);

const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        chunks.current = [];
        const videoURL = URL.createObjectURL(blob);
        setVideoURL(videoURL);
        onSave(blob); // Save video blob for upload
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);

    // Stop recording after 60 seconds
    setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
            stopRecording();
        }
    }, 60000);
};

const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
};

return (
    <div>
        <h2>Record Your Video</h2>
        {isRecording ? (
            <button onClick={stopRecording}>Stop Recording</button>
        ) : (
            <button onClick={startRecording}>Start Recording</button>
        )}
        {videoURL && (
            <div>
                <h3>Review Your Recording</h3>
                <video src={videoURL} controls width="400" />
            </div>
        )}
    </div>
);
}

export default VideoRecorder;