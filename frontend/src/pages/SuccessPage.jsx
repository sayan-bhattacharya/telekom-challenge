import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe animation for the checkmark
const tickAnimation = keyframes`
  0% {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
`;

// Styled Components
const SuccessContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #e9f5ee;
    font-family: Arial, sans-serif;
`;

const TickCircle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: #4CAF50;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const TickSVG = styled.svg`
    width: 70px;
    height: 70px;
`;

const TickPath = styled.path`
    fill: none;
    stroke: white;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 100;
    animation: ${tickAnimation} 0.6s ease forwards;
`;

const Message = styled.h2`
    font-size: 1.8em;
    color: #333;
    text-align: center;
    max-width: 500px;
    margin-top: 20px;
`;

const Subtitle = styled.p`
    font-size: 1.2em;
    color: #555;
    text-align: center;
    max-width: 400px;
    margin-top: 10px;
`;

function SuccessPage() {
    return (
        <SuccessContainer>
            <TickCircle>
                <TickSVG viewBox="0 0 24 24">
                    <TickPath d="M4 12l6 6L20 6" />
                </TickSVG>
            </TickCircle>
            <Message>Video Submitted Successfully!</Message>
            <Subtitle>Thank you! Your video has been uploaded and submitted for review.</Subtitle>
        </SuccessContainer>
    );
}

export default SuccessPage;