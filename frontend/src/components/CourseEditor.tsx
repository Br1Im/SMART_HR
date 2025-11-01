import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Link, ArrowUp, ArrowDown, Copy, Trash2, FileText, FolderOpen, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { StatusIcon } from './StatusIcon';
import { LessonEditor } from './LessonEditor';
import { SaveStatusIndicator } from './SaveStatusIndicator';
import { useAutoSaveCourse } from '../hooks/useAutoSave';


import { Course, Module, Lesson } from '../types';
import apiClient from '../lib/api';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface CourseEditorProps {
  courseId: string;
  onBack: () => void;
}

// Функция для проверки валидности ID (поддерживает UUID, CUID и простые строки)
const isValidId = (id: string): boolean => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }
  
  // UUID формат
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return true;
  }
  
  // CUID формат (начинается с 'c' и содержит буквы и цифры)
  const cuidRegex = /^c[a-z0-9]{24}$/i;
  if (cuidRegex.test(id)) {
    return true;
  }
  
  // Простые строковые ID (только буквы, цифры, дефисы, подчеркивания)
  const simpleIdRegex = /^[a-zA-Z0-9_-]+$/;
  return simpleIdRegex.test(id) && id.length >= 1 && id.length <= 50;
};

export function CourseEditor({ courseId, onBack }: CourseEditorProps) {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [creatingLessonModuleId, setCreatingLessonModuleId] = useState<string | null>(null);
  const [showCourseInfo, setShowCourseInfo] = useState(false);
  const [showBlocksPanel, setShowBlocksPanel] = useState(false);

  // Автосохранение курса
  const { saveStatus, lastSaved, forceSave, errorMessage } = useAutoSaveCourse(course);

  const goToCourseInfo = () => {
    setShowCourseInfo(true);
    setSelectedLesson(null);
  };

  // Логирование и валидация courseId
  console.log('CourseEditor courseId:', courseId, 'type:', typeof courseId, 'isValidId:', isValidId(courseId));
  console.log('CourseEditor courseId length:', courseId?.length);
  console.log('CourseEditor courseId chars:', courseId?.split('').map(c => c.charCodeAt(0)));

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const courseData = await apiClient.getCourse(courseId);
        setCourse(courseData);
        
        // Expand all modules by default
        if (courseData.modules) {
          setExpandedModules(new Set(courseData.modules?.map((m: Module) => m.id)));
          // Select first lesson if available
          if (courseData.modules.length > 0 && courseData.modules[0].lessons && courseData.modules[0].lessons.length > 0) {
            setSelectedLesson(courseData.modules[0].lessons[0]);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке курса:', error);
        setError('Не удалось загрузить курс');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const addModule = async () => {
    try {
      // Валидация courseId перед отправкой запроса
      console.log('addModule courseId:', courseId, 'isValidId:', isValidId(courseId));
      
      if (!courseId || !isValidId(courseId)) {
        throw new Error(`Некорректный courseId: ${courseId}. Должен быть валидным ID.`);
      }
      
      // Генерируем название модуля в формате "модуль_N"
      const existingModules = course?.modules || [];
      const moduleNumbers = existingModules
        .map(module => {
          const match = module.title.match(/^модуль_(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);

      const nextModuleNumber = moduleNumbers.length > 0 ? Math.max(...moduleNumbers) + 1 : 1;
      
      const newModule = {
        title: `модуль_${nextModuleNumber}`,
        description: '',
        courseId: courseId,
        position: course?.modules?.length || 0
      };
      
      const createdModule = await apiClient.createModule(newModule);
      
      if (course) {
        const updatedCourse = {
          ...course,
          modules: [...(course.modules || []), createdModule]
        };
        setCourse(updatedCourse);
        setExpandedModules(prev => new Set([...prev, createdModule.id]));
      }
    } catch (error) {
      console.error('Ошибка при создании модуля:', error);
    }
  };

  const createLesson = async (moduleId: string) => {
    try {
      // Найти модуль для определения позиции нового урока
      const module = course?.modules?.find(m => m.id === moduleId);
      if (!module) return;

      // Определить позицию для нового урока
      const lastLessonPosition = module.lessons?.length > 0 
        ? Math.max(...module.lessons.map(l => l.position || 0))
        : 0;

      // Генерируем название урока в формате "урок_N"
      const getAllLessonsInCourse = (): Lesson[] => {
        if (!course?.modules) return [];
        return course.modules.flatMap(m => m.lessons || []);
      };

      const allLessons = getAllLessonsInCourse();
      const lessonNumbers = allLessons
        .map(lesson => {
          const match = lesson.title.match(/^урок_(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);

      const nextLessonNumber = lessonNumbers.length > 0 ? Math.max(...lessonNumbers) + 1 : 1;

      const newLessonData = {
        title: `урок_${nextLessonNumber}`,
        courseId: courseId,
        type: 'LESSON',
        content: '',
        position: lastLessonPosition + 1
      };

      const createdLesson = await apiClient.createBlock(newLessonData);
      
      // Создаем объект урока в нужном формате
      const newLesson: Lesson = {
        id: createdLesson.id,
        title: createdLesson.title,
        content: createdLesson.content || '',
        moduleId: moduleId,
        position: createdLesson.position,
        status: 'draft',
        blocks: []
      };

      // Обновляем курс с новым уроком
      if (course) {
        const updatedModules = course.modules?.map(m => {
          if (m.id === moduleId) {
            return {
              ...m,
              lessons: [...(m.lessons || []), newLesson]
            };
          }
          return m;
        });

        setCourse({
          ...course,
          modules: updatedModules
        });

        // Устанавливаем новый урок как выбранный и включаем режим создания
        setSelectedLesson(newLesson);
        setIsCreatingLesson(true);
        setCreatingLessonModuleId(moduleId);
      }
    } catch (error) {
      console.error('Ошибка при создании урока:', error);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      await apiClient.deleteBlock(lessonId);
      
      // Обновляем курс, удаляя урок
      if (course) {
        const updatedModules = course.modules?.map(m => ({
          ...m,
          lessons: m.lessons?.filter(l => l.id !== lessonId)
        }));

        setCourse({
          ...course,
          modules: updatedModules
        });

        // Если удаленный урок был выбран, сбрасываем выбор
        if (selectedLesson?.id === lessonId) {
          setSelectedLesson(null);
        }
      }
    } catch (error) {
      console.error('Ошибка при удалении урока:', error);
    }
  };

  const copyLesson = async (lesson: Lesson) => {
    try {
      const newLessonData = {
        title: `${lesson.title} (копия)`,
        courseId: courseId,
        type: 'LESSON',
        content: lesson.content,
        position: (lesson.position || 0) + 1
      };

      const createdLesson = await apiClient.createBlock(newLessonData);
      
      // Создаем объект урока в нужном формате
      const newLesson: Lesson = {
        id: createdLesson.id,
        title: createdLesson.title,
        content: createdLesson.content || '',
        moduleId: lesson.moduleId,
        position: createdLesson.position,
        status: 'draft',
        blocks: [...lesson.blocks] // Копируем блоки
      };

      // Обновляем курс с новым уроком
      if (course) {
        const updatedModules = course.modules?.map(m => {
          if (m.id === lesson.moduleId) {
            return {
              ...m,
              lessons: [...(m.lessons || []), newLesson]
            };
          }
          return m;
        });

        setCourse({
          ...course,
          modules: updatedModules
        });

        // Устанавливаем новый урок как выбранный
        setSelectedLesson(newLesson);
      }
    } catch (error) {
      console.error('Ошибка при копировании урока:', error);
    }
  };

  // Функции навигации между уроками
  const getAllLessons = (): Lesson[] => {
    if (!course?.modules) return [];
    return course.modules.flatMap(m => m.lessons || []).sort((a, b) => (a.position || 0) - (b.position || 0));
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Если нет места назначения, ничего не делаем
    if (!destination) return;

    // Если урок остался в том же месте, ничего не делаем
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Находим урок, который перетаскиваем
    const draggedLesson = getAllLessons().find(lesson => lesson.id === draggableId);
    if (!draggedLesson) return;

    try {
      // Обновляем локальное состояние
      const updatedModules = course?.modules?.map(module => {
        // Удаляем урок из исходного модуля
        if (module.id === source.droppableId) {
          return {
            ...module,
            lessons: module.lessons?.filter(lesson => lesson.id !== draggableId) || []
          };
        }
        
        // Добавляем урок в целевой модуль
        if (module.id === destination.droppableId) {
          const newLessons = [...(module.lessons || [])];
          const updatedLesson = { ...draggedLesson, moduleId: module.id };
          newLessons.splice(destination.index, 0, updatedLesson);
          
          return {
            ...module,
            lessons: newLessons
          };
        }
        
        return module;
      });

      // Обновляем состояние курса
      if (course && updatedModules) {
        setCourse({
          ...course,
          modules: updatedModules
        });
      }

      // Если перемещенный урок был выбран, обновляем его moduleId
      if (selectedLesson?.id === draggableId) {
        setSelectedLesson({
          ...selectedLesson,
          moduleId: destination.droppableId
        });
      }

      // Здесь можно добавить API вызов для сохранения изменений на сервере
      // await apiClient.updateLessonModule(draggableId, destination.droppableId);
      
    } catch (error) {
      console.error('Ошибка при перемещении урока:', error);
    }
  };

  const navigateToPreviousLesson = () => {
    if (!selectedLesson) return;
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(allLessons[currentIndex - 1]);
    }
  };

  const navigateToNextLesson = () => {
    if (!selectedLesson) return;
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < allLessons.length - 1) {
      setSelectedLesson(allLessons[currentIndex + 1]);
    }
  };

  const canNavigatePrevious = () => {
    if (!selectedLesson) return false;
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex > 0;
  };

  const canNavigateNext = () => {
    if (!selectedLesson) return false;
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex < allLessons.length - 1;
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-background flex">
        {/* Left Sidebar - Course Structure */}
        <div className="w-72 bg-card border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 
                    className="text-sm text-foreground truncate cursor-pointer hover:text-primary" 
                    onClick={goToCourseInfo}
                    title="Перейти к описанию курса"
                  >
                    {course.title}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={goToCourseInfo}
                    title="Перейти к описанию курса"
                    className="h-6 w-6 p-0"
                  >
                    <Home className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={course.status} />
                    <span>{course.status}</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {course?.modules?.reduce((total, module) => 
                      total + (module.lessons?.reduce((lessonTotal, lesson) => 
                        lessonTotal + (lesson.blocks?.length || 0), 0) || 0), 0) || 0} блоков
                  </span>
                </div>
              </div>
            </div>
            <Button size="sm" className="w-full" onClick={addModule}>
              <Plus className="w-3 h-3 mr-1" />
              Добавить модуль
            </Button>
          </div>

          {/* Modules Tree */}
          <div className="flex-1 overflow-y-auto">
            {course.modules?.length > 0 ? (
              course.modules.map((module) => (
              <div key={module.id}>
                <div
                  className="flex items-center justify-between px-4 py-2 hover:bg-accent/50 cursor-pointer group"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-muted-foreground">
                      {expandedModules.has(module.id) ? '▼' : '▶'}
                    </span>
                    <FolderOpen className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-foreground truncate">{module.title}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-1">
                      <Plus className="w-3 h-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-1">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Переименовать</DropdownMenuItem>
                        <DropdownMenuItem>Дублировать</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {expandedModules.has(module.id) && (
                  <Droppable droppableId={module.id} type="lesson">
                    {(provided, snapshot) => (
                      <div 
                        className="pl-6"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          backgroundColor: snapshot.isDraggingOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                          minHeight: '20px'
                        }}
                      >
                        {module.lessons?.map((lesson, index) => (
                          <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center justify-between px-4 py-1.5 hover:bg-accent/50 cursor-pointer group ${
                                  selectedLesson?.id === lesson.id ? 'bg-blue-100 dark:bg-blue-800/50 border-r-4 border-blue-500' : ''
                                } ${snapshot.isDragging ? 'shadow-lg bg-card border border-border' : ''}`}
                                onClick={() => {
                                  if (selectedLesson?.id === lesson.id) {
                                    // При повторном клике на активный урок показываем панель блоков
                                    setShowBlocksPanel(true);
                                  } else {
                                    setSelectedLesson(lesson);
                                    setShowBlocksPanel(false);
                                  }
                                  setShowCourseInfo(false);
                                }}
                                style={{
                                  ...provided.draggableProps.style,
                                  transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'none'
                                }}
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <FileText className={`w-4 h-4 ${
                                    selectedLesson?.id === lesson.id 
                                      ? 'text-blue-800 dark:text-blue-100' 
                                      : 'text-green-600'
                                  }`} />
                                  <StatusIcon 
                                    status={lesson.status} 
                                    className={`text-xs ${
                                      selectedLesson?.id === lesson.id 
                                        ? 'text-blue-800 dark:text-blue-100' 
                                        : ''
                                    }`} 
                                  />
                                  <span className={`text-sm truncate ${
                                    selectedLesson?.id === lesson.id 
                                      ? 'text-blue-900 dark:text-white font-semibold' 
                                      : 'text-foreground'
                                  }`}>{lesson.title}</span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 px-1">
                                        <MoreVertical className="w-3 h-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Переименовать</DropdownMenuItem>
                                      <DropdownMenuItem>Дублировать</DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">Удалить</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {(!module.lessons || module.lessons.length === 0) && (
                          <div className="px-4 py-2 text-xs text-muted-foreground">
                            Уроков пока нет
                          </div>
                        )}
                        <div className="px-4 py-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start text-xs h-7"
                            onClick={() => createLesson(module.id)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Создать урок
                          </Button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg text-foreground mb-2">Модули не найдены</h3>
                <p className="text-muted-foreground">В этом курсе пока нет модулей</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <SaveStatusIndicator 
            status={saveStatus} 
            lastSaved={lastSaved}
            errorMessage={errorMessage}
            onRetry={forceSave}
            className="text-xs"
          />
          <Button variant="outline" size="sm" className="w-full">
            Импорт уроков
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {showCourseInfo ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">{course?.title}</h1>
                <p className="text-muted-foreground">{course?.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Информация о курсе</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Модулей:</span>
                        <span className="text-foreground">{course?.modules?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Уроков:</span>
                        <span className="text-foreground">
                          {course?.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Статус:</span>
                        <span className="text-foreground">{course?.status || 'Не указан'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Структура курса</h3>
                    <div className="space-y-2">
                      {course?.modules?.map((module, index) => (
                        <div key={module.id} className="p-3 border border-border rounded-lg">
                          <div className="font-medium text-foreground">{module.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {module.lessons?.length || 0} уроков
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showBlocksPanel && selectedLesson ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">{selectedLesson.title}</h1>
                <p className="text-muted-foreground">{selectedLesson.description}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Блоки урока</h3>
                  {selectedLesson.blocks && selectedLesson.blocks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedLesson.blocks
                        .sort((a, b) => a.order - b.order)
                        .map((block, index) => (
                          <div key={block.id} className="p-4 border border-border rounded-lg bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  Блок {index + 1}
                                </span>
                                <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                                  {block.type}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Порядок: {block.order}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {block.type === 'text' && block.content?.text && (
                                <p className="truncate">{block.content.text}</p>
                              )}
                              {block.type === 'heading' && block.content?.text && (
                                <p className="font-medium truncate">{block.content.text}</p>
                              )}
                              {block.type === 'image' && (
                                <p>Изображение: {block.content?.url || 'Не указано'}</p>
                              )}
                              {block.type === 'video' && (
                                <p>Видео: {block.content?.url || 'Не указано'}</p>
                              )}
                              {block.type === 'audio' && (
                                <p>Аудио: {block.content?.url || 'Не указано'}</p>
                              )}
                              {block.type === 'file' && (
                                <p>Файл: {block.content?.url || 'Не указано'}</p>
                              )}
                              {block.type === 'quiz' && (
                                <p>Квиз: {block.content?.quizId || 'Не указан'}</p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">В этом уроке пока нет блоков</p>
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => setShowBlocksPanel(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Закрыть панель блоков
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : selectedLesson ? (
          <LessonEditor
            lesson={selectedLesson}
            onLessonUpdate={(updatedLesson) => {
              setSelectedLesson(updatedLesson);
              
              // Обновляем урок в курсе
              if (course) {
                const updatedModules = course.modules?.map(m => ({
                  ...m,
                  lessons: m.lessons?.map(l => 
                    l.id === updatedLesson.id ? updatedLesson : l
                  )
                }));

                setCourse({
                  ...course,
                  modules: updatedModules
                });
              }

              // Если это был новый урок, выключаем режим создания
              if (isCreatingLesson) {
                setIsCreatingLesson(false);
                setCreatingLessonModuleId(null);
              }
            }}
            onLessonDelete={deleteLesson}
            onLessonCopy={() => copyLesson(selectedLesson)}
            onNavigateToPrevious={navigateToPreviousLesson}
            onNavigateToNext={navigateToNextLesson}
            canNavigatePrevious={canNavigatePrevious()}
            canNavigateNext={canNavigateNext()}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg text-foreground mb-2">Выберите урок</h3>
              <p className="text-muted-foreground">Выберите урок из списка слева для редактирования или создайте новый</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </DragDropContext>
  );
}