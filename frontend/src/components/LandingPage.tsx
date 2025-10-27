import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Эффект для анимации при загрузке страницы
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Улучшенная анимация при скролле
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Добавляем задержку для элементов с анимацией
            const delay = entry.target.getAttribute('data-delay');
            if (delay) {
              (entry.target as HTMLElement).style.transitionDelay = delay;
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll, .step, .testimonial-card, .faq-item');
    animatedElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    // Добавляем эффект блеска к кнопкам
    const shineElements = document.querySelectorAll('.cta-button');
    shineElements.forEach(el => {
      el.classList.add('shine-effect');
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="landing-page">
      <header className="hero-section">
        {/* Формулы на фоне */}
        <div className="math-formula">∫f(x)dx</div>
        <div className="math-formula">E = mc²</div>
        <div className="math-formula">∑i=1n</div>
        <div className="math-formula">π ≈ 3.14159</div>
        <div className="math-formula">α² + β² = γ²</div>
        
        <div className="hero-content animate-on-scroll">
          <h1 className="title">Добро пожаловать в Smart Course</h1>
          <p className="subtitle">Ваш умный помощник в создании и прохождении курсов</p>
          <Link to="/auth" className="cta-button">
            Начать обучение
          </Link>
        </div>
      </header>

      <section className="features-section">
        <h2 className="section-title animate-on-scroll">Ключевые возможности</h2>
        <div className="features-grid">
          <div className="feature-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon">📝</div>
            <h3>Создание курсов</h3>
            <p>Легко создавайте курсы с уроками и интерактивными квизами. Интуитивный редактор поможет вам структурировать материал.</p>
          </div>
          <div className="feature-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon">❓</div>
            <h3>Интерактивные квизы</h3>
            <p>Проверяйте знания с помощью гибких и настраиваемых тестов. Множественный выбор, открытые вопросы и многое другое.</p>
          </div>
          <div className="feature-card animate-on-scroll" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon">📊</div>
            <h3>Отслеживание прогресса</h3>
            <p>Следите за своим прогрессом и результатами в реальном времени. Детальная аналитика и статистика успеваемости.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2 className="section-title animate-on-scroll">Как это работает?</h2>
        <div className="steps-container">
          <div className="step animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="step-number">1</div>
            <h4>Регистрация</h4>
            <p>Создайте аккаунт за несколько простых шагов. Быстро, безопасно и бесплатно.</p>
          </div>
          <div className="step animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="step-number">2</div>
            <h4>Выбор курса</h4>
            <p>Выберите интересующий вас курс или создайте свой собственный с помощью удобных инструментов.</p>
          </div>
          <div className="step animate-on-scroll" style={{ animationDelay: '0.3s' }}>
            <div className="step-number">3</div>
            <h4>Обучение</h4>
            <p>Проходите уроки, выполняйте задания и сдавайте квизы. Учитесь в удобном для вас темпе.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title animate-on-scroll">Что говорят наши студенты</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <p>Отличная платформа! Создал свой первый курс за пару часов. Очень интуитивно и просто. Студенты довольны качеством материалов.</p>
            <span>— Алексей Петров, преподаватель математики</span>
          </div>
          <div className="testimonial-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <p>Квизы помогли мне лучше усвоить материал. Спасибо за такой полезный инструмент! Теперь изучение стало намного интереснее.</p>
            <span>— Мария Иванова, студентка</span>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2 className="section-title animate-on-scroll">Часто задаваемые вопросы</h2>
        <div className="faq-item animate-on-scroll" style={{ animationDelay: '0.1s' }}>
          <h4>Могу ли я создавать свои собственные курсы?</h4>
          <p>Да, вы можете легко создавать и настраивать свои курсы, добавлять уроки и квизы. Наш редактор предоставляет все необходимые инструменты для создания качественного образовательного контента.</p>
        </div>
        <div className="faq-item animate-on-scroll" style={{ animationDelay: '0.2s' }}>
          <h4>Платформа бесплатная?</h4>
          <p>Базовый функционал доступен бесплатно, включая создание курсов и прохождение квизов. Для доступа к расширенным возможностям, таким как детальная аналитика и дополнительные типы заданий, доступны премиум-планы.</p>
        </div>
        <div className="faq-item animate-on-scroll" style={{ animationDelay: '0.3s' }}>
          <h4>Как начать использовать платформу?</h4>
          <p>Просто зарегистрируйтесь, используя кнопку "Начать обучение" выше. После регистрации вы сможете сразу же приступить к изучению существующих курсов или создать свой собственный.</p>
        </div>
      </section>

      <footer className="footer animate-on-scroll">
        <p>&copy; 2025 Smart Course. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default LandingPage;