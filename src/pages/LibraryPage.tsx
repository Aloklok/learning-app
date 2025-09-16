import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDbOperations } from '../hooks/useDbOperations'; // Import the new hook

// Theme Context
import { useThemeMode } from '../hooks/useThemeMode';

// Material Kit Components
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';
import MKButton from '@mk_components/MKButton';

// Material Kit Examples
// 移除未使用的导入

// Icons
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';

interface Book {
  id: number;
  title: string;
  description?: string;
}

const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const { isDarkMode } = useThemeMode();
  const { getAllBooks, importBook } = useDbOperations(); // Use the new hook

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
    if (hasFetched.current) {
      return;
    }
    
    const fetchBooks = async () => {
      try {
        const fetchedBooks: Book[] = await getAllBooks();
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setImportStatus({ success: false, message: `加载教材失败: ${error instanceof Error ? error.message : String(error)}` });
      }
    };

    fetchBooks();
    hasFetched.current = true;
  }, [getAllBooks]);

  const handleImportTextbook = async () => {
    try {
      const lessonData = (await import('../../lesson.json')).default;
      const result = await importBook(lessonData);
      if (result.success) {
        setImportStatus({ success: true, message: result.message || '教材导入成功！' });
        hasFetched.current = false;
        window.location.reload();
      } else {
        setImportStatus({ success: false, message: result.message || '教材导入失败。' });
      }
    } catch (error) {
      console.error("Error importing textbook:", error);
      setImportStatus({ success: false, message: `教材导入失败: ${error instanceof Error ? error.message : String(error)}` });
    }
  };

  const handleViewLessons = (bookId: number) => {
    navigate(`/book/${bookId}/lessons`);
  };

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
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <MKBox 
            variant="gradient" 
            bgColor="info" 
            borderRadius="lg" 
            shadow="lg" 
            p={4} 
            mb={6}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #4a5568 0%, #553c7b 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <MKBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <MKBox>
                <MKTypography variant="h2" color="white" fontWeight="bold" mb={1}>
                  我的教材库 📚
                </MKTypography>
                <MKTypography variant="h6" color="rgba(255,255,255,0.8)">
                  管理你的学习教材，开始新的学习之旅
                </MKTypography>
              </MKBox>
              <MKButton
                variant="contained"
                color="white"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleImportTextbook}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                导入新教材
              </MKButton>
            </MKBox>
          </MKBox>
        </motion.div>

        {/* Status Alert */}
        {importStatus && (
          <motion.div variants={itemVariants}>
            <MKBox
              p={3}
              borderRadius="lg"
              mb={4}
              sx={{
                background: importStatus.success 
                  ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                  : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
              }}
            >
              <MKTypography variant="body1" color="white" fontWeight="medium">
                {importStatus.message}
              </MKTypography>
            </MKBox>
          </motion.div>
        )}

        {/* Books Grid */}
        <motion.div variants={itemVariants}>
          {books.length === 0 ? (
            <MKBox
              textAlign="center"
              p={6}
              borderRadius="lg"
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #242429 0%, #2a2a30 100%)'
                  : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                border: isDarkMode
                  ? '2px dashed rgba(255,255,255,0.1)'
                  : '2px dashed rgba(0,0,0,0.1)',
              }}
            >
              <BookIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <MKTypography variant="h5" color="text.secondary" mb={2}>
                还没有教材
              </MKTypography>
              <MKTypography variant="body1" color="text.secondary">
                点击上方按钮导入你的第一本教材，开始学习之旅！
              </MKTypography>
            </MKBox>
          ) : (
            <MKBox 
              display="grid" 
              gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
              gap={4}
            >
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MKBox
                    variant="gradient"
                    bgColor="white"
                    borderRadius="xl"
                    shadow="lg"
                    p={4}
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    sx={{
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #242429 0%, #2a2a30 100%)'
                        : 'white',
                      border: isDarkMode
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid rgba(0,0,0,0.05)',
                      '&:hover': {
                        boxShadow: isDarkMode
                          ? '0 20px 40px rgba(0,0,0,0.3)'
                          : '0 20px 40px rgba(0,0,0,0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                      {/* Book Icon */}
                      <MKBox textAlign="center" mb={3}>
                        <MKBox
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          <LibraryBooksIcon sx={{ fontSize: 40, color: 'white' }} />
                        </MKBox>
                      </MKBox>

                      {/* Book Info */}
                      <MKBox flexGrow={1} textAlign="center">
                        <MKTypography variant="h5" fontWeight="bold" color="text.primary" mb={1}>
                          {book.title}
                        </MKTypography>
                        {book.description && (
                          <MKTypography variant="body2" color="text.secondary" mb={3}>
                            {book.description}
                          </MKTypography>
                        )}
                      </MKBox>

                      {/* Action Buttons */}
                      <MKBox display="flex" gap={1} justifyContent="center">
                        <MKButton
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewLessons(book.id)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          查看课程
                        </MKButton>
                        <MKButton
                          variant="outlined"
                          color="info"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#5a6fd8',
                              backgroundColor: 'rgba(102, 126, 234, 0.04)',
                            },
                          }}
                        >
                          编辑
                        </MKButton>
                      </MKBox>
                    </MKBox>
                </motion.div>
              ))}
            </MKBox>
          )}
        </motion.div>
      </motion.div>
    </MKBox>
  );
};

export default LibraryPage;