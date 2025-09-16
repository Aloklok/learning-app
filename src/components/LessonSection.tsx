// src/components/LessonSection.tsx

import React from 'react';
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';

interface LessonSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const LessonSection: React.FC<LessonSectionProps> = React.memo(({ title, icon, children }) => (
  <MKBox
    bgColor="white"
    borderRadius="xl"
    shadow="md"
    p={3}
    mb={3}
  >
    <MKTypography variant="h5" fontWeight="bold" mb={2}>{icon} {title}</MKTypography>
    {children}
  </MKBox>
));

export default LessonSection;
