// src/layouts/MainLayout.tsx (新文件)

import React, { useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Box, Tooltip, IconButton, Modal, Paper, Fab, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import AIAssistant from '../components/AIAssistant';
import { useThemeMode } from '../hooks/useThemeMode';
import { useLayout, useAI } from '../store/appStore';

const navItems = [
  { to: "/", icon: <HomeRoundedIcon />, label: "学习总览" },
  { to: "/review", icon: <TodayRoundedIcon />, label: "今日复习" },
  { to: "/library", icon: <LibraryBooksRoundedIcon />, label: "教材库" },
];

const MainLayout: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useLayout();
  const { isOpen: aiOpen, setOpen: setAiOpen } = useAI();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { isDarkMode, toggleTheme } = useThemeMode();

  // 自动折叠侧边栏在小屏幕上
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile, setSidebarOpen]);

  const sidebarWidth = sidebarOpen ? 90 : 60;

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: isDarkMode ? '#121218' : '#f4f7fe',
      backgroundImage: isDarkMode 
        ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
        : 'none'
    }}>
      {/* 响应式侧边栏 */}
      <Box 
        component={motion.aside}
        initial={{ x: -100 }}
        animate={{ x: 0, width: sidebarWidth }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        sx={{ 
          width: sidebarWidth, 
          bgcolor: isDarkMode ? '#0f0f0f' : 'white',
          backgroundImage: isDarkMode 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
            : 'none',
          borderRight: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e0e0e0',
          backdropFilter: isDarkMode ? 'blur(20px)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          gap: 2,
          position: 'relative'
        }}
      >
        {/* 折叠按钮 */}
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{
            position: 'absolute',
            top: 8,
            right: -12,
            width: 24,
            height: 24,
            bgcolor: isDarkMode ? '#1a1a1a' : 'white',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e0e0e0',
            boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
            color: isDarkMode ? 'white' : 'text.primary',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'grey.50'
            }
          }}
        >
          <MenuIcon sx={{ fontSize: 14 }} />
        </IconButton>
        {navItems.map(item => (
          <Tooltip title={!sidebarOpen ? item.label : ''} placement="right" key={item.to}>
            <IconButton 
              component={NavLink} 
              to={item.to}
              sx={{ 
                width: !sidebarOpen ? 40 : 60, 
                height: !sidebarOpen ? 40 : 60, 
                borderRadius: '18px',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'grey.600',
                transition: 'all 0.3s ease',
                '&.active': { 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  transform: !sidebarOpen ? 'scale(1.05)' : 'scale(1.1)',
                  boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)' 
                },
                '&:hover:not(.active)': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'grey.200'
                }
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
        
        {/* 主题切换按钮 */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <Tooltip title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'} placement="right">
            <IconButton
              onClick={toggleTheme}
              sx={{
                width: !sidebarOpen ? 40 : 60,
                height: !sidebarOpen ? 40 : 60,
                borderRadius: '18px',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'grey.600',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'grey.200',
                  transform: 'scale(1.05)',
                }
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 可滚动的主内容区 */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          position: 'relative',
          backgroundColor: isDarkMode ? '#121218' : 'transparent',
          backgroundImage: isDarkMode 
            ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
            : 'none'
        }}
      >
        <Outlet /> {/* 核心：所有子页面将在这里渲染 */}
      </Box>

      {/* 全局悬浮AI按钮 */}
      <Fab color="primary" onClick={() => setAiOpen(true)} sx={{ position: 'fixed', bottom: 32, right: 32, transform: 'scale(1.2)' }}>
        <SearchIcon />
      </Fab>

      {/* AI 模态对话框 */}
      <Modal open={aiOpen} onClose={() => setAiOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ width: '90%', maxWidth: '600px', p: 2, borderRadius: '16px', outline: 'none', position: 'relative' }}>
          <IconButton onClick={() => setAiOpen(false)} sx={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon /></IconButton>
          <AIAssistant />
        </Paper>
      </Modal>
    </Box>
  );
};

export default MainLayout;