import { useState, useEffect } from 'react';
import { X, Plus, GripVertical, Trash2, Eye, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { QuizPlayer } from './QuizPlayer';
import { Quiz, Question, QuestionType } from '../types';
import { mockQuizzes, questionTypes } from '../data/mockData';

interface QuizEditorProps {
  quizId?: string;
  onClose: () => void;
  onSave: (quiz: Quiz) => void;
}

export function QuizEditor({ quizId, onClose, onSave }: QuizEditorProps) {
  const [quiz, setQuiz] = useState<Quiz>({
    id: quizId || Date.now().toString(),
    title: 'Новый квиз',
    questions: [],
    settings: {
      randomizeQuestions: false,
      randomizeAnswers: true,
      passingScore: 70,
      maxAttempts: 3,
      showExplanations: 'after_submission',
    }
  });
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    if (quizId) {
      const existingQuiz = mockQuizzes.find(q => q.id === quizId);
      if (existingQuiz) {
        setQuiz(existingQuiz);
      }
    }
  }, [quizId]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: 'Новый вопрос',
      order: quiz.questions.length + 1,
      ...(type === 'single_choice' || type === 'multiple_choice' ? {
        options: ['Вариант 1', 'Вариант 2'],
        correctAnswers: [0]
      } : {}),
      ...(type === 'true_false' ? {
        correctAnswer: 'true'
      } : {})
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setSelectedQuestion(newQuestion);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
    
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteQuestion = (questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(null);
    }
  };

  const renderQuestionEditor = () => {
    if (!selectedQuestion) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Редактирование вопроса</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Вопрос</Label>
            <Textarea
              value={selectedQuestion.question}
              onChange={(e) => updateQuestion(selectedQuestion.id, { question: e.target.value })}
              rows={3}
            />
          </div>

          {(selectedQuestion.type === 'single_choice' || selectedQuestion.type === 'multiple_choice') && (
            <div>
              <Label>Варианты ответов</Label>
              <div className="space-y-2 mt-2">
                {selectedQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {selectedQuestion.type === 'single_choice' ? (
                      <RadioGroup
                        value={selectedQuestion.correctAnswers?.[0]?.toString()}
                        onValueChange={(value) => updateQuestion(selectedQuestion.id, { correctAnswers: [parseInt(value)] })}
                      >
                        <RadioGroupItem value={index.toString()} />
                      </RadioGroup>
                    ) : (
                      <Checkbox
                        checked={selectedQuestion.correctAnswers?.includes(index)}
                        onCheckedChange={(checked) => {
                          const currentCorrect = selectedQuestion.correctAnswers || [];
                          const newCorrect = checked 
                            ? [...currentCorrect, index] 
                            : currentCorrect.filter(i => i !== index);
                          updateQuestion(selectedQuestion.id, { correctAnswers: newCorrect });
                        }}
                      />
                    )}
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(selectedQuestion.options || [])];
                        newOptions[index] = e.target.value;
                        updateQuestion(selectedQuestion.id, { options: newOptions });
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newOptions = selectedQuestion.options?.filter((_, i) => i !== index);
                        updateQuestion(selectedQuestion.id, { options: newOptions });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [...(selectedQuestion.options || []), `Вариант ${(selectedQuestion.options?.length || 0) + 1}`];
                    updateQuestion(selectedQuestion.id, { options: newOptions });
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить вариант
                </Button>
              </div>
            </div>
          )}

          {selectedQuestion.type === 'true_false' && (
            <div>
              <Label>Правильный ответ</Label>
              <RadioGroup
                value={selectedQuestion.correctAnswer}
                onValueChange={(value) => updateQuestion(selectedQuestion.id, { correctAnswer: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" />
                  <Label>Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" />
                  <Label>Нет</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {selectedQuestion.type === 'short_answer' && (
            <div>
              <Label>Правильный ответ</Label>
              <Input
                value={selectedQuestion.correctAnswer || ''}
                onChange={(e) => updateQuestion(selectedQuestion.id, { correctAnswer: e.target.value })}
                placeholder="Введите правильный ответ"
              />
            </div>
          )}

          <div>
            <Label>Объяснение (необязательно)</Label>
            <Textarea
              value={selectedQuestion.explanation || ''}
              onChange={(e) => updateQuestion(selectedQuestion.id, { explanation: e.target.value })}
              placeholder="Объяснение правильного ответа"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Редактор квиза</DialogTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Превью
                </Button>
                <Button onClick={() => onSave(quiz)}>
                  Сохранить
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList>
              <TabsTrigger value="questions">Вопросы</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="flex-1 flex gap-4">
              {/* Questions List */}
              <div className="w-1/3 space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Вопросы ({quiz.questions.length})</h3>
                  <Button size="sm" onClick={() => addQuestion('single_choice')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Вопрос
                  </Button>
                </div>

                {/* Question Types Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {questionTypes.slice(0, 8).map((type) => (
                    <Button
                      key={type.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion(type.id as QuestionType)}
                      className="h-8 text-xs"
                    >
                      <span className="mr-1">{type.icon}</span>
                      {type.label}
                    </Button>
                  ))}
                </div>

                {/* Questions List */}
                <div className="space-y-2">
                  {quiz.questions.map((question, index) => (
                    <Card
                      key={question.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedQuestion?.id === question.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground mb-1">
                              {questionTypes.find(t => t.id === question.type)?.label}
                            </p>
                            <p className="text-sm text-foreground truncate">
                              {question.question}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQuestion(question.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Question Editor */}
              <div className="flex-1">
                {selectedQuestion ? (
                  renderQuestionEditor()
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-lg text-foreground mb-2">Выберите вопрос для редактирования</h3>
                      <p className="text-muted-foreground">Выберите вопрос из списка слева или создайте новый</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки квиза</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Случайный порядок вопросов</Label>
                        <Switch
                          checked={quiz.settings.randomizeQuestions}
                          onCheckedChange={(checked) => 
                            setQuiz(prev => ({
                              ...prev,
                              settings: { ...prev.settings, randomizeQuestions: checked }
                            }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Случайный порядок вариантов</Label>
                        <Switch
                          checked={quiz.settings.randomizeAnswers}
                          onCheckedChange={(checked) => 
                            setQuiz(prev => ({
                              ...prev,
                              settings: { ...prev.settings, randomizeAnswers: checked }
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Label>Порог прохождения (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={quiz.settings.passingScore}
                          onChange={(e) => 
                            setQuiz(prev => ({
                              ...prev,
                              settings: { ...prev.settings, passingScore: parseInt(e.target.value) || 0 }
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Максимальное количество попыток</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={quiz.settings.maxAttempts}
                          onChange={(e) => 
                            setQuiz(prev => ({
                              ...prev,
                              settings: { ...prev.settings, maxAttempts: parseInt(e.target.value) || 1 }
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Показать объяснения</Label>
                        <RadioGroup
                          value={quiz.settings.showExplanations}
                          onValueChange={(value) => 
                            setQuiz(prev => ({
                              ...prev,
                              settings: { ...prev.settings, showExplanations: value as any }
                            }))
                          }
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="immediately" />
                            <Label>Сразу после ответа</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="after_submission" />
                            <Label>После завершения квиза</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="after_course" />
                            <Label>После завершения курса</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>Ограничение времени (минуты)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={quiz.settings.timeLimit || ''}
                          onChange={(e) => 
                            setQuiz(prev => ({
                              ...prev,
                              settings: { 
                                ...prev.settings, 
                                timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                              }
                            }))
                          }
                          placeholder="Без ограничений"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Quiz Preview */}
      {showPreview && (
        <QuizPlayer
          quiz={quiz}
          onClose={() => setShowPreview(false)}
          onComplete={() => setShowPreview(false)}
          isPreview={true}
        />
      )}
    </>
  );
}