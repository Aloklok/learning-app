// src/components/StudyStatsPanel.tsx
// 学习统计面板组件

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, LinearProgress } from '@mui/material';
import { PieChart } from 'react-minimal-pie-chart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import { useThemeMode } from '../hooks/useThemeMode';

import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';

interface StudyStats {
  totalStudyTime: number; // 总学习时间（分钟）
  todayStudyTime: number; // 今日学习时间（分钟）
  weeklyStudyTime: number[]; // 本周每日学习时间
  vocabularyStats: {
    total: number;
    mastered: number;
    reviewing: number;
    learning: number;
  };
  grammarStats: {
    total: number;
    mastered: number;
    reviewing: number;
    learning: number;
  };
  reviewAccuracy: {
    overall: number;
    vocabulary: number;
    grammar: number;
  };
  streakDays: number; // 连续学习天数
  completedLessons: number;
}

interface StudyStatsPanelProps {
  stats?: StudyStats;
  loading?: boolean;
}

const StudyStatsPanel: React.FC<StudyStatsPanelProps> = ({ stats, loading = false }) => {
  const { isDarkMode } = useThemeMode();
  const [animatedStats, setAnimatedStats] = useState<StudyStats | null>(null);

  // 默认统计数据
  const defaultStats: StudyStats = {
    totalStudyTime: 0,
    todayStudyTime: 0,
    weeklyStudyTime: [0, 0, 0, 0, 0, 0, 0],
    vocabularyStats: { total: 0, mastered: 0, reviewing: 0, learning: 0 },
    grammarStats: { total: 0, mastered: 0, reviewing: 0, learning: 0 },
    reviewAccuracy: { overall: 0, vocabulary: 0, grammar: 0 },
    streakDays: 0,
    completedLessons: 0
  };

  const currentStats = stats || defaultStats;

  // 动画效果 - 使用animatedStats变量
  useEffect(() => {
    if (currentStats) {
      const timer = setTimeout(() => {
        setAnimatedStats(currentStats);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStats]);
  
  // 确保animatedStats被使用
  const statsToDisplay = animatedStats || currentStats;

  // 格式化时间
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  // 获取掌握程度颜色
  const getMasteryColor = (level: 'mastered' | 'reviewing' | 'learning') => {
    if (isDarkMode) {
      switch (level) {
        case 'mastered': return '#68d391';
        case 'reviewing': return '#63b3ed';
        case 'learning': return '#f6ad55';
        default: return '#a0aec0';
      }
    } else {
      switch (level) {
        case 'mastered': return '#38a169';
        case 'reviewing': return '#3182ce';
        case 'learning': return '#dd6b20';
        default: return '#718096';
      }
    }
  };

  // 渲染统计卡片
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
  }> = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card sx={{
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      height: '100%'
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box 
            sx={{ 
              color: color === 'primary' ? (isDarkMode ? '#63b3ed' : '#3182ce') : color,
              mr: 1 
            }}
          >
            {icon}
          </Box>
          <MKTypography variant="h6" color={isDarkMode ? 'white' : 'dark'}>
            {title}
          </MKTypography>
        </Box>
        <MKTypography variant="h4" fontWeight="bold" color={isDarkMode ? 'white' : 'dark'}>
          {value}
        </MKTypography>
        {subtitle && (
          <MKTypography variant="body2" color="text.secondary" mt={1}>
            {subtitle}
          </MKTypography>
        )}
      </CardContent>
    </Card>
  );

  // 渲染进度环形图
  const ProgressRing: React.FC<{
    title: string;
    data: { label: string; value: number; color: string }[];
    total: number;
  }> = ({ title, data, total }) => (
    <Card sx={{
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      height: '100%'
    }}>
      <CardContent>
        <MKTypography variant="h6" color={isDarkMode ? 'white' : 'dark'} mb={2}>
          {title}
        </MKTypography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box width={120} height={120}>
            <PieChart
              data={data.filter(item => item.value > 0)}
              lineWidth={20}
              paddingAngle={2}
              rounded
              animate
              animationDuration={1000}
            />
          </Box>
          <Box flex={1} ml={2}>
            {data.map((item, index) => (
              <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center">
                  <Box 
                    width={12} 
                    height={12} 
                    borderRadius="50%" 
                    bgcolor={item.color} 
                    mr={1}
                  />
                  <Typography variant="body2" color={isDarkMode ? '#e2e8f0' : '#4a5568'}>
                    {item.label}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold" color={isDarkMode ? 'white' : 'dark'}>
                  {item.value}
                </Typography>
              </Box>
            ))}
            <Box mt={2} pt={1} borderTop={1} borderColor={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}>
              <Typography variant="body2" color={isDarkMode ? '#a0aec0' : '#718096'}>
                总计: {total}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <MKBox p={3}>
        <MKTypography variant="h5" sx={{ mb: 3 }}>学习统计</MKTypography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={i}>
              <Card sx={{ height: 150 }}>
                <CardContent>
                  <LinearProgress />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MKBox>
    );
  }

  const vocabularyPieData = [
    { label: '已掌握', value: statsToDisplay.vocabularyStats.mastered, color: getMasteryColor('mastered') },
    { label: '复习中', value: statsToDisplay.vocabularyStats.reviewing, color: getMasteryColor('reviewing') },
    { label: '学习中', value: statsToDisplay.vocabularyStats.learning, color: getMasteryColor('learning') }
  ];

  const grammarPieData = [
    { label: '已掌握', value: statsToDisplay.grammarStats.mastered, color: getMasteryColor('mastered') },
    { label: '复习中', value: statsToDisplay.grammarStats.reviewing, color: getMasteryColor('reviewing') },
    { label: '学习中', value: statsToDisplay.grammarStats.learning, color: getMasteryColor('learning') }
  ];

  return (
    <MKBox p={3}>
      <MKTypography variant="h5" mb={3} color={isDarkMode ? 'white' : 'dark'}>
        学习统计
      </MKTypography>

      {/* 主要统计指标 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="今日学习"
            value={formatTime(statsToDisplay.todayStudyTime)}
            subtitle={`总计 ${formatTime(statsToDisplay.totalStudyTime)}`}
            icon={<TimerIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="连续学习"
            value={`${statsToDisplay.streakDays}天`}
            subtitle="保持学习习惯"
            icon={<TrendingUpIcon />}
            color={getMasteryColor('mastered')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="整体正确率"
            value={`${statsToDisplay.reviewAccuracy.overall}%`}
            subtitle={`词汇${statsToDisplay.reviewAccuracy.vocabulary}% | 语法${statsToDisplay.reviewAccuracy.grammar}%`}
            icon={<CheckCircleIcon />}
            color={getMasteryColor('reviewing')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <StatCard
            title="完成课程"
            value={statsToDisplay.completedLessons}
            subtitle="继续加油！"
            icon={<SchoolIcon />}
            color={getMasteryColor('learning')}
          />
        </Grid>
      </Grid>

      {/* 详细进度分析 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProgressRing
            title="词汇掌握情况"
            data={vocabularyPieData}
            total={statsToDisplay.vocabularyStats.total}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProgressRing
            title="语法掌握情况"
            data={grammarPieData}
            total={statsToDisplay.grammarStats.total}
          />
        </Grid>
      </Grid>

      {/* 本周学习时间趋势 */}
      <Card sx={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
      }}>
        <CardContent>
          <MKTypography variant="h6" color={isDarkMode ? 'white' : 'dark'} sx={{ mb: 3 }}>
            本周学习时间
          </MKTypography>
          <Grid container spacing={1}>
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => {
              const minutes = statsToDisplay.weeklyStudyTime[index];
              const maxMinutes = Math.max(...statsToDisplay.weeklyStudyTime, 60);
              const percentage = (minutes / maxMinutes) * 100;
              
              return (
                <Grid size="grow" key={index}>
                  <Box textAlign="center">
                    <Box
                      height={100}
                      display="flex"
                      alignItems="end"
                      justifyContent="center"
                      mb={1}
                    >
                      <Box
                        width={20}
                        height={`${percentage}%`}
                        bgcolor={isDarkMode ? '#63b3ed' : '#3182ce'}
                        borderRadius={1}
                        sx={{ minHeight: '4px' }}
                      />
                    </Box>
                    <Typography variant="caption" color={isDarkMode ? '#a0aec0' : '#718096'}>
                      {day}
                    </Typography>
                    <Typography variant="caption" display="block" color={isDarkMode ? 'white' : 'dark'}>
                      {minutes}分
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </MKBox>
  );
};

export default StudyStatsPanel;
