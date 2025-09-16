// 文件: src/components/SpeechRecognition.tsx (最终完整版)

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Box, Typography, IconButton, CircularProgress, Chip, Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import * as Diff from 'diff';

interface SpeechRecognitionProps {
  targetText: string;
  targetLanguage: string; // e.g., 'ja-JP'
  onClose: () => void;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ targetText, targetLanguage, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [resultText, setResultText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [statusText, setStatusText] = useState('正在检查语音识别权限...');
  const [isClosing, setIsClosing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false); // 标记识别流程是否结束

  const cleanTargetText = useMemo(() => targetText.replace(/\[.*?\]/g, '').trim(), [targetText]);

  // 效果钩子：仅用于组件挂载时检查权限
  useEffect(() => {
    const checkPermission = async () => {
      setStatusText('正在检查语音识别权限...');
      const authorized = await window.electronAPI.requestAuthorization();
      setHasPermission(authorized);

      if (authorized) {
        setStatusText('权限已授予，请点击麦克风开始说话');
      } else {
        setStatusText('语音识别权限被拒绝。');
        setErrorText('请在系统设置 > 隐私与安全性 > 麦克风 和 语音识别 中授予权限。');
        setIsFinished(true); // 没有权限，直接标记为结束状态
      }
    };

    checkPermission();
  }, []); // 空依赖数组确保只运行一次

  // 处理函数：开始识别
  const handleStartRecognition = async () => {
    if (isListening || !hasPermission || isFinished) return;
    
    setIsListening(true);
    setIsFinished(false);
    setStatusText('正在聆听...');
    setErrorText('');
    setResultText('');

    try {
      const result = await window.electronAPI.recognize({ language: targetLanguage });
      if (result.success) {
        setResultText(result.text);
        setStatusText('识别完成！');
      }
    } catch (error: any) {
      // 仅在错误不是由用户主动取消引起时显示
      if (error.message && !error.message.includes('cancel')) {
         setErrorText(error.message);
         setStatusText('识别出错');
      }
    } finally {
      setIsListening(false);
      setIsFinished(true); // 标记流程结束
    }
  };

  // 处理函数：停止识别
  const handleStopRecognition = () => {
    if (!isListening) return;
    setIsListening(false);
    setStatusText('已手动停止');
    window.electronAPI.cancelRecognition();
    setIsFinished(true); // 标记流程结束
  };

  // 处理函数：关闭模态框
  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    if (isListening) {
      window.electronAPI.cancelRecognition();
    }
    onClose();
  };
  
  // 辅助函数：计算相似度
  const similarity = useMemo(() => {
    if (!resultText || !cleanTargetText) return 0;
    const diff = Diff.diffChars(cleanTargetText, resultText);
    let common = 0;
    diff.forEach(part => {
      if (!part.added && !part.removed) {
        common += part.value.length;
      }
    });
    return Math.round((common / cleanTargetText.length) * 100);
  }, [resultText, cleanTargetText]);

  // 辅助函数：渲染文本差异
  const renderDiff = () => {
    if (!resultText) return null;
    const diff = Diff.diffChars(cleanTargetText, resultText);
    
    return (
      <Typography variant="h5" sx={{ mt: 2, p: 1, borderRadius: 1, background: '#f5f5f5' }}>
        {diff.map((part, index) => (
          <span key={index} style={{
            backgroundColor: part.added ? 'rgba(221, 240, 216, 0.5)' : part.removed ? 'rgba(242, 222, 222, 0.5)' : 'transparent',
            color: part.added ? '#3c763d' : part.removed ? '#a94442' : 'inherit',
            textDecoration: part.removed ? 'line-through' : 'none'
          }}>
            {part.value}
          </span>
        ))}
      </Typography>
    );
  };

  return (
    <Modal open={!isClosing} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        textAlign: 'center',
        borderRadius: 2
      }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2">
          发音练习
        </Typography>
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          目标句子: "{cleanTargetText}"
        </Typography>
        
        <Box my={4}>
          <IconButton 
            color={isListening ? 'error' : 'primary'} 
            onClick={isListening ? handleStopRecognition : handleStartRecognition}
            disabled={!hasPermission || isFinished} 
            sx={{ width: 100, height: 100 }}
          >
            {isListening 
              ? <StopIcon sx={{ fontSize: 60 }} /> 
              : <MicIcon sx={{ fontSize: 60 }} />}
          </IconButton>
          <Typography sx={{ mt: 1, fontStyle: 'italic' }}>{statusText}</Typography>
        </Box>

        {renderDiff()}

        {isFinished && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            {resultText && (
              <Chip
                icon={similarity > 80 ? <CheckCircleIcon /> : <CancelIcon />}
                label={`相似度: ${similarity}%`}
                color={similarity > 80 ? "success" : "error"}
                sx={{ mb: 2 }}
              />
            )}
            <Button variant="contained" onClick={handleClose}>
              完成
            </Button>
          </Box>
        )}
        {errorText && <Typography color="error" sx={{ mt: 2 }}>{errorText}</Typography>}
      </Box>
    </Modal>
  );
};

export default SpeechRecognition;