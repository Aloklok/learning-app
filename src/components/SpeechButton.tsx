import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';

interface SpeechButtonProps {
  textToSpeak: string;
}

// Global SpeechSynthesisUtterance and SpeechSynthesis instance
let currentUtterance: SpeechSynthesisUtterance | null = null;
let speechSynthesis: SpeechSynthesis | null = null;

const SpeechButton: React.FC<SpeechButtonProps> = ({ textToSpeak }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!speechSynthesis) {
      speechSynthesis = window.speechSynthesis;
    }

    const handleEnd = () => {
      setIsSpeaking(false);
    };

    // Clean up on unmount
    return () => {
      if (utteranceRef.current) {
        utteranceRef.current.removeEventListener('end', handleEnd);
      }
    };
  }, []);

  const speak = () => {
    if (!speechSynthesis) return;

    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      if (currentUtterance) {
        currentUtterance.removeEventListener('end', () => setIsSpeaking(false));
      }
    }

    if (isSpeaking) {
      // If already speaking this text, stop it
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ja-JP'; // Set language to Japanese
    utterance.rate = 0.9; // Adjust speech rate if needed
    utterance.pitch = 1; // Adjust pitch if needed

    utterance.addEventListener('end', () => {
      setIsSpeaking(false);
      currentUtterance = null;
    });

    utteranceRef.current = utterance;
    currentUtterance = utterance; // Keep track of the globally active utterance

    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <IconButton onClick={speak} size="small" color={isSpeaking ? 'primary' : 'default'}>
      {isSpeaking ? <StopIcon /> : <VolumeUpIcon />}
    </IconButton>
  );
};

export default SpeechButton;
