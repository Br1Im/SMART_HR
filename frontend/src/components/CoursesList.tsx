import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Copy, Trash2, BookOpen, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { StatusIcon } from './StatusIcon';
import { EmptyState } from './EmptyState';
import { Course } from '../types';
import { Header } from './layout/Header';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import apiClient from '../lib/api';

interface CoursesListProps {
  onCourseSelect: (courseId: string) => void;
  onCreateCourse: () => void;
  darkMode?: boolean;
  toggleTheme?: () => void;
}

type ViewMode = 'grid' | 'list';

export function CoursesList({ onCourseSelect, onCreateCourse, darkMode, toggleTheme }: CoursesListProps) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | 'hidden' | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);

  // Загрузка курсов из API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await apiClient.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Ошибка при загрузке курсов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Load view mode from localStorage on component mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('coursesViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('coursesViewMode', viewMode);
  }, [viewMode]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (course.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (course.isPublished ? 'published' : 'draft') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);
  
  // Анимация для контейнера и карточек
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: (custom: number) => ({ 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: custom * 0.15
      }
    })
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title_1="SMART"
        title_2="HR"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateItem={onCreateCourse}
        createButtonText="Создать курс"
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredCourses.length === 0 ? (
          searchTerm || statusFilter !== 'all' ? (
            <EmptyState
              title="Курсы не найдены"
              description="Попробуйте изменить параметры поиска или фильтры"
            />
          ) : (
            <EmptyState
              title="Пока нет курсов"
              description="Создайте свой первый курс, чтобы начать обучение сотрудников"
              action={{
                label: "Создать первый курс",
                onClick: onCreateCourse
              }}
            />
          )
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              // Grid View
              <motion.div 
                key="grid-view"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
              {filteredCourses.map((course, index) => (
                <motion.div 
                  key={course.id} 
                  variants={cardVariants}
                  custom={index}
                >
                  <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full bg-card rounded-xl border border-border backdrop-blur-sm">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2 w-full">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg backdrop-blur-sm">
                              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            </div>
                            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200 leading-normal break-words !leading-normal">
                              {course.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-sm text-muted-foreground leading-relaxed break-words">{course.description || 'Описание отсутствует'}</CardDescription>
                        </div>
                        <StatusIcon status={course.isPublished ? 'published' : 'draft'} className="ml-2 text-lg flex-shrink-0 p-1 bg-muted rounded-full" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between p-4 pt-2 h-full">
                      <div className="flex-1"></div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 bg-muted rounded-lg px-3 py-2 backdrop-blur-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          Обновлён: {new Date(course.updatedAt).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {course.blocks?.length || 0} блоков
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                          onClick={() => onCourseSelect(course.id)}
                        >
                          <Eye className="w-3 h-3 mr-1.5" />
                          Открыть
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => navigate(`/editor/${course.id}`)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-colors duration-200">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              </motion.div>
            ) : (
              // List View
              <motion.div 
                key="list-view"
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
              {filteredCourses.map((course, index) => (
                <motion.div 
                  key={course.id} 
                  variants={cardVariants}
                  custom={index}
                >
                  <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group h-[100px] bg-card rounded-xl border border-border backdrop-blur-sm">
                    <CardContent className="p-4 h-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg backdrop-blur-sm">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200 truncate">
                                {course.title}
                              </h3>
                              <StatusIcon status={course.isPublished ? 'published' : 'draft'} className="text-sm flex-shrink-0 p-1 bg-muted rounded-full" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed break-words mb-2">{course.description || 'Описание отсутствует'}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                Обновлён: {new Date(course.updatedAt).toLocaleDateString('ru-RU')}
                              </span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {course.blocks?.length || 0} блоков
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                            onClick={() => onCourseSelect(course.id)}
                          >
                            <Eye className="w-3 h-3 mr-1.5" />
                            Открыть
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => navigate(`/editor/${course.id}`)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-300 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-colors duration-200">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>


    </div>
  );
}