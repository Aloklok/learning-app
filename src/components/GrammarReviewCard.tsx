// src/components/GrammarReviewCard.tsx (V-Final-Native - 原生MUI终极版)

import React, { memo, useCallback } from 'react';
import { Box, Typography, Card, CardContent, Rating } from '@mui/material';
import { motion } from 'framer-motion';

interface GrammarReviewCardProps {
  id: number;
  title: string;
  explanation: string;
  mastery_level: number;
  onMasteryChange: (grammarId: number, newLevel: number) => void;
}

const GrammarReviewCard: React.FC<GrammarReviewCardProps> = memo((props) => {
  const { id, title, explanation, mastery_level, onMasteryChange } = props;

  const handleRatingChange = useCallback((_event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      onMasteryChange(id, newValue - 1);
    }
  }, [id, onMasteryChange]);

  return (
    <motion.div whileHover={{ scale: 1.03, y: -5 }} style={{ width: '100%' }}>
      <Card 
        sx={{ 
          width: '100%',
          borderRadius: 2,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 2, minHeight: '40px' }}>
            {explanation}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Rating
              name={`grammar-rating-${id}`}
              value={mastery_level + 1}
              max={3}
              onChange={handleRatingChange}
              size="large"
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default GrammarReviewCard;