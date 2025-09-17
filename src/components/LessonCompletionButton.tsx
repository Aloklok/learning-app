// src/components/LessonCompletionButton.tsx

import React from 'react';
import { Box, Button } from '@mui/material';

interface LessonCompletionButtonProps {
  isCompleted: boolean;
  onToggleComplete: () => void;
  disabled: boolean;
}

const LessonCompletionButton: React.FC<LessonCompletionButtonProps> = React.memo(({ 
  isCompleted, 
  onToggleComplete, 
  disabled 
}) => {
  return (
    <Box mt={4} sx={{ textAlign: "center" }}>
      <Button 
        variant="contained" 
        size="large"
        color={isCompleted ? "success" : "primary"}
        onClick={onToggleComplete}
        disabled={disabled}
        sx={{
          textTransform: 'none',
          borderRadius: '8px',
          py: 1.5,
          px: 4,
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        {isCompleted ? "已完成 ✓" : "标记完成并学习下一课"}
      </Button>
    </Box>
  );
});

export default LessonCompletionButton;
