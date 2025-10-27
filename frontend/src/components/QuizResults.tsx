import { useState } from 'react';
import { Search, Filter, Download, Eye, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { QuizAttempt } from '../types';
import { mockQuizAttempts, mockQuizzes } from '../data/mockData';

interface QuizResultsProps {
  onBack: () => void;
}

export function QuizResults({ onBack }: QuizResultsProps) {
  const [attempts] = useState<QuizAttempt[]>(mockQuizAttempts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = attempt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || attempt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['ФИО', 'Курс', 'Квиз', 'Балл', 'Процент', 'Попытка', 'Дата', 'Статус'];
    const csvData = [
      headers.join(','),
      ...filteredAttempts.map(attempt => [
        attempt.userName,
        attempt.courseTitle,
        attempt.quizTitle,
        `${attempt.score}/${attempt.maxScore}`,
        `${attempt.percentage}%`,
        attempt.attemptNumber,
        new Date(attempt.completedAt).toLocaleDateString('ru-RU'),
        attempt.status === 'passed' ? 'Пройден' : 'Не пройден'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewAttemptDetails = (attempt: QuizAttempt) => {
    setSelectedAttempt(attempt);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <h1 className="text-2xl text-gray-900">Результаты квизов</h1>
            </div>
            <Button onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Экспорт CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск по ФИО, курсу или квизу..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'passed' | 'failed')}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все результаты</SelectItem>
                  <SelectItem value="passed">Пройдены</SelectItem>
                  <SelectItem value="failed">Не пройдены</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl text-gray-900">{attempts.length}</div>
              <div className="text-sm text-gray-500">Всего попыток</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl text-green-600">
                {attempts.filter(a => a.status === 'passed').length}
              </div>
              <div className="text-sm text-gray-500">Пройдено</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl text-red-600">
                {attempts.filter(a => a.status === 'failed').length}
              </div>
              <div className="text-sm text-gray-500">Не пройдено</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl text-blue-600">
                {Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)}%
              </div>
              <div className="text-sm text-gray-500">Средний балл</div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Результаты ({filteredAttempts.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Курс</TableHead>
                  <TableHead>Квиз</TableHead>
                  <TableHead>Балл</TableHead>
                  <TableHead>%</TableHead>
                  <TableHead>Попытка</TableHead>
                  <TableHead>Дата/Время</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.map((attempt) => (
                  <TableRow key={attempt.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-900">{attempt.userName}</TableCell>
                    <TableCell className="text-gray-600">{attempt.courseTitle}</TableCell>
                    <TableCell className="text-gray-600">{attempt.quizTitle}</TableCell>
                    <TableCell>
                      <span className="text-gray-900">
                        {attempt.score}/{attempt.maxScore}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={attempt.percentage} className="w-16 h-2" />
                        <span className="text-sm text-gray-600">{attempt.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">#{attempt.attemptNumber}</TableCell>
                    <TableCell className="text-gray-600">
                      <div>
                        <div>{new Date(attempt.completedAt).toLocaleDateString('ru-RU')}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(attempt.completedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={attempt.status === 'passed' ? 'default' : 'secondary'}>
                        {attempt.status === 'passed' ? 'Пройден' : 'Не пройден'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewAttemptDetails(attempt)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredAttempts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg text-gray-900 mb-2">Результаты не найдены</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Попробуйте изменить параметры поиска или фильтры'
                    : 'Пока нет результатов квизов'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attempt Details Modal */}
      {selectedAttempt && (
        <Dialog open={true} onOpenChange={() => setSelectedAttempt(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Подробности попытки</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Студент</div>
                      <div className="text-gray-900">{selectedAttempt.userName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Квиз</div>
                      <div className="text-gray-900">{selectedAttempt.quizTitle}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Результат</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">
                          {selectedAttempt.score}/{selectedAttempt.maxScore} ({selectedAttempt.percentage}%)
                        </span>
                        <Badge variant={selectedAttempt.status === 'passed' ? 'default' : 'secondary'}>
                          {selectedAttempt.status === 'passed' ? 'Пройден' : 'Не пройден'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Время выполнения</div>
                      <div className="text-gray-900">
                        {Math.round((new Date(selectedAttempt.completedAt).getTime() - 
                          new Date(selectedAttempt.startedAt).getTime()) / 1000 / 60)} мин
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Results */}
              <div>
                <h3 className="text-lg text-gray-900 mb-4">Ответы по вопросам</h3>
                <div className="space-y-4">
                  {selectedAttempt.answers.map((answer, index) => {
                    const quiz = mockQuizzes.find(q => q.id === selectedAttempt.quizId);
                    const question = quiz?.questions.find(q => q.id === answer.questionId);
                    
                    if (!question) return null;

                    return (
                      <Card key={answer.questionId}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              answer.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {answer.isCorrect ? '✓' : '✗'}
                            </div>
                            <div className="flex-1">
                              <div className="text-gray-900 mb-2">
                                <span className="text-sm text-gray-500 mr-2">Вопрос {index + 1}:</span>
                                {question.question}
                              </div>
                              
                              {question.type === 'single_choice' && (
                                <div className="text-sm">
                                  <div className="text-gray-600">
                                    Ответ студента: {question.options?.[answer.answer] || 'Не отвечено'}
                                  </div>
                                  {!answer.isCorrect && (
                                    <div className="text-green-600">
                                      Правильный ответ: {question.options?.[question.correctAnswers?.[0] || 0]}
                                    </div>
                                  )}
                                </div>
                              )}

                              {question.type === 'true_false' && (
                                <div className="text-sm">
                                  <div className="text-gray-600">
                                    Ответ студента: {answer.answer === 'true' ? 'Да' : answer.answer === 'false' ? 'Нет' : 'Не отвечено'}
                                  </div>
                                  {!answer.isCorrect && (
                                    <div className="text-green-600">
                                      Правильный ответ: {question.correctAnswer === 'true' ? 'Да' : 'Нет'}
                                    </div>
                                  )}
                                </div>
                              )}

                              {question.explanation && (
                                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                                  <strong>Объяснение:</strong> {question.explanation}
                                </div>
                              )}

                              <div className="text-xs text-gray-400 mt-2">
                                Время на вопрос: {answer.timeSpent}с
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}