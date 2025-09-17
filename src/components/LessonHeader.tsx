// src/components/LessonHeader.tsx

import React from 'react';

import { Box, Typography } from '@mui/material';
import type { Lesson, Book } from '../types/models';

interface LessonHeaderProps {
  lesson: Lesson;
  book: Book | null;
}

const LessonHeader: React.FC<LessonHeaderProps> = React.memo(({ lesson, book }) => {
  return (
    <Box 
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        color: 'white',
        p: { xs: 3, md: 4 },
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Typography 
        variant="h3" 
        fontWeight="bold"
      >
        {lesson.title}
      </Typography>
      {book && (
        <Typography 
          variant="h6" 
          sx={{ opacity: 0.8 }}
        >
          {book.title}
        </Typography>
      )}
    </Box>
  );
});

export default LessonHeader;
