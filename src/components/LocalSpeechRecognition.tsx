// src/components/LocalSpeechRecognition.tsx
// macOS本地语音识别组件

import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useAppTheme } from '../hooks/useAppTheme';

interface LocalSpeechRecognitionProps {
  targetText: string;
  targetLanguage?: 'ja-JP' | 'en-US';
  onResult?: (result: SpeechResult) => void;
}

interface SpeechResult {
  transcript: string;
  confidence: number;
  accuracy: number;
  feedback: string;
  isCorrect: boolean;
}

declare global {
  interface Window {
    speech?: {
      startRecognition: (language?: string) => Promise<any>;
      stopRecognition: () => Promise<any>;
      speak: (text: string, language?: string) => Promise<any>;
    };
  }
}

const LocalSpeechRecognition: React.FC<LocalSpeechRecognitionProps> = ({
  targetText,
  targetLanguage = 'ja-JP',
  onResult
}) => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(!!window.speech);
  
  const { isDarkMode } = useAppTheme();

  // 计算发音准确度
  const calculateAccuracy = useCallback((spoken: string, target: string): number => {
    const spokenClean = spoken.toLowerCase().replace(/[^\w\s]/g, '');
    const targetClean = target.toLowerCase().replace(/[^\w\s]/g, '');
    
    if (spokenClean === targetClean) return 100;
    
    // 使用编辑距离算法计算相似度
    const matrix = Array(targetClean.length + 1).fill(null).map(() => 
      Array(spokenClean.length + 1).fill(null)
    );
    
    for (let i = 0; i <= targetClean.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= spokenClean.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= targetClean.length; i++) {
      for (let j = 1; j <= spokenClean.length; j++) {
        if (targetClean[i - 1] === spokenClean[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    const distance = matrix[targetClean.length][spokenClean.length];
    const maxLength = Math.max(targetClean.length, spokenClean.length);
    return Math.max(0, Math.round((1 - distance / maxLength) * 100));
  }, []);

  // 生成反馈信息
  const generateFeedback = useCallback((accuracy: number, confidence: number): string => {
    if (accuracy >= 90 && confidence >= 0.8) {
      return '发音非常准确！继续保持！';
    } else if (accuracy >= 70 && confidence >= 0.6) {
      return '发音不错，可以再练习一下语调';
    } else if (accuracy >= 50) {
      return '需要改进，建议多听多练';
    } else {
      return '与目标差距较大，建议重新练习';
    }
  }, []);

  // 开始语音识别
  const startListening = useCallback(async () => {
    if (!isSupported || !window.speech) {
      setError('本地语音识别不可用，请确保运行在macOS系统上');
      return;
    }

    try {
      setIsListening(true);
      setError(null);
      setResult(null);

      const recognitionResult = await window.speech.startRecognition(targetLanguage);
      
      if (recognitionResult.transcript) {
        const accuracy = calculateAccuracy(recognitionResult.transcript, targetText);
        const feedback = generateFeedback(accuracy, recognitionResult.confidence);
        const isCorrect = accuracy >= 70 && recognitionResult.confidence >= 0.6;
        
        const resultData: SpeechResult = {
          transcript: recognitionResult.transcript,
          confidence: recognitionResult.confidence,
          accuracy,
          feedback,
          isCorrect
        };
        
        setResult(resultData);
        onResult?.(resultData);
      }
    } catch (err: any) {
      setError(`语音识别失败: ${err.message || '未知错误'}`);
    } finally {
      setIsListening(false);
    }
  }, [isSupported, targetLanguage, targetText, calculateAccuracy, generateFeedback, onResult]);

  // 停止语音识别
  const stopListening = useCallback(async () => {
    if (window.speech) {
      try {
        await window.speech.stopRecognition();
      } catch (err) {
        console.error('停止识别失败:', err);
      }
    }
    setIsListening(false);
  }, []);

  // 播放目标文本
  const playTargetText = useCallback(async () => {
    if (window.speech) {
      try {
        await window.speech.speak(targetText, targetLanguage);
      } catch (err) {
        console.error('语音播放失败:', err);
        setError('语音播放失败');
      }
    }
  }, [targetText, targetLanguage]);

  if (!isSupported) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        本地语音识别不可用。请确保：
        <br />• 运行在macOS系统上
        <br />• 已启用系统语音识别功能
        <br />• 应用有麦克风权限
      </Alert>
    );
  }

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3, 
        mt: 2,
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1e1e24 0%, #2a2a30 100%)'
          : 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <Typography variant="h6" gutterBottom>
        发音练习 (本地识别)
      </Typography>
      
      {/* 目标文本 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          目标文本: {targetText}
        </Typography>
        <Tooltip title="播放目标发音">
          <IconButton onClick={playTargetText} size="small">
            <VolumeUpIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 控制按钮 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant={isListening ? "outlined" : "contained"}
          color={isListening ? "secondary" : "primary"}
          startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
        >
          {isListening ? '停止录音' : '开始录音'}
        </Button>
      </Box>

      {/* 录音状态 */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              正在使用macOS本地语音识别...
            </Typography>
            <Chip 
              label="本地识别中"
              size="small"
              color="primary"
              sx={{ mt: 1 }}
            />
          </Box>
        </motion.div>
      )}

      {/* 结果显示 */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert 
              severity={result.isCorrect ? "success" : "warning"}
              icon={result.isCorrect ? <CheckCircleIcon /> : <ErrorIcon />}
              sx={{ mt: 2 }}
            >
              <Typography variant="body2" gutterBottom>
                <strong>识别结果:</strong> {result.transcript}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>准确度: {result.accuracy}%</strong> | 
                <strong> 置信度: {Math.round(result.confidence * 100)}%</strong>
              </Typography>
              <Typography variant="body2">
                {result.feedback}
              </Typography>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误显示 */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
            {error}
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default LocalSpeechRecognition;
