import React from 'react';
import { Card, CardContent, Typography, Button, Paper, Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { designSystem } from '../designSystem';

// 学习卡片组件变体
interface LearningCardProps {
  children: React.ReactNode;
  variant?: 'word' | 'lesson' | 'grammar' | 'article';
  onClick?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  elevation?: number;
  sx?: SxProps<Theme>;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  children,
  variant = 'word',
  onClick,
  onContextMenu,
  elevation = 0,
  sx
}) => {
  // 根据变体设置不同的最小高度
  const getMinHeight = () => {
    switch (variant) {
      case 'word':
        return designSystem.learningApp.cardSizes.wordCard.minHeight;
      case 'lesson':
        return designSystem.learningApp.cardSizes.lessonCard.minHeight;
      case 'grammar':
        return '200px';
      case 'article':
        return '150px';
      default:
        return 'auto';
    }
  };

  return (
    <Card
      onClick={onClick}
      onContextMenu={onContextMenu}
      elevation={elevation}
      sx={{
        minHeight: getMinHeight(),
        maxWidth: variant === 'word' ? designSystem.learningApp.cardSizes.wordCard.maxWidth : 'none',
        ...sx
      }}
    >
      {children}
    </Card>
  );
};

// 日语文本组件变体
interface JapaneseTextProps {
  children: React.ReactNode;
  variant: 'word' | 'reading' | 'meaning';
  component?: React.ElementType;
  className?: string;
}

export const JapaneseText: React.FC<JapaneseTextProps> = ({
  children,
  variant,
  component = 'div',
  className
}) => {
  const getTypographyProps = () => {
    switch (variant) {
      case 'word':
        return {
          className: 'word-text',
          sx: {
            fontWeight: designSystem.learningApp.fontWeights.japanese.word,
            fontSize: '1.75rem',
            lineHeight: 1.3
          }
        };
      case 'reading':
        return {
          sx: {
            fontWeight: designSystem.learningApp.fontWeights.japanese.reading,
            fontSize: '0.875rem',
            opacity: 0.8
          }
        };
      case 'meaning':
        return {
          className: 'meaning-text',
          sx: {
            fontWeight: designSystem.learningApp.fontWeights.japanese.meaning,
            fontSize: '1.125rem',
            lineHeight: 1.6
          }
        };
      default:
        return {};
    }
  };

  return (
    <Typography
      component={component}
      className={className}
      {...getTypographyProps()}
    >
      {children}
    </Typography>
  );
};

// 词性标签组件
interface PartOfSpeechTagProps {
  children: React.ReactNode;
}

export const PartOfSpeechTag: React.FC<PartOfSpeechTagProps> = ({ children }) => {
  return (
    <Typography
      className="part-of-speech"
      component="div"
    >
      {children}
    </Typography>
  );
};

// 状态面板组件
interface StatusPanelProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  children,
  variant = 'default',
  padding = 'md'
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'sm':
        return 2;
      case 'md':
        return 3;
      case 'lg':
        return 4;
      default:
        return 3;
    }
  };

  const getElevation = () => {
    switch (variant) {
      case 'elevated':
        return 2;
      case 'outlined':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <Paper
      elevation={getElevation()}
      sx={{
        padding: getPadding(),
        ...(variant === 'outlined' && {
          border: theme => `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(0, 0, 0, 0.12)'
          }`
        })
      }}
    >
      {children}
    </Paper>
  );
};

// 学习进度指示器
interface MasteryIndicatorProps {
  level: number; // 0: unknown, 1: learning, 2: mastered
  size?: 'small' | 'medium' | 'large';
}

export const MasteryIndicator: React.FC<MasteryIndicatorProps> = ({
  level,
  size = 'medium'
}) => {
  const getColor = () => {
    switch (level) {
      case 0:
        return designSystem.learningApp.masteryColors.unknown;
      case 1:
        return designSystem.learningApp.masteryColors.learning;
      case 2:
        return designSystem.learningApp.masteryColors.mastered;
      default:
        return designSystem.learningApp.masteryColors.unknown;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return '8px';
      case 'medium':
        return '12px';
      case 'large':
        return '16px';
      default:
        return '12px';
    }
  };

  return (
    <Box
      sx={{
        width: getSize(),
        height: getSize(),
        borderRadius: '50%',
        backgroundColor: getColor(),
        display: 'inline-block',
        marginRight: 1
      }}
    />
  );
};

// 功能按钮组件
interface ActionButtonProps {
  children: React.ReactNode;
  actionType: 'speech' | 'copy' | 'practice';
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  actionType,
  variant = 'outlined',
  size = 'medium',
  onClick
}) => {
  const getActionColor = () => {
    switch (actionType) {
      case 'speech':
        return designSystem.learningApp.actions.speech;
      case 'copy':
        return designSystem.learningApp.actions.copy;
      case 'practice':
        return designSystem.learningApp.actions.practice;
      default:
        return designSystem.learningApp.actions.speech;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      sx={{
        color: getActionColor(),
        borderColor: variant === 'outlined' ? getActionColor() : undefined,
        backgroundColor: variant === 'contained' ? getActionColor() : undefined,
        '&:hover': {
          backgroundColor: variant === 'contained' 
            ? getActionColor() 
            : `${getActionColor()}14`, // 8% opacity
          borderColor: getActionColor()
        }
      }}
    >
      {children}
    </Button>
  );
};