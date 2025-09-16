import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Card } from '@mui/material';

// Material Kit Components
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';

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
        <MKBox p={4} position="relative" zIndex={1}>
          <MKTypography 
            variant="h3" 
            fontWeight="bold" 
            color="white" 
            mb={1}
            sx={{ 
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            早上好, Alok! 👋
          </MKTypography>
          <MKTypography 
            variant="h6" 
            color="rgba(255,255,255,0.9)" 
            fontWeight="normal"
            sx={{ opacity: 0.9 }}
          >
            今天也是充满活力的一天，继续你的学习之旅吧！
          </MKTypography>
        </MKBox>
      </Card>
    </motion.div>
  );
};

export default HeaderCard;