// src/components/LessonCompletionButton.tsx

import React from 'react';
import MKBox from '@mk_components/MKBox';
import MKButton from '@mk_components/MKButton';

interface LessonCompletionButtonProps {
  isCompleted: boolean;
  onToggleComplete: () => void;
  disabled: boolean;
}

const LessonCompletionButton: React.FC<LessonCompletionButtonProps> = React.memo(({ isCompleted, onToggleComplete, disabled }) => {
  return (
    <MKBox mt={4} textAlign="center">
      <MKButton 
        variant="contained" 
        size="large"
        color={isCompleted ? "success" : "primary"}
        onClick={onToggleComplete}
        disabled={disabled}
      >
        {isCompleted ? "已完成 ✓" : "标记完成并学习下一课"}
      </MKButton>
    </MKBox>
  );
});

export default LessonCompletionButton;
