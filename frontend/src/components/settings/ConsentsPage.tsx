import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { api } from '../../lib/api';
import AuditTable from '../audit/AuditTable';

interface Consent {
  id: string;
  userId: string;
  type: string;
  grantedAt: string;
  basis: string;
  details?: string;
}

const ConsentTypesMap = {
  PERSONAL_DATA: 'Персональные данные',
  MARKETING: 'Маркетинговые материалы',
  ANALYTICS: 'Аналитика использования',
  COOKIES: 'Файлы cookie',
};

const ConsentBasisMap = {
  EXPLICIT: 'Явное согласие',
  CONTRACT: 'Договор',
  LEGITIMATE_INTEREST: 'Законный интерес',
  LEGAL_OBLIGATION: 'Юридическое обязательство',
};

const ConsentsPage: React.FC = () => {
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'consents' | 'history'>('consents');

  const fetchConsents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/consent/my');
      setConsents(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке согласий:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, []);

  const handleConsentToggle = async (consentType: string, currentState: boolean) => {
    try {
      if (currentState) {
        // Отзыв согласия
        await api.post('/api/consent/withdraw', { consentType });
      } else {
        // Предоставление согласия
        await api.post('/api/consent/give', { consentType });
      }
      // Обновляем список согласий
      fetchConsents();
    } catch (error) {
      console.error('Ошибка при изменении согласия:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
  };

  // Проверяем, есть ли согласие определенного типа
  const hasConsent = (type: string) => {
    return consents.some(consent => consent.type === type);
  };

  // Получаем согласие по типу
  const getConsentByType = (type: string) => {
    return consents.find(consent => consent.type === type);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Настройки конфиденциальности</h1>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'consents' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('consents')}
          >
            Согласия
          </Button>
          <Button 
            variant={activeTab === 'history' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('history')}
          >
            История изменений
          </Button>
        </div>
      </div>

      {activeTab === 'consents' ? (
        <Card>
          <CardHeader>
            <CardTitle>Управление согласиями</CardTitle>
            <CardDescription>
              Здесь вы можете управлять своими согласиями на обработку данных
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">Загрузка...</div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Тип согласия</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Дата предоставления</TableHead>
                        <TableHead>Основание</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(ConsentTypesMap).map(([type, label]) => {
                        const consent = getConsentByType(type);
                        const isActive = !!consent;
                        
                        return (
                          <TableRow key={type}>
                            <TableCell className="font-medium">{label}</TableCell>
                            <TableCell>
                              <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {isActive ? 'Активно' : 'Не активно'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {consent ? formatDate(consent.grantedAt) : '-'}
                            </TableCell>
                            <TableCell>
                              {consent ? ConsentBasisMap[consent.basis as keyof typeof ConsentBasisMap] || consent.basis : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  checked={isActive}
                                  onCheckedChange={(checked) => handleConsentToggle(type, isActive)}
                                />
                                <span>{isActive ? 'Отозвать' : 'Предоставить'}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>О ваших данных</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        В соответствии с законодательством о защите персональных данных, вы имеете право:
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Получить доступ к своим персональным данным</li>
                        <li>Исправить неточные персональные данные</li>
                        <li>Удалить свои персональные данные</li>
                        <li>Ограничить обработку своих персональных данных</li>
                        <li>Возражать против обработки своих персональных данных</li>
                        <li>Получить свои персональные данные в структурированном, машиночитаемом формате</li>
                      </ul>
                      <p>
                        Для реализации этих прав, пожалуйста, свяжитесь с нами по адресу privacy@smartcourse.ru
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <AuditTable entity="Consent" showFilters={true} />
      )}
    </div>
  );
};

export default ConsentsPage;