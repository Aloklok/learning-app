// src/components/ErrorBoundary.tsx (Enhanced)

import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Card, CardContent, Collapse, IconButton } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';
import MKButton from '@mk_components/MKButton';

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
}> = ({ error, errorInfo, onRetry, onReload, retryCount }) => {
  // 移除useThemeMode依赖，使用系统主题检测
  const [isDarkMode] = React.useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [showDetails, setShowDetails] = React.useState(false);

  const getErrorMessage = () => {
    if (retryCount > 2) {
      return "应用遇到了持续性错误，建议刷新页面或重启应用。";
    }
    return "抱歉，应用遇到了意外错误。您可以尝试重试或刷新页面。";
  };

  return (
    <MKBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
      p={3}
      sx={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
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
          
          <MKTypography variant="h5" color={isDarkMode ? 'white' : 'dark'} mb={2}>
            出现了一个错误
          </MKTypography>
          
          <MKTypography variant="body1" color="text.secondary" mb={3}>
            {getErrorMessage()}
          </MKTypography>

          {retryCount > 0 && (
            <MKTypography variant="body2" color="warning.main" mb={2}>
              已重试 {retryCount} 次
            </MKTypography>
          )}

          {/* 错误详情展开 */}
          {(import.meta.env.DEV || showDetails) && error && (
            <Box>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <MKTypography variant="body2" color="text.secondary" mr={1}>
                  错误详情
                </MKTypography>
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
                  <MKTypography variant="caption" component="pre" sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    color: isDarkMode ? '#e2e8f0' : '#2d3748'
                  }}>
                    {error.toString()}
                    {errorInfo && '\n\nComponent Stack:'}
                    {errorInfo?.componentStack}
                  </MKTypography>
                </Box>
              </Collapse>
            </Box>
          )}

          <Box mt={3} display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <MKButton
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              disabled={retryCount > 5}
            >
              {retryCount > 2 ? '强制重试' : '重试'}
            </MKButton>
            
            <MKButton
              variant="outlined"
              color="secondary"
              startIcon={<BugReportIcon />}
              onClick={onReload}
            >
              刷新页面
            </MKButton>

            {import.meta.env.DEV && (
              <MKButton
                variant="text"
                size="small"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '隐藏' : '显示'}详情
              </MKButton>
            )}
          </Box>

          {/* 错误报告提示 */}
          <Box mt={3} p={2} bgcolor={isDarkMode ? 'rgba(255,255,255,0.02)' : 'grey.50'} borderRadius={1}>
            <MKTypography variant="caption" color="text.secondary">
              如果问题持续出现，请截图此页面并联系技术支持
            </MKTypography>
          </Box>
        </CardContent>
      </Card>
    </MKBox>
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