// src/pages/VideoRecorder.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import RecordRTC from 'recordrtc';

// Styled Components with Enhanced Styling
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const RecorderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 30px;
    background-color: #f0f5fa;
    font-family: Arial, sans-serif;
    animation: ${fadeIn} 0.5s ease-in;
`;

const Title = styled.h2`
    font-size: 2em;
    font-weight: bold;
    color: #222;
    margin-bottom: 20px;
    text-align: center;
`;

const QuestionContainer = styled.div`
    font-size: 1.2em;
    color: #444;
    text-align: left;
    max-width: 600px;
    padding: 25px;
    margin: 20px 0;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    line-height: 1.6;
`;

const QuestionTitle = styled.h3`
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    margin-top: 20px;
    text-align: left;
`;

const ContextText = styled.p`
    font-size: 1.1em;
    color: #555;
    margin: 10px 0 20px;
    line-height: 1.6;
`;

const BulletPoint = styled.li`
    margin-bottom: 10px;
`;

const ErrorMessage = styled.p`
    font-size: 1.2em;
    color: #e53935;
    text-align: center;
    max-width: 500px;
    margin: 20px 0;
`;

const Timer = styled.div`
    font-size: 1.5em;
    color: #e53935;
    margin-top: 15px;
    font-weight: bold;
`;

const VideoPreview = styled.video`
    width: 100%;
    max-width: 600px;
    border-radius: 12px;
    margin: 20px 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 25px;
`;

const Button = styled.button`
    padding: 14px 28px;
    font-size: 1em;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: #fff;
    background-color: #1976d2;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #1565c0;
        transform: translateY(-2px);
    }

    &:disabled {
        background-color: #b0bec5;
        cursor: not-allowed;
    }
`;

function VideoRecorder() {
    const [question, setQuestion] = useState('Loading question...');
    const [isRecording, setIsRecording] = useState(false);
    const [previewURL, setPreviewURL] = useState(null);
    const [showReplay, setShowReplay] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(59);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const recorderRef = useRef(null);
    const streamRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const requestId = new URLSearchParams(location.search).get('requestId');

    const fetchQuestion = useCallback(async (attempts = 5, delay = 2000) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/applications/question/${requestId}`);
            setQuestion(formatQuestion(response.data.question));
        } catch (error) {
            if (error.response && error.response.status === 404 && attempts > 0) {
                console.warn(`Retrying... Attempts left: ${attempts - 1}`);
                setTimeout(() => fetchQuestion(attempts - 1, delay), delay);
            } else {
                setError("Failed to fetch question. Please try again later.");
            }
        }
    }, [requestId]);

    const formatQuestion = (text) => {
        const [context, ...questions] = text.split('\n').filter((line) => line.trim() !== '');
        
        return (
            <>
                <QuestionTitle>Context:</QuestionTitle>
                <ContextText>{context}</ContextText>
                <QuestionTitle>Interview Question:</QuestionTitle>
                <ul>
                    {questions.map((question, index) => (
                        <BulletPoint key={index}>{question}</BulletPoint>
                    ))}
                </ul>
            </>
        );
    };

    useEffect(() => {
        if (requestId) fetchQuestion();
    }, [requestId, fetchQuestion]);

    useEffect(() => {
        if (isRecording && secondsLeft > 0) {
            const timer = setInterval(() => setSecondsLeft((sec) => sec - 1), 1000);
            return () => clearInterval(timer);
        }
        if (secondsLeft === 0) stopRecording();
    }, [isRecording, secondsLeft]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            streamRef.current = stream;

            recorderRef.current = new RecordRTC(stream, {
                type: 'video',
                mimeType: 'video/webm; codecs=vp8,opus',
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 128000
            });

            recorderRef.current.startRecording();
            setIsRecording(true);
            setSecondsLeft(59);
        } catch (error) {
            alert("Could not access webcam or microphone.");
            console.error("Error accessing webcam or microphone:", error);
        }
    };

    const stopRecording = async () => {
        if (recorderRef.current) {
            recorderRef.current.stopRecording(() => {
                const blob = recorderRef.current.getBlob();
                const url = URL.createObjectURL(blob);
                setPreviewURL(url);
                streamRef.current.getTracks().forEach((track) => track.stop());
                setShowReplay(true);
            });
            setIsRecording(false);
        }
    };

    const submitVideo = async () => {
        if (!previewURL) return alert('No video recorded');

        try {
            const formData = new FormData();
            const response = await fetch(previewURL);
            const blob = await response.blob();
            formData.append('video', blob, 'video.mp4');

            await axios.post('http://localhost:5001/api/upload/upload-video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            navigate('/success');
        } catch (error) {
            alert('Failed to upload video');
            console.error('Error uploading video:', error);
        }
    };

    return (
        <RecorderContainer>
            <Title>Generated Interview Question</Title>
            {error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : (
                <QuestionContainer>
                    {question}
                </QuestionContainer>
            )}
            
            {isRecording && <Timer>Time Left: 00:{secondsLeft.toString().padStart(2, '0')}</Timer>}

            {!showReplay ? (
                <VideoPreview ref={videoRef} autoPlay muted />
            ) : (
                <VideoPreview src={previewURL} controls autoPlay />
            )}

            <ButtonContainer>
                {!isRecording && !showReplay && (
                    <Button onClick={startRecording}>Start Recording</Button>
                )}
                {isRecording && (
                    <Button onClick={stopRecording}>Stop Recording</Button>
                )}
                {showReplay && (
                    <>
                        <Button onClick={startRecording}>Retake</Button>
                        <Button onClick={submitVideo}>Submit Video</Button>
                    </>
                )}
            </ButtonContainer>
        </RecorderContainer>
    );
}

export default VideoRecorder;