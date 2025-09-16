
import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

// Theme Context
import { useThemeMode } from '../hooks/useThemeMode';

// Material Kit Components
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';

// Custom Hooks & Store
import { useDashboardStore } from '../store/dashboardStore';

// New Dashboard Components
import HeaderCard from './Dashboard/HeaderCard';
import StatsCards from './Dashboard/StatsCards';
import JLPTProgressCard from './Dashboard/JLPTProgressCard';
import CourseContent from './Dashboard/CourseContent';

// --- Main Component ---

const DashboardPage: React.FC = () => {
  const { stats, loading: statsLoading, fetchStats } = useDashboardStore();
  const { isDarkMode } = useThemeMode();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (statsLoading) {
    return (
      <MKBox 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="calc(100vh - 90px)"
        sx={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <CircularProgress />
      </MKBox>
    );
  }

  if (!stats) {
    return <MKTypography sx={{ textAlign: 'center', mt: 4 }}>无法加载统计数据。</MKTypography>;
  }

  return (
    <MKBox 
      p={{ xs: 2, md: 4 }}
      sx={{
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        
        {/* === 1. Top Header Card === */}
        <MKBox mb={6}>
          <HeaderCard stats={stats} variants={itemVariants} />
        </MKBox>

        {/* === 2. Stats Info Cards === */}
        <StatsCards stats={stats} variants={itemVariants} />

        {/* === 3. JLPT Progress Card === */}
        <MKBox mb={6}>
          <JLPTProgressCard progressByLevel={stats.progressByLevel} variants={itemVariants} />
        </MKBox>

      </motion.div>

      {/* === 4. Main Course Content Area === */}
      <CourseContent />
      
    </MKBox>
  );
};

export default DashboardPage;
