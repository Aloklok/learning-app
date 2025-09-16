// src/components/ArticleList.tsx (CLEANED)

import React from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { renderFurigana } from '../utils/furigana';
import type { ArticleItem } from '../types/models';

interface ArticleListProps {
  articles: ArticleItem[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return <Typography>暂无内容</Typography>;
  }

  return (
    <List disablePadding>
      {articles.map((item) => (
        <ListItem key={item.id} disableGutters sx={{ mb: 2 }}>
          <Paper variant="outlined" sx={{ p: 2.5, width: '100%', borderRadius: '16px' }}>
            <ListItemText
              primary={
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {item.title}
                </Typography>
              }
              secondaryTypographyProps={{ component: 'div' }} 
              secondary={
                <React.Fragment>
                  <Typography variant="body1" component="p" sx={{ whiteSpace: 'pre-wrap', lineHeight: 2.5 }}>
                    {renderFurigana(item.content_jp)}
                  </Typography>
                  {item.content_cn && (
                    <Typography variant="body2" component="p" color="text.secondary" sx={{ mt: 1.5, whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
                      {item.content_cn}
                    </Typography>
                  )}
                </React.Fragment>
              }
            />
          </Paper>
        </ListItem>
      ))}
    </List>
  );
};

export default ArticleList;
