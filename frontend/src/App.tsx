import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { CoursesList } from './components/CoursesList';
import { CourseEditor } from './components/CourseEditor';
import { StudentView } from './components/StudentView';
import { QuizResults } from './components/QuizResults';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/AuthPage.css';

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

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
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
    }
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, fullName, 'CLIENT');
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
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Smart Course</h1>
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
      
      <div className="auth-illustration">
        <div className="illustration-content">
          <div className="math-formula-large">∫f(x)dx = F(x) + C</div>
          <div className="math-formula-large">∑n=1∞ 1/n² = π²/6</div>
          <div className="math-formula-large">e^(iπ) + 1 = 0</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Загружаем сохраненную тему из localStorage
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? savedTheme === 'true' : false;
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/courses" element={<CoursesList 
            onCourseSelect={(courseId) => window.location.href = `/editor/${courseId}`} 
            onCreateCourse={() => {}} 
            darkMode={darkMode} 
            toggleTheme={toggleTheme} 
          />} />
          <Route path="/editor/:courseId" element={
            <EditorWrapper darkMode={darkMode} toggleTheme={toggleTheme} />
          } />
          <Route path="/student/:courseId" element={<StudentView courseId='' onBack={() => {}} />} />
          <Route path="/results" element={<QuizResults onBack={() => {}} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}