// src/components/ErrorBoundary.tsx (Enhanced)

import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Card, CardContent, Collapse, IconButton, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
  retryCount: number;
}

// 错误显示组件（使用hooks）
const ErrorDisplay: React.FC<{
  error?: Error;
  errorInfo?: ErrorInfo;
  onRetry: () => void;
  onReload: () => void;
  retryCount: number;
  title?: string;
}> = ({ error, errorInfo, onRetry, onReload, retryCount, title }) => {
  // 移除useThemeMode依赖，使用系统主题检测
  const [isDarkMode] = React.useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [showDetails, setShowDetails] = React.useState(false);

  const errorMessage = retryCount > 2 
    ? "应用遇到了持续性错误，建议刷新页面或重启应用。"
    : "抱歉，应用遇到了意外错误。您可以尝试重试或刷新页面。";

  return (
        <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        p: 3,
        background: isDarkMode
          ? 'linear-gradient(135deg, #1e1e24 0%, #121218 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        '::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDarkMode ? '242424' : 'f8f9fa'}' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDarkMode ? '242424' : 'f8f9fa'}' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: -1,
          opacity: 0.05
        }
      }}
    >
      <Card sx={{ 
        maxWidth: 600, 
        textAlign: 'center',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
      }}>
        <CardContent>
          <ErrorOutlineIcon sx={{ 
            fontSize: 64, 
            color: isDarkMode ? '#fc8181' : '#e53e3e', 
            mb: 2 
          }} />
          
          <Typography variant="h5" color={isDarkMode ? 'white' : 'dark'} mb={2}>
            {title || '糟糕！出错了'}
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            {errorMessage}
          </Typography>

          {error && (
            <Typography variant="body2" color="warning.main" mb={2}>
              错误信息: {error.message}
            </Typography>
          )}          {/* 错误详情展开 */}
          {(import.meta.env.DEV || showDetails) && error && (
            <Box>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <Typography variant="body2" color="text.secondary" mr={1}>
                  错误详情
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setShowDetails(!showDetails)}
                  sx={{ color: isDarkMode ? '#a0aec0' : '#718096' }}
                >
                  {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={showDetails}>
                <Box 
                  mt={2} 
                  p={2} 
                  bgcolor={isDarkMode ? 'rgba(255,255,255,0.05)' : 'grey.100'} 
                  borderRadius={1}
                  textAlign="left"
                >
                  <Typography variant="caption" component="pre" sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    color: isDarkMode ? '#e2e8f0' : '#2d3748'
                  }}>
                    {error.toString()}
                    {errorInfo && '\n\nComponent Stack:'}
                    {errorInfo?.componentStack}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          )}

          <Box mt={3} display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              onClick={onRetry}
              sx={{ mr: 2 }}
            >
              重试
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={onReload}
            >
              刷新页面
            </Button>

            {import.meta.env.DEV && (
              <Button
                variant="text"
                size="small"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '隐藏' : '显示'}详情
              </Button>
            )}
          </Box>

          {/* 错误报告提示 */}
          <Box mt={3} p={2} bgcolor={isDarkMode ? 'rgba(255,255,255,0.02)' : 'grey.50'} borderRadius={1}>
            <Typography variant="caption" color="text.secondary">
              如果问题持续出现，请截图此页面并联系技术支持
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      showDetails: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 记录错误信息
    this.setState({ error, errorInfo });
    
    // 调用外部错误处理器
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 发送错误报告（在生产环境中）
    if (!import.meta.env.DEV) {
      this.reportError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }
  }

  // 错误报告方法
  reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // 这里可以集成错误报告服务，如 Sentry
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.log('Error Report:', errorReport);
      // 实际项目中可以发送到错误监控服务
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));

    // 如果重试次数过多，延迟重试
    if (this.state.retryCount > 2) {
      this.retryTimeoutId = window.setTimeout(() => {
        // 强制重新渲染
        this.forceUpdate();
      }, 1000);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          retryCount={this.state.retryCount}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;