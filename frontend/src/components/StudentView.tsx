import { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { QuizPlayer } from './QuizPlayer';
import { StatusIcon } from './StatusIcon';
import { Course, Module, Lesson, Block, Quiz, QuizAttempt } from '../types';
import { mockCourses, mockQuizzes } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import apiClient from '../lib/api';

interface StudentViewProps {
  courseId: string;
  onBack: () => void;
}

export function StudentView({ courseId, onBack }: StudentViewProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const courseData = await apiClient.getCourse(courseId);
        setCourse(courseData);
        
        // Auto-select first available lesson
        if (courseData.modules && courseData.modules.length > 0 && courseData.modules[0].lessons && courseData.modules[0].lessons.length > 0) {
          setSelectedLesson(courseData.modules[0].lessons[0]);
        }
        
        // Automatically mark course as started when opened
        try {
          await apiClient.markAsStarted(courseId);
        } catch (error) {
          console.error('Failed to mark course as started:', error);
        }

        // Load completed lessons
        try {
          const completedLessonsData = await apiClient.getCompletedLessons(courseId);
          const completedLessonIds = new Set(completedLessonsData.map(item => item.lessonId));
          setCompletedLessons(completedLessonIds);
        } catch (error) {
          console.error('Failed to load completed lessons:', error);
        }
      } catch (error) {
        console.error('Error loading course:', error);
        setError('Не удалось загрузить курс');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleQuizStart = (quizId: string) => {
    const quiz = mockQuizzes.find(q => q.id === quizId);
    if (quiz) {
      setActiveQuiz(quiz);
    }
  };

  const handleQuizComplete = (attempt: QuizAttempt) => {
    setQuizAttempts(prev => [...prev, attempt]);
    setActiveQuiz(null);
    
    // Mark lesson as completed if quiz passed
    if (attempt.status === 'passed' && selectedLesson) {
      handleLessonComplete(selectedLesson.id);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    try {
      // Update local state immediately
      setCompletedLessons(prev => new Set([...prev, lessonId]));
      
      // Save to backend
      await apiClient.markLessonComplete(lessonId, courseId);
      
      // Check if module is completed after this lesson
      checkModuleCompletion(lessonId);
    } catch (error) {
      console.error('Failed to mark lesson as completed:', error);
      // Revert local state on error
      setCompletedLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(lessonId);
        return newSet;
      });
    }
  };

  const checkModuleCompletion = (newlyCompletedLessonId: string) => {
    if (!course) return;

    // Get updated completed lessons set (including the newly completed one)
    const updatedCompletedLessons = new Set([...completedLessons, newlyCompletedLessonId]);

    // Check each module for completion
    course.modules.forEach(module => {
      const moduleLessonIds = module.lessons.map(lesson => lesson.id);
      const isModuleCompleted = moduleLessonIds.every(lessonId => 
        updatedCompletedLessons.has(lessonId)
      );

      if (isModuleCompleted && moduleLessonIds.length > 0) {
        // Module is completed, check if course is completed
        const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
        const isCourseCompleted = allLessonIds.every(lessonId => 
          updatedCompletedLessons.has(lessonId)
        );

        // Update course progress
        updateCourseProgress(isCourseCompleted);
      }
    });
  };

  const updateCourseProgress = async (isCompleted: boolean) => {
    try {
      // This will be handled by the backend when we call getCourseProgress
      // The backend automatically calculates completion based on lesson progress
      await apiClient.getCourseProgress(courseId);
    } catch (error) {
      console.error('Failed to update course progress:', error);
    }
  };

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return (
          <h3 className="text-xl text-gray-900 mb-4">
            {block.content.text}
          </h3>
        );

      case 'text':
        return (
          <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">
            {block.content.text}
          </p>
        );

      case 'image':
        return (
          <div className="mb-6">
            {block.content.src ? (
              <ImageWithFallback 
                src={block.content.src} 
                alt={block.content.alt || 'Изображение'}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Изображение не загружено</span>
              </div>
            )}
            {block.content.caption && (
              <p className="text-sm text-gray-500 text-center mt-2">{block.content.caption}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="mb-6">
            {block.content.src ? (
              <video 
                controls 
                className="w-full rounded-lg"
                poster={block.content.poster}
              >
                <source src={block.content.src} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <Play className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="mb-6">
            {block.content.src ? (
              <audio controls className="w-full">
                <source src={block.content.src} type="audio/mp3" />
              </audio>
            ) : (
              <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Аудио не загружено</span>
              </div>
            )}
          </div>
        );

      case 'quiz':
        const quiz = mockQuizzes.find(q => q.id === block.content.quizId);
        if (!quiz) return null;

        const lastAttempt = quizAttempts
          .filter(a => a.quizId === quiz.id)
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

        return (
          <Card className="mb-6 border-primary/20 bg-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg text-foreground mb-2">{quiz.title}</h4>
                  {quiz.description && (
                    <p className="text-muted-foreground mb-3">{quiz.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Вопросов: {quiz.questions.length}</span>
                    <span>Проходной балл: {quiz.settings.passingScore}%</span>
                    {quiz.settings.timeLimit && (
                      <span>Время: {quiz.settings.timeLimit} мин</span>
                    )}
                  </div>
                </div>
                {lastAttempt?.status === 'passed' && (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                )}
              </div>

              {lastAttempt && (
                <div className="mb-4 p-3 bg-card rounded border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Последняя попытка:</span>
                    <span className={`text-sm ${
                      lastAttempt.status === 'passed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {lastAttempt.percentage}% ({lastAttempt.status === 'passed' ? 'Пройден' : 'Не пройден'})
                    </span>
                  </div>
                  <Progress value={lastAttempt.percentage} className="mt-2" />
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleQuizStart(quiz.id)}
                  disabled={lastAttempt?.status === 'passed' && quiz.settings.maxAttempts === 1}
                >
                  {lastAttempt ? 'Повторить попытку' : 'Начать квиз'}
                </Button>
                {lastAttempt && (
                  <Button variant="outline" size="sm">
                    Посмотреть результаты
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Загрузка курса...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Курс не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Course Navigation */}
      <div className="w-72 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-sm text-foreground truncate">{course.title}</h2>
              <div className="text-xs text-muted-foreground">Режим обучения</div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Прогресс курса</span>
              <span>{Math.round(completedLessons.size / (course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 1) * 100)}%</span>
            </div>
            <Progress 
              value={completedLessons.size / (course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 1) * 100} 
            />
          </div>
        </div>

        {/* Modules and Lessons */}
        <div className="flex-1 overflow-y-auto">
          {(course.modules || []).map((module) => (
            <div key={module.id}>
              <div className="px-4 py-3 bg-muted border-b">
                <h3 className="text-sm text-foreground">{module.title}</h3>
              </div>
              <div>
                {(module.lessons || []).map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b transition-all duration-200 ${
                      selectedLesson?.id === lesson.id 
                        ? 'bg-primary/10 border-r-4 border-r-primary shadow-sm' 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {completedLessons.has(lesson.id) ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-border rounded-full"></div>
                      )}
                      <span className={`text-sm truncate ${
                        selectedLesson?.id === lesson.id 
                          ? 'text-primary font-medium' 
                          : 'text-foreground'
                      }`}>{lesson.title}</span>
                    </div>
                    <StatusIcon status={lesson.status} className="text-xs" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedLesson ? (
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-2xl text-foreground mb-2">{selectedLesson.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <StatusIcon status={selectedLesson.status} />
                <span>{selectedLesson.status}</span>
                {completedLessons.has(selectedLesson.id) && (
                  <>
                    <span>•</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Урок пройден</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {selectedLesson.blocks.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg text-gray-900 mb-2">Урок пуст</h3>
                  <p className="text-gray-500">Содержимое урока ещё не добавлено</p>
                </div>
              ) : (
                selectedLesson.blocks
                  .sort((a, b) => a.order - b.order)
                  .map((block) => (
                    <div key={block.id}>
                      {renderBlock(block)}
                    </div>
                  ))
              )}
            </div>

            {/* Lesson completion */}
            {selectedLesson.blocks.length > 0 && !completedLessons.has(selectedLesson.id) && (
              <div className="mt-8 pt-6 border-t">
                <Button 
                  onClick={() => handleLessonComplete(selectedLesson.id)}
                  className="w-full"
                >
                  Завершить урок
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg text-gray-900 mb-2">Выберите урок для изучения</h3>
              <p className="text-gray-500">Выберите урок из списка слева</p>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Player */}
      {activeQuiz && (
        <QuizPlayer
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}