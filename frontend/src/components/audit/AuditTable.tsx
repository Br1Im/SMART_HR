import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Pagination } from '../ui/pagination';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { api } from '../../lib/api';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

interface AuditTableProps {
  entity?: string;
  entityId?: string;
  limit?: number;
  showFilters?: boolean;
}

const AuditTable: React.FC<AuditTableProps> = ({ 
  entity, 
  entityId, 
  limit = 10,
  showFilters = true 
}) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Фильтры
  const [entityFilter, setEntityFilter] = useState(entity || '');
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = `/api/audit?page=${page}&limit=${limit}`;
      
      if (entityFilter) url += `&entity=${entityFilter}`;
      if (actionFilter) url += `&action=${actionFilter}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (entityId) url += `&entityId=${entityId}`;
      
      const response = await api.get(url);
      setLogs(response.data.data);
      setTotalPages(Math.ceil(response.data.pagination.total / limit));
      setTotalItems(response.data.pagination.total);
    } catch (error) {
      console.error('Ошибка при загрузке логов аудита:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, entityFilter, actionFilter, startDate, endDate, entityId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'READ':
        return 'bg-gray-100 text-gray-800';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800';
      case 'LOGOUT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'dd MMM yyyy, HH:mm:ss', { locale: ru });
  };

  const renderDetails = (details: string) => {
    if (!details) return null;
    
    try {
      const parsedDetails = JSON.parse(details);
      return (
        <div className="text-xs">
          {parsedDetails.success !== undefined && (
            <Badge className={parsedDetails.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {parsedDetails.success ? 'Успешно' : 'Ошибка'}
            </Badge>
          )}
          {parsedDetails.error && (
            <div className="mt-1 text-red-600">{parsedDetails.error}</div>
          )}
        </div>
      );
    } catch (e) {
      return <div className="text-xs">{details}</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>История изменений</CardTitle>
        <CardDescription>
          {totalItems > 0 ? `Всего записей: ${totalItems}` : 'Нет записей'}
        </CardDescription>
      </CardHeader>
      
      {showFilters && (
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="w-full md:w-auto">
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Тип сущности" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все</SelectItem>
                  <SelectItem value="User">Пользователи</SelectItem>
                  <SelectItem value="Org">Организации</SelectItem>
                  <SelectItem value="Contact">Контакты</SelectItem>
                  <SelectItem value="Course">Курсы</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-auto">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Действие" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все</SelectItem>
                  <SelectItem value="CREATE">Создание</SelectItem>
                  <SelectItem value="READ">Просмотр</SelectItem>
                  <SelectItem value="UPDATE">Изменение</SelectItem>
                  <SelectItem value="DELETE">Удаление</SelectItem>
                  <SelectItem value="LOGIN">Вход</SelectItem>
                  <SelectItem value="LOGOUT">Выход</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-auto">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Начальная дата"
                className="w-full md:w-[180px]"
              />
            </div>
            
            <div className="w-full md:w-auto">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Конечная дата"
                className="w-full md:w-[180px]"
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setEntityFilter(entity || '');
                setActionFilter('');
                setStartDate('');
                setEndDate('');
              }}
            >
              Сбросить
            </Button>
          </div>
        </CardContent>
      )}
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">Загрузка...</div>
        ) : logs.length === 0 ? (
          <div className="text-center p-4">Нет данных для отображения</div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата и время</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Действие</TableHead>
                    <TableHead>Сущность</TableHead>
                    <TableHead>ID сущности</TableHead>
                    <TableHead>Детали</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        {log.user ? (
                          <div>
                            <div className="font-medium">{log.user.fullName}</div>
                            <div className="text-xs text-gray-500">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Неизвестный пользователь</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell className="font-mono text-xs">{log.entityId}</TableCell>
                      <TableCell>{renderDetails(log.details)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Предыдущая
                  </Button>
                  <div className="mx-4 flex items-center">
                    Страница {page} из {totalPages}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Следующая
                  </Button>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditTable;