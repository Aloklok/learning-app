import React, { useState, memo, useCallback } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Rating, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import { renderFurigana } from '../utils/furigana';
import { LearningCard, JapaneseText, PartOfSpeechTag } from '../theme/components/LearningComponents';

// Icons
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

const WordCard = memo<WordCardProps>((props) => {
  const { id, word, kana, meaning, part_of_speech, mastery_level, onMasteryChange } = props;
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [showSpeechRecognition, setShowSpeechRecognition] = useState(false);

  const textToSpeak = kana || word;

  const handleCardClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('.MuiRating-root')) {
      return;
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
      <Card 
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
        elevation={0}
      >
        <CardContent>
          <Typography 
            className="word-text"
            component="div"
          >
            {renderFurigana(`${word}[${kana}]`)}
          </Typography>
          {part_of_speech && (
            <Typography 
              className="part-of-speech"
              component="div"
            >
              {part_of_speech}
            </Typography>
          )}
          <Typography 
            className="meaning-text"
            component="div"
          >
            {meaning}
          </Typography>
          <Rating
            name={`mastery-rating-${id}`}
            value={mastery_level + 1}
            max={3}
            onChange={handleRatingChange}
            size="large"
          />
        </CardContent>
      </Card>
      
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
