import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card } from '@mui/material';

// MUI Components
import { Box, Typography } from '@mui/material';

// Types
import type { DashboardStats } from '../../types/models';

interface HeaderCardProps {
  stats: DashboardStats;
  variants: Variants;
}

const HeaderCard: React.FC<HeaderCardProps> = ({ variants }) => {
  return (
    <motion.div variants={variants}>
      <Card 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ p: 4, position: "relative", zIndex: 1 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            color="white" 
            sx={{ 
              mb: 1,
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            早上好, Alok! 👋
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              opacity: 0.9
            }}
          >
            今天也是充满活力的一天，继续你的学习之旅吧！
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
};

export default HeaderCard;