import { Course, Quiz, QuizAttempt, Status } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Основы управления персоналом',
    description: 'Базовый курс по HR для начинающих специалистов',
    status: 'published' as Status,
    createdAt: '2024-01-15',
    updatedAt: '2024-02-01',
    modules: [
      {
        id: '1',
        title: 'Введение в HR',
        courseId: '1',
        order: 1,
        lessons: [
          {
            id: '1',
            title: 'Что такое HR?',
            moduleId: '1',
            order: 1,
            status: 'published' as Status,
            blocks: [
              {
                id: '1',
                type: 'heading',
                content: { text: 'Добро пожаловать в мир HR!' },
                order: 1,
                lessonId: '1'
              },
              {
                id: '2',
                type: 'text',
                content: { 
                  text: 'Human Resources (HR) — это стратегическая функция бизнеса, которая занимается управлением человеческими ресурсами организации. HR-специалисты отвечают за привлечение, развитие и удержание талантов.'
                },
                order: 2,
                lessonId: '1'
              },
              {
                id: '3',
                type: 'quiz',
                content: {
                  quizId: '1'
                },
                order: 3,
                lessonId: '1'
              }
            ]
          },
          {
            id: '2',
            title: 'История развития HR',
            moduleId: '1',
            order: 2,
            status: 'published' as Status,
            blocks: []
          }
        ]
      },
      {
        id: '2',
        title: 'Рекрутинг и отбор',
        courseId: '1',
        order: 2,
        lessons: [
          {
            id: '3',
            title: 'Планирование найма',
            moduleId: '2',
            order: 1,
            status: 'draft' as Status,
            blocks: []
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Корпоративная культура',
    description: 'Как создать и поддержать здоровую корпоративную культуру',
    status: 'draft' as Status,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25',
    modules: []
  },
  {
    id: '3',
    title: 'Мотивация персонала',
    description: 'Инструменты и методы мотивации сотрудников',
    status: 'hidden' as Status,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    modules: []
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Основы HR - Проверочный тест',
    description: 'Проверьте ваши знания основ управления персоналом',
    settings: {
      randomizeQuestions: false,
      randomizeAnswers: true,
      passingScore: 70,
      maxAttempts: 3,
      showExplanations: 'after_submission',
      timeLimit: 600
    },
    questions: [
      {
        id: '1',
        type: 'single_choice',
        question: 'Что означает аббревиатура HR?',
        options: [
          'Human Resources',
          'Human Relations',
          'Human Requirements',
          'Human Reporting'
        ],
        correctAnswers: [0],
        explanation: 'HR расшифровывается как Human Resources - человеческие ресурсы.',
        order: 1
      },
      {
        id: '2',
        type: 'multiple_choice',
        question: 'Какие функции входят в обязанности HR-специалиста?',
        options: [
          'Рекрутинг',
          'Обучение и развитие',
          'Управление производством',
          'Оценка персонала',
          'Финансовое планирование'
        ],
        correctAnswers: [0, 1, 3],
        explanation: 'HR-специалист занимается рекрутингом, обучением и развитием, оценкой персонала.',
        order: 2
      },
      {
        id: '3',
        type: 'true_false',
        question: 'HR-отдел отвечает только за найм сотрудников.',
        correctAnswer: 'false',
        explanation: 'HR-отдел имеет гораздо более широкие функции, включая развитие, мотивацию, оценку и удержание персонала.',
        order: 3
      }
    ]
  }
];

export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Анна Петрова',
    quizId: '1',
    courseTitle: 'Основы управления персоналом',
    quizTitle: 'Основы HR - Проверочный тест',
    score: 2,
    maxScore: 3,
    percentage: 67,
    attemptNumber: 1,
    startedAt: '2024-02-15T10:00:00Z',
    completedAt: '2024-02-15T10:15:00Z',
    status: 'failed',
    answers: [
      {
        questionId: '1',
        answer: 0,
        isCorrect: true,
        timeSpent: 30
      },
      {
        questionId: '2',
        answer: [0, 1],
        isCorrect: false,
        timeSpent: 45
      },
      {
        questionId: '3',
        answer: 'false',
        isCorrect: true,
        timeSpent: 20
      }
    ]
  },
  {
    id: '2',
    userId: '2',
    userName: 'Михаил Сидоров',
    quizId: '1',
    courseTitle: 'Основы управления персоналом',
    quizTitle: 'Основы HR - Проверочный тест',
    score: 3,
    maxScore: 3,
    percentage: 100,
    attemptNumber: 1,
    startedAt: '2024-02-16T14:30:00Z',
    completedAt: '2024-02-16T14:42:00Z',
    status: 'passed',
    answers: [
      {
        questionId: '1',
        answer: 0,
        isCorrect: true,
        timeSpent: 25
      },
      {
        questionId: '2',
        answer: [0, 1, 3],
        isCorrect: true,
        timeSpent: 60
      },
      {
        questionId: '3',
        answer: 'false',
        isCorrect: true,
        timeSpent: 15
      }
    ]
  }
];

export const questionTypes = [
  { id: 'single_choice', label: 'Один правильный', icon: '●' },
  { id: 'multiple_choice', label: 'Несколько правильных', icon: '◼' },
  { id: 'true_false', label: 'Да/Нет', icon: '✓' },
  { id: 'ordering', label: 'Упорядочить', icon: '⇅' },
  { id: 'matching', label: 'Соответствие', icon: '⟷' },
  { id: 'fill_blanks', label: 'Заполнить пропуски', icon: '___' },
  { id: 'short_answer', label: 'Короткий ответ', icon: 'Aa' },
  { id: 'long_answer', label: 'Развёрнутый ответ', icon: '¶' },
  { id: 'numeric', label: 'Числовой ответ', icon: '123' },
  { id: 'file_upload', label: 'Загрузка файла', icon: '📎' },
  { id: 'hotspot', label: 'Hotspot', icon: '●' },
  { id: 'image_labels', label: 'Подписи на картинке', icon: '🏷' },
  { id: 'scale', label: 'Шкала/Лайкерт', icon: '—' },
  { id: 'matrix', label: 'Матрица', icon: '▦' }
];