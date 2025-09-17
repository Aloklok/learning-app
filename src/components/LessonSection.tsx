// src/components/LessonSection.tsx

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface LessonSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const LessonSection: React.FC<LessonSectionProps> = React.memo(({ title, icon, children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        p: 3,
        mb: 3,
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 'bold',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {icon} {title}
      </Typography>
      {children}
    </Box>
  );
});

export default LessonSection;
