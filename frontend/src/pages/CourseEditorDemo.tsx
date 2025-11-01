import { useState } from 'react';
import { ArrowLeft, Plus, MoreVertical, FileText, FolderOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { StatusIcon } from '../components/StatusIcon';
import { LessonEditor } from '../components/LessonEditor';
import { Course, Module, Lesson } from '../types';

// Мок-данные для демонстрации CourseEditor
const mockCourse: Course = {
  id: 'course-demo-1',
  title: 'Основы веб-разработки',
  description: 'Полный курс по изучению веб-разработки с нуля',
  status: 'DRAFT',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  modules: [
    {
      id: 'module-1',
      title: 'HTML и CSS',
      description: 'Основы разметки и стилизации',
      courseId: 'course-demo-1',
      position: 0,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Введение в HTML',
          description: 'Основы HTML разметки',
          content: 'Содержимое урока по HTML',
          status: 'PUBLISHED',
          moduleId: 'module-1',
          position: 0,
          blocks: [
            {
              id: 'block-1',
              type: 'heading',
              content: { text: 'Что такое HTML?' },
              order: 1
            },
            {
              id: 'block-2',
              type: 'text',
              content: { text: 'HTML (HyperText Markup Language) — это язык разметки для создания веб-страниц.' },
              order: 2
            }
          ]
        },
        {
          id: 'lesson-2',
          title: 'Основы CSS',
          description: 'Стилизация веб-страниц',
          content: 'Содержимое урока по CSS',
          status: 'DRAFT',
          moduleId: 'module-1',
          position: 1,
          blocks: []
        },
        {
          id: 'lesson-3',
          title: 'Flexbox и Grid',
          description: 'Современные методы компоновки',
          content: 'Содержимое урока по Flexbox и Grid',
          status: 'DRAFT',
          moduleId: 'module-1',
          position: 2,
          blocks: []
        }
      ]
    },
    {
      id: 'module-2',
      title: 'JavaScript',
      description: 'Программирование на JavaScript',
      courseId: 'course-demo-1',
      position: 1,
      lessons: [
        {
          id: 'lesson-4',
          title: 'Переменные и типы данных',
          description: 'Основы JavaScript',
          content: 'Содержимое урока по переменным',
          status: 'PUBLISHED',
          moduleId: 'module-2',
          position: 0,
          blocks: []
        },
        {
          id: 'lesson-5',
          title: 'Функции',
          description: 'Создание и использование функций',
          content: 'Содержимое урока по функциям',
          status: 'DRAFT',
          moduleId: 'module-2',
          position: 1,
          blocks: []
        }
      ]
    },
    {
      id: 'module-3',
      title: 'React',
      description: 'Библиотека для создания пользовательских интерфейсов',
      courseId: 'course-demo-1',
      position: 2,
      lessons: [
        {
          id: 'lesson-6',
          title: 'Компоненты React',
          description: 'Создание компонентов',
          content: 'Содержимое урока по компонентам',
          status: 'DRAFT',
          moduleId: 'module-3',
          position: 0,
          blocks: []
        }
      ]
    }
  ]
};

function CourseEditorDemo() {
  const [course] = useState<Course>(mockCourse);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['module-1', 'module-2']));
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(course.modules?.[0]?.lessons?.[0] || null);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleBack = () => {
    // Демо функция
    console.log('Возврат к списку курсов');
  };

  const addModule = () => {
    console.log('Добавление нового модуля');
  };

  const createLesson = (moduleId: string) => {
    console.log('Создание урока для модуля:', moduleId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок демо-страницы */}
      <div className="bg-card border-b border-border p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Демо CourseEditor
          </h1>
          <p className="text-muted-foreground">
            Просмотр дизайна и функциональности редактора курсов
          </p>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Course Structure */}
        <div className="w-72 bg-card border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <Button variant="ghost" size="sm" onClick={handleBack}>
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
            <Button size="sm" className="w-full" onClick={addModule}>
              <Plus className="w-3 h-3 mr-1" />
              Добавить модуль
            </Button>
          </div>

          {/* Modules Tree */}
          <div className="flex-1 overflow-y-auto">
            {course.modules?.map((module) => (
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
              </div>
            ))}
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
                <h3 className="text-lg text-foreground mb-2">Выберите урок</h3>
                <p className="text-muted-foreground">Выберите урок из списка слева для редактирования</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Информация о демо */}
      <div className="bg-card border-t border-border p-4">
        <div className="container mx-auto">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Возможности CourseEditor:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Структура курса:</h4>
                <ul className="space-y-1">
                  <li>• Иерархическое отображение модулей и уроков</li>
                  <li>• Сворачивание/разворачивание модулей</li>
                  <li>• Статусы уроков (черновик, опубликован)</li>
                  <li>• Навигация по урокам</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Управление:</h4>
                <ul className="space-y-1">
                  <li>• Добавление новых модулей</li>
                  <li>• Создание уроков в модулях</li>
                  <li>• Контекстные меню для действий</li>
                  <li>• Импорт уроков</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseEditorDemo;