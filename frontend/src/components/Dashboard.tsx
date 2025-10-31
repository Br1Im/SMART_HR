import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Building2, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Target,
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Activity,
  Building,
  History
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { AuditHistoryModal } from './AuditHistoryModal';
import { ThemeToggle } from './layout/ThemeToggle';

interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  completedCourses: number;
  organizations: number;
  contacts: number;
  recentActivity?: any[];
  changes: {
    totalCourses: string;
    activeCourses: string;
    totalStudents: string;
    completedCourses: string;
    organizations: string;
    contacts: string;
  };
}

interface DashboardProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export function Dashboard({ darkMode, toggleTheme }: DashboardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    completedCourses: 0,
    organizations: 0,
    contacts: 0,
    changes: {
      totalCourses: '+0%',
      activeCourses: '+0%',
      totalStudents: '+0%',
      completedCourses: '+0%',
      organizations: '+0%',
      contacts: '+0%'
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка реальных данных из API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Ошибка загрузки данных дашборда:', err);
        setError('Не удалось загрузить данные дашборда');
        // Fallback к статическим данным в случае ошибки
        setStats({
          totalCourses: 0,
          activeCourses: 0,
          totalStudents: 0,
          completedCourses: 0,
          organizations: 0,
          contacts: 0,
          recentActivity: [],
          changes: {
            totalCourses: '',
            activeCourses: '',
            totalStudents: '',
            completedCourses: '',
            organizations: '',
            contacts: '',
          }
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Администратор';
      case 'CURATOR': return 'Куратор';
      case 'CLIENT': return 'Клиент';
      case 'CANDIDATE': return 'Кандидат';
      default: return role;
    }
  };

  const getStatsForRole = () => {
    if (!user) return [];

    const baseStats = [
      {
        title: 'Всего курсов',
        value: stats.totalCourses,
        icon: BookOpen,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        change: stats.changes.totalCourses
      },
      {
        title: 'Активные курсы',
        value: stats.activeCourses,
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        change: stats.changes.activeCourses
      }
    ];

    if (['ADMIN', 'CURATOR'].includes(user.role)) {
      return [
        ...baseStats,
        {
          title: 'Студенты',
          value: stats.totalStudents,
          icon: Users,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          change: stats.changes.totalStudents
        },
        {
          title: 'Организации',
          value: stats.organizations,
          icon: Building2,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          change: stats.changes.organizations
        }
      ];
    }

    return [
      ...baseStats,
      {
        title: 'Завершено курсов',
        value: stats.completedCourses,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        change: stats.changes.completedCourses
      }
    ];
  };

  const getQuickActions = () => {
    if (!user) return [];

    if (['ADMIN', 'CURATOR'].includes(user.role)) {
      return [
        {
          title: 'Создать курс',
          description: 'Добавить новый обучающий курс',
          icon: BookOpen,
          action: () => navigate('/courses/create'),
          color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
          title: 'Управление курсами',
          description: 'Просмотр и редактирование курсов',
          icon: BarChart3,
          action: () => navigate('/courses'),
          color: 'bg-green-600 hover:bg-green-700'
        },
        {
          title: 'CRM Организации',
          description: 'Управление организациями',
          icon: Building2,
          action: () => navigate('/crm/orgs'),
          color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
          title: 'CRM Контакты',
          description: 'Управление контактами',
          icon: Users,
          action: () => navigate('/crm/contacts'),
          color: 'bg-orange-600 hover:bg-orange-700'
        }
      ];
    }

    return [
      {
        title: 'Мои курсы',
        description: 'Просмотр доступных курсов',
        icon: BookOpen,
        action: () => navigate('/courses'),
        color: 'bg-blue-600 hover:bg-blue-700'
      },
      {
        title: 'Результаты',
        description: 'Просмотр результатов тестов',
        icon: Target,
        action: () => navigate('/results'),
        color: 'bg-green-600 hover:bg-green-700'
      }
    ];
  };

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка данных дашборда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Ошибка загрузки */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Приветствие */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getWelcomeMessage()}, {user?.firstName || 'Пользователь'}!
          </h1>
          <p className="text-muted-foreground">
            Роль: {getRoleDisplayName(user?.role || '')} • {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {getStatsForRole().map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {stat.title}
                </p>
                <p className="text-xs text-green-600">
                  {stat.change}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Быстрые действия */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getQuickActions().map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white h-auto p-6 flex flex-col items-start gap-3 hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-sm opacity-90">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Последние активности */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Последние активности
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuditHistoryOpen(true)}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Посмотреть всю историю
            </Button>
          </div>
          <div className="space-y-4">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {getActivityIcon(activity.action, activity.entity)}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formatActivityDescription(activity.action, activity.entity, activity.details, activity.user)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет недавних активностей</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Модальное окно истории аудита */}
      <AuditHistoryModal
        isOpen={isAuditHistoryOpen}
        onClose={() => setIsAuditHistoryOpen(false)}
      />

      {/* Кнопка переключения темы в нижнем левом углу */}
      <div className="fixed bottom-6 left-6 z-50">
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}

// Функция для форматирования времени
const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'только что';
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ч назад`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} дн назад`;
  
  return activityTime.toLocaleDateString('ru-RU');
};

// Функция для получения иконки и цвета по типу активности
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
    default:
      return <Activity {...iconProps} className="w-5 h-5 text-gray-600" />;
  }
};

// Функция для перевода названий сущностей
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

// Функция для перевода действий
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

// Функция для форматирования описания активности
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