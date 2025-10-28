export type Status = 'draft' | 'published' | 'hidden';

export interface Course {
  id: string;
  title: string;
  description?: string;
  price?: number;
  duration?: number;
  level: string;
  isPublished: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
  blocks?: Block[];
}



export interface Block {
  id: string;
  title: string;
  content?: string;
  type: string;
  position: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course?: Course;
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