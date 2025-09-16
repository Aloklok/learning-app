import React from 'react';
import { Grid, Card, Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useThemeMode } from '../../hooks/useThemeMode';

// Material Kit 2 提供的预制高级组件
import DefaultCounterCard from '@mk_examples/Cards/CounterCards/DefaultCounterCard';
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';

// Icons
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

// Types
import type { DashboardStats } from '../../types/models';

interface StatsCardsProps {
  stats: DashboardStats;
  variants: Variants;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, variants }) => {
  const { isDarkMode } = useThemeMode();
  const cardData = [
    {
      icon: <AutoStoriesIcon />,
      count: stats.vocabStats.mastered,
      total: stats.vocabStats.total,
      title: "已掌握单词",
      description: "个单词",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      iconBg: "rgba(102, 126, 234, 0.1)"
    },
    {
      icon: <AccessTimeFilledIcon />,
      count: stats.grammarStats.mastered,
      total: stats.grammarStats.total,
      title: "已掌握语法",
      description: "个语法点",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      iconBg: "rgba(240, 147, 251, 0.1)"
    },
    {
      icon: <CheckCircleIcon />,
      count: stats.completedLessons,
      total: null,
      title: "已完成课程",
      description: "课程",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      iconBg: "rgba(79, 172, 254, 0.1)"
    }
  ];

  return (
    <Grid container spacing={4} sx={{ mb: 6 }}>
      {cardData.map((card, index) => (
        <Grid size={{ xs: 12, md: 4 }} key={index}>
          <motion.div variants={variants}>
            <Card 
              sx={{ 
                height: '100%',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)'
                  : 'white',
                borderRadius: 4,
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0,0,0,0.4)'
                  : '0 8px 32px rgba(0,0,0,0.1)',
                border: isDarkMode 
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: isDarkMode 
                    ? '0 20px 40px rgba(0,0,0,0.6)'
                    : '0 20px 40px rgba(0,0,0,0.15)',
                }
              }}
            >
              <MKBox p={4} height="100%" display="flex" flexDirection="column">
                {/* Icon with gradient background */}
                <MKBox 
                  mb={3} 
                  display="flex" 
                  justifyContent="center"
                >
                  <MKBox
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: card.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: card.gradient,
                        opacity: 0.1,
                        zIndex: 0
                      }
                    }}
                  >
                    <Box sx={{ fontSize: 36, color: 'primary.main', zIndex: 1 }}>
                      {card.icon}
                    </Box>
                  </MKBox>
                </MKBox>

                {/* Count with animation */}
                <MKBox textAlign="center" mb={2}>
                  <MKTypography 
                    variant="h2" 
                    fontWeight="bold"
                    sx={{
                      background: card.gradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2.5rem', md: '3rem' }
                    }}
                  >
                    <DefaultCounterCard
                      count={card.count}
                      duration={2}
                    />
                  </MKTypography>
                  {card.total && (
                    <MKTypography 
                      variant="h6" 
                      color="text.secondary"
                      sx={{ opacity: 0.7 }}
                    >
                      / {card.total}
                    </MKTypography>
                  )}
                </MKBox>

                {/* Title and description */}
                <MKBox textAlign="center" mt="auto">
                  <MKTypography 
                    variant="h5" 
                    fontWeight="bold" 
                    color="text.primary" 
                    mb={1}
                  >
                    {card.title}
                  </MKTypography>
                  <MKTypography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ opacity: 0.8 }}
                  >
                    {card.description}
                  </MKTypography>
                </MKBox>
              </MKBox>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;