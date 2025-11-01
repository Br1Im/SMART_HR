import { useEffect, useRef, useState, useCallback } from 'react';
import apiClient from '../lib/api';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  delay?: number; // Задержка в миллисекундах для debounce
  onSave?: (data: any) => Promise<any>; // Кастомная функция сохранения
  onError?: (error: Error) => void; // Обработчик ошибок
  retryAttempts?: number; // Количество попыток повтора при ошибке
  retryDelay?: number; // Задержка между попытками повтора
}

export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => Promise<any>,
  options: UseAutoSaveOptions = {}
) {
  const { delay = 1000, onError, retryAttempts = 3, retryDelay = 1000 } = options;
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);
  const lastDataRef = useRef<T>(data);
  const retryCountRef = useRef(0);

  const save = useCallback(async (dataToSave: T, attempt = 0) => {
    try {
      setSaveStatus('saving');
      setErrorMessage(null);
      
      const result = await saveFunction(dataToSave);
      
      // Проверяем, что сохранение действительно прошло успешно
      if (result) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        retryCountRef.current = 0;
        
        // Статус "saved" остается постоянно, не сбрасывается автоматически
      } else {
        throw new Error('Сохранение не удалось - нет ответа от сервера');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setErrorMessage(errorMsg);
      
      // Попытка повтора
      if (attempt < retryAttempts) {
        console.log(`Повторная попытка сохранения ${attempt + 1}/${retryAttempts}`);
        setTimeout(() => {
          save(dataToSave, attempt + 1);
        }, retryDelay);
        return;
      }
      
      setSaveStatus('error');
      retryCountRef.current = 0;
      
      if (onError) {
        onError(error as Error);
      }
      
      // Сбрасываем статус ошибки через 5 секунд
      setTimeout(() => {
        setSaveStatus('idle');
        setErrorMessage(null);
      }, 5000);
    }
  }, [saveFunction, onError, retryAttempts, retryDelay]);

  useEffect(() => {
    // Пропускаем первый рендер
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastDataRef.current = data;
      return;
    }

    // Проверяем, изменились ли данные
    if (JSON.stringify(data) === JSON.stringify(lastDataRef.current)) {
      return;
    }

    lastDataRef.current = data;

    // Очищаем предыдущий таймер
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Устанавливаем новый таймер для debounce
    timeoutRef.current = setTimeout(() => {
      save(data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, save]);

  // Функция для принудительного сохранения
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save(data);
  }, [data, save]);

  return {
    saveStatus,
    lastSaved,
    forceSave,
    errorMessage
  };
}

// Специализированные хуки для разных типов данных
export function useAutoSaveLesson(lesson: any) {
  return useAutoSave(
    lesson,
    async (lessonData) => {
      // Проверяем, что у урока есть валидный ID и он не новый
      if (!lessonData.id || lessonData.id === 'new' || !lessonData.title?.trim()) {
        throw new Error('Урок должен иметь ID и название для сохранения');
      }

      try {
        const result = await apiClient.updateLesson(lessonData.id, {
          title: lessonData.title,
          content: JSON.stringify(lessonData.blocks || []),
          type: lessonData.type || 'LESSON'
        });
        
        // Проверяем успешность сохранения
        if (!result || !result.id) {
          throw new Error('Сервер не подтвердил сохранение урока');
        }
        
        return result;
      } catch (error) {
        console.error('Ошибка сохранения урока:', error);
        throw error;
      }
    },
    { 
      delay: 1500, // Немного больше задержка для уроков
      retryAttempts: 2,
      retryDelay: 2000
    }
  );
}

export function useAutoSaveCourse(course: any) {
  return useAutoSave(
    course,
    async (courseData) => {
      // Проверяем, что у курса есть валидный ID и он не новый
      if (!courseData.id || courseData.id === 'new' || !courseData.title?.trim()) {
        throw new Error('Курс должен иметь ID и название для сохранения');
      }

      try {
        const result = await apiClient.updateCourse(courseData.id, {
          title: courseData.title,
          description: courseData.description || '',
          price: courseData.price,
          duration: courseData.duration,
          level: courseData.level,
          isPublished: courseData.isPublished
        });
        
        // Проверяем успешность сохранения
        if (!result || !result.id) {
          throw new Error('Сервер не подтвердил сохранение курса');
        }
        
        return result;
      } catch (error) {
        console.error('Ошибка сохранения курса:', error);
        throw error;
      }
    },
    { 
      delay: 1000,
      retryAttempts: 2,
      retryDelay: 1500
    }
  );
}

export function useAutoSaveBlock(block: any) {
  return useAutoSave(
    block,
    async (blockData) => {
      // Проверяем, что у блока есть валидный ID и он не новый
      if (!blockData.id || blockData.id === 'new') {
        throw new Error('Блок должен иметь ID для сохранения');
      }

      try {
        const result = await apiClient.updateBlock(blockData.id, {
          title: blockData.title,
          content: typeof blockData.content === 'string' 
            ? blockData.content 
            : JSON.stringify(blockData.content || ''),
          type: blockData.type
        });
        
        // Проверяем успешность сохранения
        if (!result || !result.id) {
          throw new Error('Сервер не подтвердил сохранение блока');
        }
        
        return result;
      } catch (error) {
        console.error('Ошибка сохранения блока:', error);
        throw error;
      }
    },
    { 
      delay: 800, // Быстрее для блоков
      retryAttempts: 3,
      retryDelay: 1000
    }
  );
}