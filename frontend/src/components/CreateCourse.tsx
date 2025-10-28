import { useNavigate } from 'react-router-dom';
import { CourseForm } from './courses/CourseForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export function CreateCourse() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // После успешного создания курса возвращаемся к списку курсов
    navigate('/courses');
  };

  const handleCancel = () => {
    // При отмене возвращаемся к списку курсов
    navigate('/courses');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к курсам
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Создание нового курса</h1>
              <p className="text-muted-foreground">Заполните информацию о курсе</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <CourseForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}