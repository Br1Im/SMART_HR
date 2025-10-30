import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './components/LandingPage';
import { CoursesList } from './components/CoursesList';
import { CourseEditor } from './components/CourseEditor';
import { CreateCourse } from './components/CreateCourse';
import { StudentView } from './components/StudentView';
import { QuizResults } from './components/QuizResults';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProtectedLayout } from './components/ProtectedLayout';
import { RegisterPage } from './components/RegisterPage';
import { OrganizationsList } from './components/crm/OrganizationsList';
import { OrganizationDetails } from './components/crm/OrganizationDetails';
import { ContactsList } from './components/crm/ContactsList';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './components/layout/ThemeToggle';
import './styles/AuthPage.css';

// Создаем QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Компонент-обертка для редактора курса
function EditorWrapper({ darkMode, toggleTheme }: { darkMode: boolean, toggleTheme: () => void }) {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/courses');
  };
  
  return (
    <CourseEditor 
      courseId={courseId || ''} 
      onBack={handleBack} 
    />
  );
}

interface AuthPageProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

function AuthPage({ darkMode, toggleTheme }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('CLIENT');
  const [adminPassword, setAdminPassword] = useState('');
  
  const navigate = useNavigate();
  const { login, register, error, isLoading, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Простая валидация
    if (!email || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    if (!isLogin) {
      if (!fullName) {
        alert('Пожалуйста, введите ваше имя');
        return;
      }
      if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      if (role === 'ADMIN' && !adminPassword) {
        alert('Для роли администратора требуется специальный пароль');
        return;
      }
    }
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, fullName, role);
      }
      // Переход на страницу курсов после успешного входа/регистрации
      navigate('/courses');
    } catch (error) {
      // Ошибка уже обработана в контексте
      console.error('Auth error:', error);
    }
  };

  const handleDemoLogin = async () => {
    try {
      // Демо вход с тестовыми данными
      await login('demo@example.com', 'demo123');
      navigate('/courses');
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  return (
    <div className="auth-page">
      {/* Анимированные математические формулы */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute text-4xl text-blue-300/20 dark:text-blue-400/20 font-serif" 
          style={{ top: '15%', left: '10%' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 0.3,
            y: 0, 
            x: [0, 10, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 1.0 },
            x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          ∫ f(x)dx
        </motion.div>
        
        <motion.div 
          className="absolute text-3xl text-purple-300/20 dark:text-purple-400/20 font-serif" 
          style={{ top: '25%', right: '15%' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 0.3,
            y: 0,
            x: [0, -15, 0], 
            rotate: [0, -3, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 1.2 },
            x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          e^(iπ) + 1 = 0
        </motion.div>
        
        <motion.div 
          className="absolute text-5xl text-indigo-300/20 dark:text-indigo-400/20 font-serif" 
          style={{ top: '70%', left: '20%' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 0.3,
            y: 0,
            x: [0, 12, 0], 
            rotate: [0, 4, 0],
            scale: [1, 1.04, 1]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 1.4 },
            x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 14, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          π
        </motion.div>
        
        <motion.div 
          className="absolute text-3xl text-emerald-300/20 dark:text-emerald-400/20 font-serif" 
          style={{ top: '80%', right: '25%' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 0.3,
            y: 0,
            x: [0, -8, 0], 
            rotate: [0, 3, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 1.6 },
            x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          ∑ᵢ₌₁ⁿ xᵢ
        </motion.div>
        
        <motion.div 
          className="absolute text-4xl text-rose-300/20 dark:text-rose-400/20 font-serif" 
          style={{ top: '45%', left: '5%' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 0.3,
            y: 0,
            x: [0, 15, 0], 
            rotate: [0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 1.8 },
            x: { duration: 17, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 17, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 17, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          ∇ × F
        </motion.div>
        
        <motion.div 
          className="absolute text-3xl text-amber-300/20 dark:text-amber-400/20 font-serif" 
          style={{ top: '60%', right: '10%' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 0.3,
            y: 0,
            x: [0, -10, 0], 
            rotate: [0, 3, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{ 
            opacity: { duration: 1.5, delay: 2.0 },
            x: { duration: 13, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 13, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 13, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          √(x² + y²)
        </motion.div>
      </div>
      
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-title-container">
            <Sparkles className="auth-sparkles" />
            <h1 className="auth-title">SmartCourse</h1>
          </div>
          <p className="auth-subtitle typing-animation">
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ 
              color: '#ef4444', 
              backgroundColor: '#fef2f2', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="fullName">Полное имя</label>
              <input
                type="text"
                id="fullName"
                placeholder="Введите ваше полное имя"
                className="auth-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="role">Роль</label>
              <select
                id="role"
                className="auth-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="CLIENT">Клиент</option>
                <option value="CANDIDATE">Кандидат</option>
                <option value="CURATOR">Куратор</option>
              </select>
            </div>
          )}

          {!isLogin && role === 'ADMIN' && (
            <div className="form-group">
              <label htmlFor="adminPassword">Пароль администратора</label>
              <input
                type="password"
                id="adminPassword"
                placeholder="Введите специальный пароль администратора"
                className="auth-input"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
          )}

          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Введите ваш email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="Введите ваш пароль"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Повторите пароль"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
          
          {isLogin && (
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setEmail('test@example.com');
                setPassword('Test123!');
              }} 
              className="auth-button" 
              style={{ 
                marginTop: '15px', 
                backgroundColor: '#10b981', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              <span style={{ fontSize: '18px' }}>🔑</span> Тестовый аккаунт
            </button>
          )}
        </form>
        
        <div className="auth-footer">
          <p>
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button
              type="button"
              className="auth-toggle"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
        
        <div className="auth-demo">
          <button onClick={handleDemoLogin} className="demo-link">
            Продолжить как гость →
          </button>
        </div>
      </div>
      

      
      {/* Переключатель темы в нижнем левом углу */}
      <div className="fixed bottom-6 left-6 z-50">
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Загружаем сохраненную тему из localStorage, по умолчанию тёмная тема
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? savedTheme === 'true' : true; // По умолчанию тёмная тема
  });

  const toggleTheme = () => {
    // Создаем эффект плавного перехода
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = darkMode ? 'rgba(249, 250, 251, 0)' : 'rgba(17, 24, 39, 0)';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.appendChild(overlay);

    // Активируем анимацию
    setTimeout(() => {
      overlay.style.backgroundColor = darkMode ? 'rgba(249, 250, 251, 0.1)' : 'rgba(17, 24, 39, 0.1)';
    }, 10);

    setDarkMode(prev => {
      const newDarkMode = !prev;
      // Сохраняем тему в localStorage
      localStorage.setItem('darkMode', String(newDarkMode));
      return newDarkMode;
    });

    // Удаляем overlay после завершения анимации
    setTimeout(() => {
      overlay.style.backgroundColor = 'transparent';
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 400);
    }, 200);
  };

  useEffect(() => {
    console.log('Theme effect triggered, darkMode:', darkMode);
    console.log('Current classes before change:', document.body.className);
    
    if (darkMode) {
      document.body.classList.add('dark');
      console.log('Added dark class');
    } else {
      document.body.classList.remove('dark');
      console.log('Removed dark class');
    }
    
    console.log('Classes after change:', document.body.className);
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/" element={<LandingPage darkMode={darkMode} toggleTheme={toggleTheme} />} />
          <Route path="/auth" element={<AuthPage darkMode={darkMode} toggleTheme={toggleTheme} />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Dashboard route - redirects to courses */}
          <Route path="/dashboard" element={
            <ProtectedLayout>
              <CoursesList 
                onCourseSelect={(courseId) => window.location.href = `/editor/${courseId}`} 
                onCreateCourse={() => window.location.href = '/courses/create'} 
                darkMode={darkMode} 
                toggleTheme={toggleTheme} 
              />
            </ProtectedLayout>
          } />
          
          {/* Защищённые маршруты для всех авторизованных пользователей */}
          <Route path="/courses" element={
            <ProtectedLayout>
              <CoursesList 
                onCourseSelect={(courseId) => window.location.href = `/editor/${courseId}`} 
                onCreateCourse={() => window.location.href = '/courses/create'} 
                darkMode={darkMode} 
                toggleTheme={toggleTheme} 
              />
            </ProtectedLayout>
          } />
          
          {/* Маршруты только для кураторов и админов */}
          <Route path="/courses/create" element={
            <ProtectedLayout allowedRoles={['ADMIN', 'CURATOR']}>
              <CreateCourse />
            </ProtectedLayout>
          } />
          
          <Route path="/editor/:courseId" element={
            <ProtectedLayout allowedRoles={['ADMIN', 'CURATOR']}>
              <EditorWrapper darkMode={darkMode} toggleTheme={toggleTheme} />
            </ProtectedLayout>
          } />
          
          {/* Маршруты для студентов (клиенты и кандидаты) */}
          <Route path="/student/:courseId" element={
            <ProtectedLayout allowedRoles={['CLIENT', 'CANDIDATE']}>
              <StudentView courseId='' onBack={() => {}} />
            </ProtectedLayout>
          } />
          
          <Route path="/results" element={
            <ProtectedLayout allowedRoles={['CLIENT', 'CANDIDATE']}>
              <QuizResults onBack={() => {}} />
            </ProtectedLayout>
          } />
          
          {/* CRM маршруты для админов и кураторов */}
          <Route path="/crm/orgs" element={
            <ProtectedLayout allowedRoles={['ADMIN', 'CURATOR']}>
              <OrganizationsList />
            </ProtectedLayout>
          } />
          
          <Route path="/crm/orgs/:id" element={
            <ProtectedLayout allowedRoles={['ADMIN', 'CURATOR']}>
              <OrganizationDetails />
            </ProtectedLayout>
          } />
          
          <Route path="/crm/contacts" element={
            <ProtectedLayout allowedRoles={['ADMIN', 'CURATOR']}>
              <ContactsList />
            </ProtectedLayout>
          } />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}