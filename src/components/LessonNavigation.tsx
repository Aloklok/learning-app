// src/components/LessonNavigation.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import MKBox from '@mk_components/MKBox';
import MKButton from '@mk_components/MKButton';
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
    <MKBox display="flex" justifyContent="center" gap={2} mb={4} flexWrap="wrap">
      {neighborLessons.map(lesson => (
        <MKButton 
          key={lesson.id} 
          component={Link} 
          to={`/learn/${lesson.id}`} 
          variant={lesson.id === currentLessonId ? "contained" : "outlined"}
          color="info"
          size="large"
        >
          {`第${lesson.lesson_number}课`}
        </MKButton>
      ))}
    </MKBox>
  );
});

export default LessonNavigation;
