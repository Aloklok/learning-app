import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useThemeMode } from '../hooks/useThemeMode';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';

const CustomTitleBar: React.FC = () => {
  const { isDarkMode } = useThemeMode();

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  return (
    <Box
      sx={{
        height: 40,
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        WebkitAppRegion: 'drag',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* 左侧：应用标题 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 8 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '0.9rem',
            color: isDarkMode ? 'white' : 'text.primary',
            opacity: 0.8
          }}
        >
          日语学习助手
        </Typography>
      </Box>

      {/* 右侧：窗口控制按钮 */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 0.5,
          WebkitAppRegion: 'no-drag' 
        }}
      >
        <IconButton
          size="small"
          onClick={handleMinimize}
          sx={{
            width: 28,
            height: 28,
            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }
          }}
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>
        
        <IconButton
          size="small"
          onClick={handleMaximize}
          sx={{
            width: 28,
            height: 28,
            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }
          }}
        >
          <CropSquareIcon fontSize="small" />
        </IconButton>
        
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            width: 28,
            height: 28,
            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            '&:hover': {
              backgroundColor: '#ff5f57',
              color: 'white',
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomTitleBar;
