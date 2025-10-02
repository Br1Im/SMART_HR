import { useState } from 'react';
import { Search, Filter, Plus, Eye, Copy, Trash2, BookOpen, Grid3X3, List } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { StatusIcon } from './StatusIcon';
import { EmptyState } from './EmptyState';
import { Course, Status } from '../types';
import { mockCourses } from '../data/mockData';

interface CoursesListProps {
  onCourseSelect: (courseId: string) => void;
  onCreateCourse: () => void;
}

type ViewMode = 'grid' | 'list';

export function CoursesList({ onCourseSelect, onCreateCourse }: CoursesListProps) {
  const [courses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl text-gray-900">SMART HR</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск курсов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | 'all')}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="published">Опубликованы</SelectItem>
                  <SelectItem value="draft">Черновики</SelectItem>
                  <SelectItem value="hidden">Скрыты</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={onCreateCourse}>
                <Plus className="w-4 h-4 mr-2" />
                Создать курс
              </Button>
            </div>
          </div>
        </div>
      </div>

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
          viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-[220px]">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {course.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm">{course.description}</CardDescription>
                      </div>
                      <StatusIcon status={course.status} className="ml-2 text-lg" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="flex-1"></div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Обновлён: {new Date(course.updatedAt).toLocaleDateString('ru-RU')}</span>
                      <span>{course.modules.reduce((total, module) => total + module.lessons.length, 0)} уроков</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onCourseSelect(course.id)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Открыть
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {course.title}
                            </h3>
                            <StatusIcon status={course.status} className="text-sm flex-shrink-0" />
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-2">{course.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Обновлён: {new Date(course.updatedAt).toLocaleDateString('ru-RU')}</span>
                            <span>{course.modules.reduce((total, module) => total + module.lessons.length, 0)} уроков</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => onCourseSelect(course.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Открыть
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}