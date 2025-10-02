import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Quiz, Question, QuizAttempt } from '../types';

interface QuizPlayerProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete: (attempt: QuizAttempt) => void;
  isPreview?: boolean;
}

export function QuizPlayer({ quiz, onClose, onComplete, isPreview = false }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [results, setResults] = useState<any>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (quiz.settings.timeLimit && !isSubmitted) {
      setTimeLeft(quiz.settings.timeLimit * 60);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz.settings.timeLimit, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    const questionResults = quiz.questions.map(question => {
      const userAnswer = answers[question.id];
      let isCorrect = false;

      switch (question.type) {
        case 'single_choice':
          isCorrect = userAnswer === question.correctAnswers?.[0];
          break;
        case 'multiple_choice':
          const correctSet = new Set(question.correctAnswers);
          const userSet = new Set(userAnswer || []);
          isCorrect = correctSet.size === userSet.size && 
                     [...correctSet].every(x => userSet.has(x));
          break;
        case 'true_false':
          isCorrect = userAnswer === question.correctAnswer;
          break;
        case 'short_answer':
          isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
          break;
        default:
          isCorrect = false;
      }

      if (isCorrect) correctCount++;
      return { questionId: question.id, isCorrect, answer: userAnswer };
    });

    const score = correctCount;
    const maxScore = quiz.questions.length;
    const percentage = Math.round((score / maxScore) * 100);
    const status = percentage >= quiz.settings.passingScore ? 'passed' : 'failed';

    return {
      score,
      maxScore,
      percentage,
      status,
      questionResults
    };
  };

  const handleSubmit = () => {
    const results = calculateResults();
    setResults(results);
    setIsSubmitted(true);

    if (!isPreview) {
      const attempt: QuizAttempt = {
        id: Date.now().toString(),
        userId: '1',
        userName: 'Текущий пользователь',
        quizId: quiz.id,
        courseTitle: 'Текущий курс',
        quizTitle: quiz.title,
        score: results.score,
        maxScore: results.maxScore,
        percentage: results.percentage,
        attemptNumber: 1,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        status: results.status as 'passed' | 'failed',
        answers: quiz.questions.map(q => ({
          questionId: q.id,
          answer: answers[q.id],
          isCorrect: results.questionResults.find(r => r.questionId === q.id)?.isCorrect || false,
          timeSpent: 30 // Mock time spent
        }))
      };
      onComplete(attempt);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setQuestionStartTime(Date.now());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: Question) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case 'single_choice':
        return (
          <RadioGroup
            value={userAnswer?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
            disabled={isSubmitted}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} />
                <Label className="flex-1 cursor-pointer">{option}</Label>
                {isSubmitted && (
                  <div className="ml-2">
                    {question.correctAnswers?.includes(index) ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : userAnswer === index ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Checkbox
                  checked={userAnswer?.includes(index)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = userAnswer || [];
                    const newAnswers = checked
                      ? [...currentAnswers, index]
                      : currentAnswers.filter((i: number) => i !== index);
                    handleAnswerChange(question.id, newAnswers);
                  }}
                  disabled={isSubmitted}
                />
                <Label className="flex-1 cursor-pointer">{option}</Label>
                {isSubmitted && (
                  <div className="ml-2">
                    {question.correctAnswers?.includes(index) ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : userAnswer?.includes(index) ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <RadioGroup
            value={userAnswer}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            disabled={isSubmitted}
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="true" />
              <Label className="cursor-pointer">Да</Label>
              {isSubmitted && question.correctAnswer === 'true' && (
                <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
              )}
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value="false" />
              <Label className="cursor-pointer">Нет</Label>  
              {isSubmitted && question.correctAnswer === 'false' && (
                <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
              )}
            </div>
          </RadioGroup>
        );

      case 'short_answer':
        return (
          <div className="space-y-2">
            <Input
              value={userAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Введите ваш ответ"
              disabled={isSubmitted}
            />
            {isSubmitted && question.correctAnswer && (
              <div className="text-sm text-gray-600">
                Правильный ответ: {question.correctAnswer}
              </div>
            )}
          </div>
        );

      case 'long_answer':
        return (
          <Textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Введите развёрнутый ответ"
            rows={4}
            disabled={isSubmitted}
          />
        );

      default:
        return <div className="text-gray-500">Тип вопроса не поддерживается в превью</div>;
    }
  };

  if (isSubmitted && results) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center space-y-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              results.status === 'passed' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.status === 'passed' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>

            <div>
              <h2 className="text-2xl text-gray-900 mb-2">
                {results.status === 'passed' ? 'Квиз пройден!' : 'Квиз не пройден'}
              </h2>
              <p className="text-gray-600">
                Ваш результат: {results.score} из {results.maxScore} ({results.percentage}%)
              </p>
              {results.percentage < quiz.settings.passingScore && (
                <p className="text-sm text-gray-500 mt-2">
                  Для прохождения требуется {quiz.settings.passingScore}%
                </p>
              )}
            </div>

            {quiz.settings.showExplanations !== 'after_course' && (
              <div className="text-left space-y-4">
                <h3 className="text-lg text-gray-900">Результаты по вопросам:</h3>
                {quiz.questions.map((question, index) => {
                  const result = results.questionResults.find(r => r.questionId === question.id);
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          result?.isCorrect ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {result?.isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 mb-2">{question.question}</p>
                          {question.explanation && (
                            <p className="text-sm text-gray-600">{question.explanation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-center gap-3">
              {results.status === 'failed' && quiz.settings.maxAttempts > 1 && (
                <Button onClick={() => window.location.reload()}>
                  Попробовать снова
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl text-gray-900">{quiz.title}</h2>
            {isPreview && (
              <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Режим превью
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatTime(timeLeft)}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}</span>
            <span>{Math.round((currentQuestionIndex + 1) / quiz.questions.length * 100)}%</span>
          </div>
          <Progress value={(currentQuestionIndex + 1) / quiz.questions.length * 100} />
        </div>

        {/* Question */}
        <div className="flex-1 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderQuestion(currentQuestion)}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Назад
          </Button>

          <div className="flex gap-1">
            {quiz.questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : 
                        answers[quiz.questions[index].id] ? "secondary" : "outline"}
                size="sm"
                onClick={() => goToQuestion(index)}
                className="w-8 h-8 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmit}>
              Завершить квиз
            </Button>
          ) : (
            <Button
              onClick={() => goToQuestion(currentQuestionIndex + 1)}
            >
              Далее
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}