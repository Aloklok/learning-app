// src/components/LessonNavigation.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import type { Lesson } from '../types/models';

interface LessonNavigationProps {
  neighborLessons: Lesson[];
  currentLessonId: number;
}

const LessonNavigation: React.FC<LessonNavigationProps> = React.memo(({ neighborLessons, currentLessonId }) => {
  if (!neighborLessons || neighborLessons.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
      {neighborLessons.map(lesson => (
        <Button 
          key={lesson.id} 
          component={Link} 
          to={`/learn/${lesson.id}`} 
          variant={lesson.id === currentLessonId ? "contained" : "outlined"}
          color="primary"
          size="large"
        >
          {`第${lesson.lesson_number}课`}
        </Button>
      ))}
    </Box>
  );
});

export default LessonNavigation;
