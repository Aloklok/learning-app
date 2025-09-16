// src/components/WordCard.tsx (V-Final-Native - 原生MUI终极版)

import React, { useState, memo, useCallback } from 'react';
import { Box, Typography, Card, CardContent, Rating, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { useThemeMode } from '../hooks/useThemeMode';
import { renderFurigana } from '../utils/furigana';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TranslateIcon from '@mui/icons-material/Translate';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SpeechRecognition from './SpeechRecognition';

interface WordCardProps {
  id: number;
  word: string;
  kana: string;
  meaning: string;
  part_of_speech?: string;
  mastery_level: number;
  onMasteryChange: (wordId: number, newLevel: number) => void;
}

const WordCard: React.FC<WordCardProps> = memo((props) => {
  const { id, word, kana, meaning, part_of_speech, mastery_level, onMasteryChange } = props;
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [showSpeechRecognition, setShowSpeechRecognition] = useState(false);
  const { isDarkMode } = useThemeMode();

  const textToSpeak = kana || word;

  const handleCardClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('.MuiRating-root')) {
      return; // 如果点击的是星级评分区域，则不触发朗读
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  }, [textToSpeak]);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  }, [contextMenu]);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleCopyWord = useCallback(() => {
    navigator.clipboard.writeText(`${word} (${kana}) - ${meaning}`);
    handleCloseContextMenu();
  }, [word, kana, meaning, handleCloseContextMenu]);

  const handleCopyKana = useCallback(() => {
    navigator.clipboard.writeText(kana);
    handleCloseContextMenu();
  }, [kana, handleCloseContextMenu]);

  const handleCopyMeaning = useCallback(() => {
    navigator.clipboard.writeText(meaning);
    handleCloseContextMenu();
  }, [meaning, handleCloseContextMenu]);

  const handleRatingChange = useCallback((_event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      onMasteryChange(id, newValue - 1);
    }
  }, [id, onMasteryChange]);

  return (
    <>
      <motion.div whileHover={{ scale: 1.03, y: -5 }} style={{ height: '100%' }}>
        <Card 
          onClick={handleCardClick}
          onContextMenu={handleContextMenu}
          sx={{ 
            height: '100%', 
            cursor: 'pointer',
            borderRadius: 2,
            boxShadow: 4,
            display: 'flex',
            flexDirection: 'column',
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)'
              : 'white',
            border: isDarkMode 
              ? '1px solid rgba(255,255,255,0.1)'
              : 'none',
            '&:hover': {
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0,0,0,0.6)'
                : '0 8px 32px rgba(0,0,0,0.15)',
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {renderFurigana(`${word}[${kana}]`)}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {part_of_speech}
            </Typography>
            <Typography variant="h6" sx={{ my: 2 }}>
              {meaning}
            </Typography>
          </CardContent>
          <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'center' }}>
            <Rating
              name={`mastery-rating-${id}`}
              value={mastery_level + 1}
              max={3}
              onChange={handleRatingChange}
              size="large"
            />
          </Box>
        </Card>
      </motion.div>
      
      {/* 右键菜单 */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleCardClick({} as React.MouseEvent<HTMLDivElement>)}>
          <ListItemIcon>
            <VolumeUpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>朗读单词</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopyWord}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>复制完整信息</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopyKana}>
          <ListItemIcon>
            <VolumeUpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>复制假名</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopyMeaning}>
          <ListItemIcon>
            <TranslateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>复制中文释义</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setShowSpeechRecognition(true)}>
          <ListItemIcon>
            <RecordVoiceOverIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>发音练习</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* 语音识别组件 */}
      {showSpeechRecognition && (
        <SpeechRecognition
          targetText={textToSpeak}
          targetLanguage="ja-JP"
          onClose={() => {
            setShowSpeechRecognition(false);
          }}
        />
      )}
    </>
  );
});

export default WordCard;