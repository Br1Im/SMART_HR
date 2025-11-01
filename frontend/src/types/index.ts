export type Status = 'draft' | 'published' | 'hidden';

export interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  duration?: string;
  level?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  modules: Module[];
  isFavorite?: boolean;
  isStarted?: boolean;
}

export interface Module {
  id: string;
  title: string;
  courseId: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  moduleId: string;
  order: number;
  status: Status;
  blocks: Block[];
}



export interface Block {
  id: string;
  type: 'heading' | 'text' | 'image' | 'video' | 'audio' | 'file' | 'quiz';
  content: any;
  order: number;
  lessonId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  settings: QuizSettings;
}

export interface QuizSettings {
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  passingScore: number;
  maxAttempts: number;
  showExplanations: 'immediately' | 'after_submission' | 'after_course';
  timeLimit?: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswers?: number[];
  correctAnswer?: string;
  explanation?: string;
  image?: string;
  order: number;
}

export type QuestionType = 
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'ordering'
  | 'matching'
  | 'fill_blanks'
  | 'short_answer'
  | 'long_answer'
  | 'numeric'
  | 'file_upload'
  | 'hotspot'
  | 'image_labels'
  | 'scale'
  | 'matrix';

export interface QuizAttempt {
  id: string;
  userId: string;
  userName: string;
  quizId: string;
  courseTitle: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  attemptNumber: number;
  startedAt: string;
  completedAt: string;
  status: 'passed' | 'failed';
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  questionId: string;
  answer: any;
  isCorrect: boolean;
  timeSpent: number;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'ADMIN' | 'CURATOR' | 'CLIENT' | 'CANDIDATE';
  createdAt: string;
  updatedAt: string;
}