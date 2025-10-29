import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthPage.css';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('CLIENT');

  const navigate = useNavigate();
  const { register, error, isLoading, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      await register(email, password, fullName, role as any);
      navigate('/courses');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Smart Course</h1>
          <p className="auth-subtitle typing-animation">
            Создайте новый аккаунт
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
          
          <div className="form-group">
            <label htmlFor="fullName">Полное имя *</label>
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

          <div className="form-group">
            <label htmlFor="email">Email *</label>
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
            <label htmlFor="password">Пароль *</label>
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль *</label>
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

          <div className="form-group">
            <label htmlFor="role">Роль *</label>
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


          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Уже есть аккаунт?
            <Link to="/auth" className="auth-toggle">
              Войти
            </Link>
          </p>
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