import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Copy, Trash2, BookOpen, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { StatusIcon } from './StatusIcon';
import { EmptyState } from './EmptyState';
import { Course } from '../types';
import { Header } from './layout/Header';
import { CourseCard } from './courses/CourseCard';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import apiClient from '../lib/api';
import { useRoleCheck } from './ProtectedRoute';

interface CoursesListProps {
  onCourseSelect: (courseId: string) => void;
  onCreateCourse: () => void;
  darkMode?: boolean;
  toggleTheme?: () => void;
}

type ViewMode = 'grid' | 'list';

export function CoursesList({ onCourseSelect, onCreateCourse, darkMode, toggleTheme }: CoursesListProps) {
  const navigate = useNavigate();
  const { isAdmin, isCurator } = useRoleCheck();
  const canCreateCourse = isAdmin() || isCurator();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | 'hidden' | 'all'>('all');
  const [userFilter, setUserFilter] = useState<'all' | 'favorites' | 'started'>('all');
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

  // Функция для обновления статуса избранного курса
  const handleFavoriteChange = (courseId: string, isFavorite: boolean) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, isFavorite }
          : course
      )
    );
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (course.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (course.status === statusFilter);
      
      let matchesUserFilter = true;
      if (userFilter === 'favorites') {
        matchesUserFilter = course.isFavorite === true;
      } else if (userFilter === 'started') {
        matchesUserFilter = course.isStarted === true;
      }
      
      return matchesSearch && matchesStatus && matchesUserFilter;
    });
  }, [courses, searchTerm, statusFilter, userFilter]);
  
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
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateItem={canCreateCourse ? onCreateCourse : undefined}
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
              description={canCreateCourse ? "Создайте свой первый курс, чтобы начать обучение сотрудников" : "Курсы пока не созданы"}
              action={canCreateCourse ? {
                label: "Создать первый курс",
                onClick: onCreateCourse
              } : undefined}
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
                  <CourseCard
                    course={course}
                    viewMode="grid"
                    onSelect={onCourseSelect}
                    onFavoriteChange={handleFavoriteChange}
                  />
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
                  <CourseCard
                    course={course}
                    viewMode="list"
                    onSelect={onCourseSelect}
                    onFavoriteChange={handleFavoriteChange}
                  />
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