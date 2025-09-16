import React from 'react';
import { Card, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useThemeMode } from '../../hooks/useThemeMode';

// Material Kit Components
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';

// Types
import type { ProgressByLevel } from '../../types/models';

interface JLPTProgressCardProps {
  progressByLevel: ProgressByLevel;
  variants: Variants;
}

const JLPTProgressCard: React.FC<JLPTProgressCardProps> = ({ progressByLevel, variants }) => {
  const { isDarkMode } = useThemeMode();
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
  
  const levelColors = {
    N5: { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', bg: 'rgba(79, 172, 254, 0.1)' },
    N4: { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', bg: 'rgba(67, 233, 123, 0.1)' },
    N3: { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', bg: 'rgba(250, 112, 154, 0.1)' },
    N2: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', bg: 'rgba(102, 126, 234, 0.1)' },
    N1: { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', bg: 'rgba(240, 147, 251, 0.1)' },
  };

  return (
    <motion.div variants={variants}>
      <Card 
        sx={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)'
            : 'white',
          borderRadius: 4,
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.1)',
          border: isDarkMode 
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: isDarkMode 
              ? '0 20px 40px rgba(0,0,0,0.6)'
              : '0 20px 40px rgba(0,0,0,0.15)',
          }
        }}
      >
        <MKBox p={4}>
          <MKBox mb={3} textAlign="center">
            <MKTypography 
              variant="h4" 
              fontWeight="bold" 
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              JLPT 词汇进度 🎯
            </MKTypography>
            <MKTypography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
              日本语能力测试各级别掌握情况
            </MKTypography>
          </MKBox>

          <MKBox display="flex" flexDirection="column" gap={3}>
            {levels.map((level) => {
              const progress = progressByLevel[level];
              const percentage = progress.total > 0 ? (progress.mastered / progress.total) * 100 : 0;
              const colors = levelColors[level];
              
              return (
                <MKBox key={level}>
                  <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <MKBox display="flex" alignItems="center" gap={2}>
                      <MKBox
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: colors.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            background: colors.gradient,
                            opacity: 0.2,
                            zIndex: 0
                          }
                        }}
                      >
                        <MKTypography 
                          variant="body2" 
                          fontWeight="bold"
                          sx={{ 
                            background: colors.gradient,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            zIndex: 1
                          }}
                        >
                          {level}
                        </MKTypography>
                      </MKBox>
                      <MKTypography variant="h6" fontWeight="bold" color="text.primary">
                        {level} 级别
                      </MKTypography>
                    </MKBox>
                    <MKTypography variant="body2" color="text.secondary">
                      {progress.mastered} / {progress.total} ({percentage.toFixed(1)}%)
                    </MKTypography>
                  </MKBox>
                  
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.bg,
                      '& .MuiLinearProgress-bar': {
                        background: colors.gradient,
                        borderRadius: 4,
                      }
                    }}
                  />
                </MKBox>
              );
            })}
          </MKBox>
        </MKBox>
      </Card>
    </motion.div>
  );
};

export default JLPTProgressCard;
