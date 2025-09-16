// src/components/SmartReminder.tsx
// 智能提醒系统组件

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, IconButton, Chip, Switch, FormControlLabel } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeMode } from '../hooks/useThemeMode';

import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';
import MKButton from '@mk_components/MKButton';

interface ReminderSettings {
  enabled: boolean;
  dailyGoal: number; // 每日学习目标（分钟）
  reminderTimes: string[]; // 提醒时间 ['09:00', '18:00']
  weekdays: boolean[]; // 周一到周日是否启用 [true, true, true, true, true, false, false]
  smartReminders: boolean; // 是否启用智能提醒
}

interface PendingReminder {
  id: string;
  type: 'review' | 'study' | 'goal';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  scheduledTime: Date;
  data?: Record<string, unknown>;
}

interface SmartReminderProps {
  onStartReview?: () => void;
  onStartStudy?: () => void;
}

const SmartReminder: React.FC<SmartReminderProps> = ({ onStartReview, onStartStudy }) => {
  const { isDarkMode } = useThemeMode();
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: true,
    dailyGoal: 30,
    reminderTimes: ['09:00', '18:00'],
    weekdays: [true, true, true, true, true, false, false],
    smartReminders: true
  });
  
  const [pendingReminders, setPendingReminders] = useState<PendingReminder[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // 模拟获取待处理提醒
  useEffect(() => {
    const mockReminders: PendingReminder[] = [
      {
        id: '1',
        type: 'review',
        title: '复习提醒',
        message: '有 12 个词汇需要复习',
        priority: 'high',
        scheduledTime: new Date(),
        data: { count: 12, type: 'vocabulary' }
      },
      {
        id: '2',
        type: 'study',
        title: '学习目标',
        message: '今日还需学习 15 分钟达成目标',
        priority: 'medium',
        scheduledTime: new Date(),
        data: { remaining: 15 }
      }
    ];
    
    if (settings.enabled) {
      setPendingReminders(mockReminders);
    }
  }, [settings.enabled]);

  // 检查是否应该显示提醒
  const shouldShowReminder = (): boolean => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = 周日, 1 = 周一, ...
    const weekdayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 转换为我们的数组索引
    
    return settings.enabled && settings.weekdays[weekdayIndex];
  };

  // 处理提醒操作
  const handleReminderAction = (reminder: PendingReminder, action: 'accept' | 'dismiss' | 'snooze') => {
    switch (action) {
      case 'accept':
        if (reminder.type === 'review' && onStartReview) {
          onStartReview();
        } else if (reminder.type === 'study' && onStartStudy) {
          onStartStudy();
        }
        dismissReminder(reminder.id);
        break;
      case 'dismiss':
        dismissReminder(reminder.id);
        break;
      case 'snooze': {
        // 延迟10分钟
        const snoozedReminder = {
          ...reminder,
          scheduledTime: new Date(Date.now() + 10 * 60 * 1000)
        };
        setPendingReminders(prev => 
          prev.map(r => r.id === reminder.id ? snoozedReminder : r)
        );
        break;
      }
    }
  };

  // 关闭提醒
  const dismissReminder = (id: string) => {
    setPendingReminders(prev => prev.filter(r => r.id !== id));
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return isDarkMode ? '#fc8181' : '#e53e3e';
      case 'medium': return isDarkMode ? '#f6ad55' : '#dd6b20';
      case 'low': return isDarkMode ? '#68d391' : '#38a169';
      default: return isDarkMode ? '#a0aec0' : '#718096';
    }
  };

  // 渲染提醒卡片
  const ReminderCard: React.FC<{ reminder: PendingReminder }> = ({ reminder }) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
        border: `2px solid ${getPriorityColor(reminder.priority)}`,
        mb: 2
      }}>
        <CardContent>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box flex={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon sx={{ 
                  color: getPriorityColor(reminder.priority), 
                  mr: 1, 
                  fontSize: 20 
                }} />
                <MKTypography variant="h6" color={isDarkMode ? 'white' : 'dark'}>
                  {reminder.title}
                </MKTypography>
                <Chip 
                  label={reminder.priority} 
                  size="small" 
                  sx={{ 
                    ml: 1,
                    bgcolor: getPriorityColor(reminder.priority),
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              </Box>
              <MKTypography variant="body2" color="text.secondary" mb={2}>
                {reminder.message}
              </MKTypography>
              <Box display="flex" gap={1}>
                <MKButton 
                  size="small" 
                  variant="contained" 
                  color="primary"
                  onClick={() => handleReminderAction(reminder, 'accept')}
                >
                  {reminder.type === 'review' ? '开始复习' : '开始学习'}
                </MKButton>
                <MKButton 
                  size="small" 
                  variant="outlined" 
                  color="secondary"
                  onClick={() => handleReminderAction(reminder, 'snooze')}
                >
                  稍后提醒
                </MKButton>
              </Box>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => handleReminderAction(reminder, 'dismiss')}
              sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  // 渲染设置面板
  const SettingsPanel: React.FC = () => (
    <Card sx={{
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      mt: 2
    }}>
      <CardContent>
        <MKTypography variant="h6" color={isDarkMode ? 'white' : 'dark'} mb={2}>
          提醒设置
        </MKTypography>
        
        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch 
                checked={settings.enabled}
                onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                color="primary"
              />
            }
            label={
              <MKTypography variant="body2" color={isDarkMode ? '#e2e8f0' : '#4a5568'}>
                启用提醒
              </MKTypography>
            }
          />
        </Box>

        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch 
                checked={settings.smartReminders}
                onChange={(e) => setSettings(prev => ({ ...prev, smartReminders: e.target.checked }))}
                color="primary"
                disabled={!settings.enabled}
              />
            }
            label={
              <MKTypography variant="body2" color={isDarkMode ? '#e2e8f0' : '#4a5568'}>
                智能提醒（基于学习习惯）
              </MKTypography>
            }
          />
        </Box>

        <Box mb={3}>
          <MKTypography variant="body2" color={isDarkMode ? '#e2e8f0' : '#4a5568'} mb={1}>
            提醒时间
          </MKTypography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {settings.reminderTimes.map((time, index) => (
              <Chip 
                key={index}
                label={time}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Box>
          <MKTypography variant="body2" color={isDarkMode ? '#e2e8f0' : '#4a5568'} mb={1}>
            提醒日期
          </MKTypography>
          <Box display="flex" gap={1}>
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => (
              <Chip 
                key={index}
                label={day}
                size="small"
                color={settings.weekdays[index] ? "primary" : "default"}
                variant={settings.weekdays[index] ? "filled" : "outlined"}
                onClick={() => {
                  const newWeekdays = [...settings.weekdays];
                  newWeekdays[index] = !newWeekdays[index];
                  setSettings(prev => ({ ...prev, weekdays: newWeekdays }));
                }}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const visibleReminders = pendingReminders.filter(shouldShowReminder);

  return (
    <MKBox>
      {/* 提醒开关和设置按钮 */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          {settings.enabled ? (
            <NotificationsIcon sx={{ color: isDarkMode ? '#63b3ed' : '#3182ce', mr: 1 }} />
          ) : (
            <NotificationsOffIcon sx={{ color: isDarkMode ? '#a0aec0' : '#718096', mr: 1 }} />
          )}
          <MKTypography variant="h6" color={isDarkMode ? 'white' : 'dark'}>
            学习提醒
            {visibleReminders.length > 0 && (
              <Chip 
                label={visibleReminders.length}
                size="small"
                color="error"
                sx={{ ml: 1 }}
              />
            )}
          </MKTypography>
        </Box>
        <MKButton 
          size="small" 
          variant="outlined"
          onClick={() => setShowSettings(!showSettings)}
        >
          设置
        </MKButton>
      </Box>

      {/* 待处理提醒列表 */}
      <AnimatePresence>
        {visibleReminders.map(reminder => (
          <ReminderCard key={reminder.id} reminder={reminder} />
        ))}
      </AnimatePresence>

      {/* 无提醒时的提示 */}
      {settings.enabled && visibleReminders.length === 0 && (
        <Card sx={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          textAlign: 'center',
          py: 3
        }}>
          <CardContent>
            <NotificationsIcon sx={{ 
              fontSize: 48, 
              color: isDarkMode ? '#4a5568' : '#a0aec0',
              mb: 1 
            }} />
            <MKTypography variant="body2" color="text.secondary">
              暂无待处理提醒
            </MKTypography>
          </CardContent>
        </Card>
      )}

      {/* 设置面板 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </MKBox>
  );
};

export default SmartReminder;
