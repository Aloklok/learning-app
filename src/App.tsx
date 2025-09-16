// src/App.tsx (V-Final-Correct-Routing)

import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';

// 导入布局和页面
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage'; // DashboardPage 现在就是学习页
import LibraryPage from './pages/LibraryPage';
import LessonListPage from './pages/LessonListPage';
import SmartReviewPage from './pages/SmartReviewPage';
import ErrorBoundary from './components/ErrorBoundary';
import PureCoursePage from './pages/PureCoursePage';
import ReviewPage from './pages/ReviewPage';

function App() {
  useEffect(() => {
    window.postMessage({ payload: 'removeLoading' }, '*');
  }, []);
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              {/* 核心修改：根路径直接指向 DashboardPage */}
              <Route path="/" element={<DashboardPage />} />
              
              {/* 为了让课程内导航能更新URL，我们增加一个带参数的路由，它也渲染同一个组件 */}
              <Route path="/learn/:lessonId" element={<DashboardPage />} />
              <Route path="/course/:lessonId" element={<DashboardPage />} />

              <Route path="/review" element={<ReviewPage />} />
              <Route path="/smart-review" element={<SmartReviewPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/book/:bookId/lessons" element={<LessonListPage />} />
            </Route>
            
            {/* 纯课程内容页面，不使用MainLayout */}
            <Route path="/pure-course/:lessonId" element={<PureCoursePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;