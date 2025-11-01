import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NewLessonEditor from '../components/NewLessonEditor';
import { Lesson } from '../types';

const NewLessonPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const handleSave = async (lesson: Lesson) => {
    try {
      // Здесь будет API вызов для сохранения урока
      console.log('Сохранение урока:', lesson);
      
      // Пока что просто логируем и возвращаемся назад
      alert('Урок успешно создан!');
      navigate(-1); // Возвращаемся на предыдущую страницу
    } catch (error) {
      console.error('Ошибка при сохранении урока:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(-1); // Возвращаемся на предыдущую страницу
  };

  if (!moduleId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Ошибка</h1>
          <p className="text-gray-600">Не указан ID модуля</p>
        </div>
      </div>
    );
  }

  return (
    <NewLessonEditor
      moduleId={moduleId}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default NewLessonPage;