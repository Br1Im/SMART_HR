import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Filter, 
  Search, 
  ChevronDown,
  BookOpen, 
  Users, 
  Building, 
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Activity,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { Button } from './ui/button';
import { apiClient } from '../lib/api';

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  details: any;
  user: any;
  timestamp: string;
}

export function AuditHistoryModal({ isOpen, onClose }: AuditHistoryModalProps) {
  const [auditHistory, setAuditHistory] = useState<AuditEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: ''
  });

  // Функции перевода из Dashboard.tsx
  const translateEntity = (entity: string): string => {
    const entityTranslations: Record<string, string> = {
      'dashboard': 'панель управления',
      'courses': 'курсы',
      'course': 'курс',
      'users': 'пользователи',
      'user': 'пользователь',
      'organizations': 'организации',
      'organization': 'организация',
      'contacts': 'контакты',
      'contact': 'контакт',
      'audit': 'журнал аудита',
      'lessons': 'уроки',
      'lesson': 'урок',
      'quizzes': 'тесты',
      'quiz': 'тест',
      'blocks': 'блоки',
      'block': 'блок',
      'progress': 'прогресс',
      'profile': 'профиль',
      'consent': 'согласие',
      'applications': 'заявки',
      'application': 'заявка'
    };
    
    return entityTranslations[entity.toLowerCase()] || entity;
  };

  const translateAction = (action: string): string => {
    const actionTranslations: Record<string, string> = {
      'create': 'создал',
      'read': 'просмотрел',
      'update': 'обновил',
      'delete': 'удалил',
      'login': 'вошёл в систему',
      'logout': 'вышел из системы'
    };
    
    return actionTranslations[action.toLowerCase()] || action;
  };

  const formatActivityDescription = (action: string, entity: string, details: any, user: any) => {
    const userName = user?.fullName || user?.email || 'Пользователь';
    const translatedEntity = translateEntity(entity);
    const translatedAction = translateAction(action);
    
    // Специальные случаи для более естественного перевода
    switch (action.toLowerCase()) {
      case 'create':
        switch (entity.toLowerCase()) {
          case 'course':
          case 'courses':
            return `${userName} создал новый курс`;
          case 'user':
          case 'users':
            return `Зарегистрирован новый пользователь: ${userName}`;
          case 'organization':
          case 'organizations':
            return `${userName} добавил новую организацию`;
          case 'contact':
          case 'contacts':
            return `${userName} добавил новый контакт`;
          case 'lesson':
          case 'lessons':
            return `${userName} создал новый урок`;
          case 'quiz':
          case 'quizzes':
            return `${userName} создал новый тест`;
          case 'block':
          case 'blocks':
            return `${userName} добавил новый блок в курс`;
          default:
            return `${userName} создал новый элемент: ${translatedEntity}`;
        }
        
      case 'read':
        switch (entity.toLowerCase()) {
          case 'dashboard':
            return `${userName} просмотрел панель управления`;
          case 'course':
          case 'courses':
            return `${userName} просмотрел курсы`;
          case 'user':
          case 'users':
            return `${userName} просмотрел список пользователей`;
          case 'organization':
          case 'organizations':
            return `${userName} просмотрел организации`;
          case 'contact':
          case 'contacts':
            return `${userName} просмотрел контакты`;
          case 'audit':
            return `${userName} просмотрел журнал аудита`;
          case 'lesson':
          case 'lessons':
            return `${userName} просмотрел уроки`;
          case 'quiz':
          case 'quizzes':
            return `${userName} просмотрел тесты`;
          default:
            return `${userName} просмотрел: ${translatedEntity}`;
        }
        
      case 'update':
        switch (entity.toLowerCase()) {
          case 'course':
          case 'courses':
            return `${userName} обновил курс`;
          case 'user':
          case 'users':
            return `${userName} обновил данные пользователя`;
          case 'organization':
          case 'organizations':
            return `${userName} обновил информацию об организации`;
          case 'contact':
          case 'contacts':
            return `${userName} обновил контактную информацию`;
          case 'profile':
            return `${userName} обновил свой профиль`;
          case 'progress':
            return `${userName} обновил прогресс обучения`;
          default:
            return `${userName} обновил: ${translatedEntity}`;
        }
        
      case 'delete':
        switch (entity.toLowerCase()) {
          case 'course':
          case 'courses':
            return `${userName} удалил курс`;
          case 'user':
          case 'users':
            return `${userName} удалил пользователя`;
          case 'organization':
          case 'organizations':
            return `${userName} удалил организацию`;
          case 'contact':
          case 'contacts':
            return `${userName} удалил контакт`;
          case 'lesson':
          case 'lessons':
            return `${userName} удалил урок`;
          case 'quiz':
          case 'quizzes':
            return `${userName} удалил тест`;
          default:
            return `${userName} удалил: ${translatedEntity}`;
        }
        
      case 'login':
        return `${userName} вошёл в систему`;
        
      case 'logout':
        return `${userName} вышел из системы`;
        
      default:
        return `${userName} ${translatedAction} ${translatedEntity}`;
    }
  };

  const getActivityIcon = (action: string, entity: string) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (action.toLowerCase()) {
      case 'create':
        if (entity.toLowerCase().includes('course')) {
          return <BookOpen {...iconProps} className="w-5 h-5 text-blue-600" />;
        } else if (entity.toLowerCase().includes('user')) {
          return <Users {...iconProps} className="w-5 h-5 text-green-600" />;
        } else if (entity.toLowerCase().includes('org')) {
          return <Building {...iconProps} className="w-5 h-5 text-purple-600" />;
        }
        return <Plus {...iconProps} className="w-5 h-5 text-blue-600" />;
      case 'update':
        return <Edit {...iconProps} className="w-5 h-5 text-orange-600" />;
      case 'delete':
        return <Trash2 {...iconProps} className="w-5 h-5 text-red-600" />;
      case 'login':
        return <LogIn {...iconProps} className="w-5 h-5 text-green-600" />;
      case 'logout':
        return <LogOut {...iconProps} className="w-5 h-5 text-gray-600" />;
      case 'read':
        return <Eye {...iconProps} className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity {...iconProps} className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const fetchAuditHistory = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAuditHistory();
      console.log('API Response:', response); // Для отладки
      setAuditHistory(response.data || []);
      setFilteredHistory(response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки истории аудита:', error);
      setAuditHistory([]);
      setFilteredHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...auditHistory];

    // Поиск по тексту
    if (searchTerm) {
      filtered = filtered.filter(entry => {
        const description = formatActivityDescription(entry.action, entry.entity, entry.details, entry.user);
        return description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               entry.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               entry.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Фильтр по действию
    if (filterAction !== 'all') {
      filtered = filtered.filter(entry => entry.action.toLowerCase() === filterAction);
    }

    // Фильтр по сущности
    if (filterEntity !== 'all') {
      filtered = filtered.filter(entry => entry.entity.toLowerCase() === filterEntity);
    }

    // Фильтр по дате
    if (dateRange.from) {
      filtered = filtered.filter(entry => new Date(entry.timestamp) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      filtered = filtered.filter(entry => new Date(entry.timestamp) <= new Date(dateRange.to + 'T23:59:59'));
    }

    // Сортировка по дате
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredHistory(filtered);
  };

  useEffect(() => {
    if (isOpen) {
      fetchAuditHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterAction, filterEntity, dateRange, sortOrder, auditHistory]);

  const uniqueActions = [...new Set(auditHistory.map(entry => entry.action))];
  const uniqueEntities = [...new Set(auditHistory.map(entry => entry.entity))];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-6 h-6" />
                История активности
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Фильтры */}
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Поиск */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Поиск по активности..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Фильтр по действию */}
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Все действия</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action.toLowerCase()}>
                      {translateAction(action)}
                    </option>
                  ))}
                </select>

                {/* Фильтр по сущности */}
                <select
                  value={filterEntity}
                  onChange={(e) => setFilterEntity(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Все сущности</option>
                  {uniqueEntities.map(entity => (
                    <option key={entity} value={entity.toLowerCase()}>
                      {translateEntity(entity)}
                    </option>
                  ))}
                </select>

                {/* Сортировка */}
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {sortOrder === 'desc' ? 'Сначала новые' : 'Сначала старые'}
                </Button>
              </div>

              {/* Фильтр по дате */}
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Период:</span>
                </div>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="px-3 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted-foreground">—</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="px-3 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateRange({ from: '', to: '' })}
                    className="text-xs"
                  >
                    Сбросить
                  </Button>
                )}
              </div>
            </div>

            {/* Список активности */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-2 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredHistory.length > 0 ? (
                <div className="p-6 space-y-3">
                  {filteredHistory.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {getActivityIcon(entry.action, entry.entity)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {formatActivityDescription(entry.action, entry.entity, entry.details, entry.user)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(entry.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  <div className="text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {searchTerm || filterAction !== 'all' || filterEntity !== 'all' || dateRange.from || dateRange.to
                        ? 'Нет активности, соответствующей фильтрам'
                        : 'Нет записей активности'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Подвал с информацией */}
            <div className="p-4 border-t border-border bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                Показано {filteredHistory.length} из {auditHistory.length} записей
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}