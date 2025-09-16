// src/components/LessonHeader.tsx

import React from 'react';

// Material Kit Components
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';

import type { Lesson, Book } from '../types/models';

interface LessonHeaderProps {
  lesson: Lesson;
  book: Book | null;
}

const LessonHeader: React.FC<LessonHeaderProps> = React.memo(({ lesson, book }) => {
  return (
    <MKBox 
      variant="gradient"
      bgColor="secondary"
      borderRadius="lg"
      shadow="lg"
      color="white"
      p={{ xs: 3, md: 4 }}
      mb={4}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <MKTypography 
        variant="h3" 
        fontWeight="bold"
      >
        {lesson.title}
      </MKTypography>
      {book && (
        <MKTypography 
          variant="h6" 
          opacity={0.8}
        >
          {book.title}
        </MKTypography>
      )}
    </MKBox>
  );
});

export default LessonHeader;
