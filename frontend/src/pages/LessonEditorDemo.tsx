import { useState } from 'react';
import { LessonEditor } from '../components/LessonEditor';
import { Lesson, Block } from '../types';

// Пример данных для демонстрации
const mockLesson: Lesson = {
  id: 'demo-lesson-1',
  title: 'Введение в React',
  status: 'draft',
  blocks: [
    {
      id: 'block-1',
      type: 'heading',
      content: { text: 'Что такое React?' },
      order: 1,
      lessonId: 'demo-lesson-1'
    },
    {
      id: 'block-2',
      type: 'text',
      content: { text: 'React — это JavaScript-библиотека для создания пользовательских интерфейсов. Она была разработана Facebook и позволяет создавать интерактивные веб-приложения с помощью компонентного подхода.' },
      order: 2,
      lessonId: 'demo-lesson-1'
    },
    {
      id: 'block-3',
      type: 'image',
      content: { 
        url: 'https://via.placeholder.com/600x300/3b82f6/ffffff?text=React+Logo',
        alt: 'Логотип React',
        caption: 'Официальный логотип React'
      },
      order: 3,
      lessonId: 'demo-lesson-1'
    },
    {
      id: 'block-4',
      type: 'heading',
      content: { text: 'Основные концепции' },
      order: 4,
      lessonId: 'demo-lesson-1'
    },
    {
      id: 'block-5',
      type: 'text',
      content: { text: 'React основан на нескольких ключевых концепциях:\n\n• Компоненты — переиспользуемые части UI\n• JSX — синтаксис для описания структуры компонентов\n• State — состояние компонента\n• Props — свойства, передаваемые в компонент' },
      order: 5,
      lessonId: 'demo-lesson-1'
    },
    {
      id: 'block-6',
      type: 'video',
      content: { 
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        autoplay: false
      },
      order: 6,
      lessonId: 'demo-lesson-1'
    },
    {
      id: 'block-7',
      type: 'quiz',
      content: { quizId: 'quiz-1' },
      order: 7,
      lessonId: 'demo-lesson-1'
    }
  ]
};

function LessonEditorDemo() {
  const [lesson, setLesson] = useState<Lesson>(mockLesson);

  const handleLessonUpdate = (updatedLesson: Lesson) => {
    setLesson(updatedLesson);
    console.log('Урок обновлен:', updatedLesson);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl font-semibold text-foreground">
            Демо: Редактор урока
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Демонстрация интерфейса редактора урока с примером контента
          </p>
        </div>
      </div>
      
      <LessonEditor 
        lesson={lesson} 
        onLessonUpdate={handleLessonUpdate} 
      />
    </div>
  );
}

export default LessonEditorDemo;