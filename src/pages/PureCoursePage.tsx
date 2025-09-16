// src/pages/PureCoursePage.tsx

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PureCourseView from '../components/PureCourseView';

const PureCoursePage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();

  if (!lessonId || isNaN(Number(lessonId))) {
    return <Navigate to="/library" replace />;
  }

  return <PureCourseView lessonId={Number(lessonId)} />;
};

export default PureCoursePage;
