// src/components/AIAssistant.tsx (重构版 - 支持回车发送)

import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Paper } from '@mui/material';

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResponse('');
    try {
      if (window.ai?.ask) {
        const aiResponse = await window.ai.ask(prompt);
        setResponse(aiResponse);
      }
    } catch (error) {
      setResponse(`提问失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // --- 核心修改点 1: 增加键盘事件处理函数 ---
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // 检查是否是按下了 Enter 键，并且没有同时按下 Shift 键
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 阻止默认的回车换行行为
      handleAsk(); // 调用发送函数
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>AI 助手</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="在这里输入您的问题 (Shift + Enter 换行)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown} // 2. 绑定键盘事件
        disabled={loading}
      />
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleAsk} disabled={loading} sx={{ minWidth: '120px' }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : '提问 Gemini'}
        </Button>
      </Box>
      {response && (
        <Paper variant="outlined" sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', maxHeight: '300px', overflowY: 'auto' }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{response}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AIAssistant;