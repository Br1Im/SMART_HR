import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, MoreVertical, Link, ArrowUp, ArrowDown, Copy, Trash2, FileText, FolderOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { StatusIcon } from './StatusIcon';
import { LessonEditor } from './LessonEditor';
import { Course, Module, Lesson } from '../types';
import apiClient from '../lib/api';

interface CourseEditorProps {
  courseId: string;
  onBack: () => void;
}

export function CourseEditor({ courseId, onBack }: CourseEditorProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {/* Left Sidebar - Course Structure */}
      <div className="w-72 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-sm text-foreground truncate">{course.title}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <StatusIcon status={course.status} />
                <span>{course.status}</span>
              </div>
            </div>
          </div>
          <Button size="sm" className="w-full">
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
                  <div className="pl-6">
                    {module.lessons?.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center justify-between px-4 py-1.5 hover:bg-accent/50 cursor-pointer group ${
                          selectedLesson?.id === lesson.id ? 'bg-accent border-r-2 border-primary' : ''
                        }`}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <FileText className="w-4 h-4 text-green-600" />
                          <StatusIcon status={lesson.status} className="text-xs" />
                          <span className="text-sm text-foreground truncate">{lesson.title}</span>
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
                    ))}
                    {(!module.lessons || module.lessons.length === 0) && (
                      <div className="px-4 py-2 text-xs text-muted-foreground">
                        Уроков пока нет
                      </div>
                    )}
                  </div>
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
        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            Импорт уроков
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedLesson ? (
          <LessonEditor
            lesson={selectedLesson}
            onLessonUpdate={(updatedLesson) => setSelectedLesson(updatedLesson)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg text-foreground mb-2">Выберите урок для редактирования</h3>
              <p className="text-muted-foreground">Выберите урок из списка слева или создайте новый</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}