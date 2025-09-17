// src/components/TextReader.tsx (V-Final-Robust - 健壮最终版)

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Box, Typography, Paper, Button, Collapse, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import TranslateIcon from '@mui/icons-material/Translate';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { renderFurigana } from '../utils/furigana';
import SpeechRecognition from './SpeechRecognition';

// Theme Context
import { useAppTheme } from '../hooks/useAppTheme';

interface TextItem {
  id: number;
  content_jp?: string;
  content_cn?: string;
}

interface TextReaderProps {
  texts: TextItem[];
}

const TextReader: React.FC<TextReaderProps> = memo(({ texts }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [speechRecognitionTarget, setSpeechRecognitionTarget] = useState<string | null>(null);
  const { isDarkMode } = useAppTheme();

  const getCleanTextForSpeech = useCallback((text: string = '') => text.replace(/\[.*?\]/g, ''), []);

  const handlePlayAll = useCallback(() => {
    if (!texts || !Array.isArray(texts) || texts.length === 0) return;
    
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const fullText = texts.map(t => getCleanTextForSpeech(t.content_jp)).join('。');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  }, [texts, getCleanTextForSpeech]);
  
  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+R 朗读全文
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        handlePlayAll();
      }
      // Space 切换翻译显示
      if (e.code === 'Space' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        // 只有当焦点不在输入框时才响应空格键
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowTranslation(prev => !prev);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handlePlayAll]);
  
  // --- 核心修正点 1: 增加健壮性检查 ---
  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    return <Typography>暂无对话内容。</Typography>;
  }

  const handleBubbleClick = (dialogue: string) => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const cleanDialogue = getCleanTextForSpeech(dialogue);
    const utterance = new SpeechSynthesisUtterance(cleanDialogue);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<VolumeUpIcon />} 
          onClick={handlePlayAll}
          sx={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, #4a5568 0%, #553c7b 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '25px',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: isDarkMode ? '#ffffff' : '#ffffff',
            boxShadow: isDarkMode 
              ? '0 4px 15px rgba(74, 85, 104, 0.4)'
              : '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: isDarkMode 
                ? 'linear-gradient(135deg, #3a4553 0%, #4a3069 100%)'
                : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode 
                ? '0 6px 20px rgba(74, 85, 104, 0.6)'
                : '0 6px 20px rgba(102, 126, 234, 0.6)',
              color: isDarkMode ? '#ffffff !important' : '#ffffff !important',
            },
            transition: 'all 0.3s ease',
          }}
        >
          朗读全文
        </Button>
        <Button 
          variant="contained" 
          startIcon={<TranslateIcon />} 
          onClick={() => setShowTranslation(!showTranslation)}
          sx={{
            background: showTranslation 
              ? (isDarkMode 
                  ? 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)'
                  : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)')
              : (isDarkMode 
                  ? 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)'
                  : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'),
            borderRadius: '25px',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: isDarkMode ? '#ffffff' : '#ffffff',
            boxShadow: showTranslation 
              ? (isDarkMode 
                  ? '0 4px 15px rgba(56, 161, 105, 0.4)'
                  : '0 4px 15px rgba(40, 167, 69, 0.4)')
              : (isDarkMode 
                  ? '0 4px 15px rgba(74, 85, 104, 0.4)'
                  : '0 4px 15px rgba(108, 117, 125, 0.4)'),
            '&:hover': {
              background: showTranslation 
                ? (isDarkMode 
                    ? 'linear-gradient(135deg, #2f7d5a 0%, #276749 100%)'
                    : 'linear-gradient(135deg, #218838 0%, #1e7e34 100%)')
                : (isDarkMode 
                    ? 'linear-gradient(135deg, #3a4553 0%, #252a33 100%)'
                    : 'linear-gradient(135deg, #5a6268 0%, #3d4142 100%)'),
              transform: 'translateY(-2px)',
              boxShadow: showTranslation 
                ? (isDarkMode 
                    ? '0 6px 20px rgba(56, 161, 105, 0.6)'
                    : '0 6px 20px rgba(40, 167, 69, 0.6)')
                : (isDarkMode 
                    ? '0 6px 20px rgba(74, 85, 104, 0.6)'
                    : '0 6px 20px rgba(108, 117, 125, 0.6)'),
              color: isDarkMode ? '#ffffff !important' : '#ffffff !important',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {showTranslation ? '隐藏翻译' : '显示翻译'}
        </Button>
      </Box>

      {texts.map((text) => {
                const lines = text.content_jp ? text.content_jp.split('\n') : [];
        const translations = text.content_cn ? text.content_cn.split('\n') : [];

        return lines.map((line, lineIndex) => {
          const speakerMatch = line.match(/^(.+?)[：:]/);
          const speaker = speakerMatch ? speakerMatch[1] : null;
          const dialogue = speakerMatch ? line.substring(speakerMatch[0].length).trim() : line;
          const isSpeakerA = lineIndex % 2 === 0;

          return (
            <motion.div
              key={`${text.id}-${lineIndex}`}
              initial={{ opacity: 0, x: isSpeakerA ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: lineIndex * 0.1 }}
            >
              <Box sx={{ display: 'flex', justifyContent: isSpeakerA ? 'flex-start' : 'flex-end', mb: 2, alignItems: 'flex-end', gap: 1 }}>
                {isSpeakerA && (
                  <Tooltip title="发音练习">
                    <IconButton
                      size="small"
                      onClick={() => setSpeechRecognitionTarget(dialogue)}
                      sx={{
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <RecordVoiceOverIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Paper
                  onClick={() => handleBubbleClick(dialogue)}
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: isSpeakerA ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                    backgroundColor: isSpeakerA ? 'white' : 'primary.main',
                    color: isSpeakerA ? 'text.primary' : 'white',
                    maxWidth: '75%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }
                  }}
                >
                  {speaker && (
                    <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                      {/* --- 核心修正点 2: 对说话人也应用注音 --- */}
                      {renderFurigana(speaker)}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ lineHeight: 2.5, fontSize: '1.1rem' }}>
                    {/* --- 核心修正点 3: 对话内容应用注音 --- */}
                    {renderFurigana(dialogue)}
                  </Typography>
                  <Collapse in={showTranslation}>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.8, borderTop: `1px solid ${isSpeakerA ? '#eee' : 'rgba(255,255,255,0.3)'}`, pt: 1 }}>
                      {translations[lineIndex]?.substring(speakerMatch ? speakerMatch[0].length : 0).trim()}
                    </Typography>
                  </Collapse>
                </Paper>
              </Box>
            </motion.div>
          );
        });
      })}
      
      {/* 语音识别组件 */}
      {speechRecognitionTarget && (
        <SpeechRecognition
          targetText={speechRecognitionTarget}
          targetLanguage="ja-JP"
          onClose={() => setSpeechRecognitionTarget(null)}
        />
      )}
    </Box>
  );
});

export default TextReader;