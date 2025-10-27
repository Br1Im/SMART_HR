import { BookOpen, Eye, Copy, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { StatusIcon } from '../StatusIcon';
import { Course } from '../../types';
import { motion, Variants } from 'framer-motion';

interface CourseCardProps {
  course: Course;
  onSelect: (courseId: string) => void;
  viewMode: 'grid' | 'list';
}

const cardVariants: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1, 
    y: 0,
    transition: {ease: "easeOut", duration: 0.3}
  }
}

export function CourseCard({ course, onSelect, viewMode }: CourseCardProps) {
  if (viewMode === 'grid') {
    return (
      <motion.div variants={cardVariants} className="h-[380px]">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-[380px] min-h-[380px] max-h-[380px]">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm line-clamp-3 min-h-[4.5rem]">{course.description}</CardDescription>
              </div>
              <StatusIcon status={course.status} className="ml-2 text-lg flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Обновлён: {new Date(course.updatedAt).toLocaleDateString('ru-RU')}</span>
              <span>{course.modules.reduce((total, module) => total + module.lessons.length, 0)} уроков</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onSelect(course.id)}
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
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
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
                onClick={() => onSelect(course.id)}
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
    </motion.div>
  );
}