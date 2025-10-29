import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Brain, BarChart3, Target, Globe, Award, ArrowRight, Sparkles, Users, Clock } from 'lucide-react';
import { ThemeToggle } from './layout/ThemeToggle';

const CountUp = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const startCount = (timestamp: number) => {
      startTime = timestamp;
      updateCount(timestamp);
    };
    
    const updateCount = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(startCount);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);
  
  return <>{count}{suffix}</>;
};

const LandingPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Загружаем сохраненную тему из localStorage, по умолчанию тёмная тема
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? savedTheme === 'true' : true; // По умолчанию тёмная тема
  });

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newDarkMode = !prev;
      localStorage.setItem('darkMode', String(newDarkMode));
      return newDarkMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Анимация появления элементов при скролле
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Наблюдаем за всеми элементами с классами для анимации
    const animatedElements = document.querySelectorAll('.feature-card, .step-card, .faq-item');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Анимации
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: (custom: number) => ({ 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: custom * 0.15
      }
    })
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero секция */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900/30 dark:to-purple-900/30 overflow-hidden shadow-lg" role="banner" aria-label="Главная секция SmartCourse">
        {/* Математические формулы - плавное распределение по блоку */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Формулы равномерно распределены по блоку */}
          <motion.div 
            className="absolute text-5xl text-blue-300/15 dark:text-blue-400/15 font-serif" style={{ top: '10%', left: '15%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0, 
              x: [0, 10, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.0 },
              x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∫ f(x)dx
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-indigo-300/15 dark:text-indigo-400/15 font-serif" style={{ top: '20%', left: '75%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -15, 0], 
              rotate: [0, -3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.2 },
              x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∂f/∂x
          </motion.div>
          
          <motion.div 
            className="absolute text-6xl text-violet-300/15 dark:text-violet-400/15 font-serif" style={{ top: '35%', left: '85%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -12, 0], 
              rotate: [0, 4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.3 },
              x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 14, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            π
          </motion.div>
          
          <motion.div 
            className="absolute text-5xl text-amber-300/15 dark:text-amber-400/15 font-serif" style={{ top: '80%', left: '50%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 8, 0], 
              rotate: [0, -2, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.4 },
              x: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 13, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∇ × F
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-cyan-300/15 dark:text-cyan-400/15 font-serif" style={{ top: '75%', left: '15%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 10, 0], 
              rotate: [0, 3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.5 },
              x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∞
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-emerald-300/15 dark:text-emerald-400/15 font-serif" style={{ top: '15%', left: '25%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -12, 0], 
              rotate: [0, 4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.6 },
              x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 14, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            lim(x→∞)
          </motion.div>
          
          <motion.div 
            className="absolute text-5xl text-rose-300/15 dark:text-rose-400/15 font-serif" style={{ top: '40%', left: '15%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 15, 0], 
              rotate: [0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.7 },
              x: { duration: 17, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 17, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 17, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            e^(iπ) + 1 = 0
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-purple-300/15 dark:text-purple-400/15 font-serif" style={{ top: '60%', left: '80%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -10, 0], 
              rotate: [0, 3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.8 },
              x: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 13, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∑ᵢ₌₁ⁿ xᵢ
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-rose-300/15 dark:text-rose-400/15 font-serif" style={{ top: '85%', left: '70%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 12, 0], 
              rotate: [0, -4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 2.9 },
              x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 15, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            √(x² + y²)
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-teal-300/15 dark:text-teal-400/15 font-serif" style={{ top: '90%', left: '30%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 8, 0], 
              rotate: [0, 2, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 3.0 },
              x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            sin²x + cos²x = 1
          </motion.div>
          
          <motion.div 
            className="absolute text-5xl text-amber-300/15 dark:text-amber-400/15 font-serif" style={{ top: '200px', left: '10%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 10, 0],
              rotate: [0, 3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 3.1 },
              x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 14, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∑
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-blue-300/15 dark:text-blue-400/15 font-serif" style={{ top: '25%', left: '40%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -12, 0],
              rotate: [0, -4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 3.2 },
              x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            a² + b² = c²
          </motion.div>
          
          <motion.div 
            className="absolute text-6xl text-indigo-300/15 dark:text-indigo-400/15 font-serif" style={{ top: '5%', left: '55%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 15, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 3.3 },
              x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 15, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            F = ma
          </motion.div>
          
          <motion.div 
            className="absolute text-5xl text-violet-300/15 dark:text-violet-400/15 font-serif" style={{ top: 'calc(50% - 300px)', left: 'calc(50% - 100px)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: [0, -10, 0], 
              rotate: [0, -3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 3.4 },
              y: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 13, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            E = mc²
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-amber-300/15 dark:text-amber-400/15 font-serif" style={{ top: 'calc(50% - 150px)', left: 'calc(50% + 250px)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: [0, -12, 0], 
              rotate: [0, 4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 3.8 },
              y: { duration: 17, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 17, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 17, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∮ E·dl
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-cyan-300/15 dark:text-cyan-400/15 font-serif" style={{ top: 'calc(50% + 200px)', left: 'calc(50% - 200px)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: [0, -15, 0], 
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 3.9 },
              y: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∇·B = 0
          </motion.div>
        </div>
        <motion.div 
            className="absolute text-xl text-pink-300/30 dark:text-pink-400/25 font-serif" style={{ top: '12%', left: '85%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: [0, -20, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 4.0 },
              y: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∞
          </motion.div>
          <motion.div 
            className="absolute text-xl text-lime-300/30 dark:text-lime-400/25 font-serif" style={{ top: '82%', left: '12%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: [0, -6, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 4.1 },
              y: { duration: 17, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 17, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            π
          </motion.div>
          <motion.div 
            className="absolute text-xl text-orange-300/30 dark:text-orange-400/25 font-serif" style={{ top: '88%', right: '15%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: [0, -15, 0],
              rotate: [0, -12, 0]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 5.0 },
              y: { duration: 18, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 18, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∑
          </motion.div>
        
        <motion.div 
          className="text-center max-w-4xl mx-auto px-6 z-50 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl -z-10 pointer-events-none"></div>
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm" itemProp="name">
               SmartCourse
              </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Революционная платформа для создания интеллектуальных курсов с помощью ИИ
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Начать обучение
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Узнать больше
            </Button>
          </motion.div>
        </motion.div>
      </section>



      {/* Как это работает секция */}
      <section 
        className="py-32 px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" 
        style={{ marginBottom: '80px' }}
        id="how-it-works"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Как это работает
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Простой и интуитивный процесс создания курсов с помощью искусственного интеллекта
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Опишите тему",
                description: "Расскажите ИИ о теме курса, целевой аудиторию и желаемых результатах обучения",
                icon: BookOpen,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02", 
                title: "ИИ создает структуру",
                description: "Искусственный интеллект анализирует данные и создает оптимальную структуру курса",
                icon: Brain,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Настройте контент",
                description: "Редактируйте материалы, добавляйте медиа и настраивайте под свои потребности",
                icon: Target,
                color: "from-green-500 to-emerald-500"
              },
              {
                step: "04",
                title: "Запустите курс",
                description: "Опубликуйте готовый курс и отслеживайте прогресс учеников в реальном времени",
                icon: Award,
                color: "from-orange-500 to-red-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                {/* Соединительная линия */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 z-0">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      viewport={{ once: true }}
                    />
                  </div>
                )}

                <Card className="relative z-10 h-full border-2 border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-blue-200 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-400/20">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества секция */}
      <section 
        className="py-32 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" 
        style={{ marginBottom: '80px' }}
        id="advantages"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Преимущества SmartCourse
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Почему тысячи преподавателей выбирают нашу платформу для создания курсов
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Экономия времени",
                description: "ИИ создает структуру курса за минуты, а не дни. Сосредоточьтесь на качестве контента, а не на рутинных задачах.",
                icon: Clock,
                stats: "90% экономии времени"
              },
              {
                title: "Персонализация",
                description: "Адаптивные алгоритмы подстраивают материал под каждого ученика, повышая эффективность обучения.",
                icon: Target,
                stats: "40% выше усвоение"
              },
              {
                title: "Аналитика",
                description: "Детальная статистика прогресса учеников помогает оптимизировать курс и улучшать результаты.",
                icon: BarChart3,
                stats: "100+ метрик"
              },
              {
                title: "Глобальный доступ",
                description: "Ваши курсы доступны 24/7 из любой точки мира. Масштабируйте обучение без ограничений.",
                icon: Globe,
                stats: "190+ стран"
              },
              {
                title: "Сообщество",
                description: "Присоединяйтесь к активному сообществу преподавателей и обменивайтесь опытом.",
                icon: Users,
                stats: "50,000+ преподавателей"
              },
              {
                title: "Качество контента",
                description: "ИИ помогает создавать структурированный и качественный образовательный контент.",
                icon: Award,
                stats: "95% рейтинг качества"
              }
            ].map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <advantage.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-blue-600 mb-2">
                          {advantage.title}
                        </h3>
                        <div className="text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full inline-block mb-3">
                          {advantage.stats}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* О проекте секция */}
      <section 
        className="py-32 px-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" 
        style={{ marginBottom: '80px' }}
      >
        {/* Декоративные элементы - более плавные анимации */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/8 to-purple-400/8 rounded-full blur-3xl"
            style={{ top: '10%', left: '10%' }}
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute w-80 h-80 bg-gradient-to-r from-indigo-400/8 to-cyan-400/8 rounded-full blur-3xl"
            style={{ top: '60%', right: '10%' }}
            animate={{ 
              x: [0, -25, 0],
              y: [0, 25, 0],
              scale: [1, 1.08, 1]
            }}
            transition={{ 
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              О проекте SmartCourse
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 96, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
            {/* Левая колонка - текст */}
            <motion.div
              className="order-2 lg:order-1 space-y-8 lg:pr-6 xl:pr-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <span className="text-blue-600 font-semibold">SmartCourse</span> — это <span className="text-blue-600 font-medium">инновационная образовательная платформа</span>, которая революционизирует процесс создания и изучения онлайн-курсов с помощью <span className="text-blue-600 font-medium">передовых технологий искусственного интеллекта</span>.
                </motion.p>
                
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  Наша миссия — <span className="text-blue-600 font-medium">сделать качественное образование доступным для каждого</span>, предоставляя инструменты для создания <span className="text-blue-600 font-medium">персонализированных учебных программ</span>, адаптированных под индивидуальные потребности каждого студента.
                </motion.p>

                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  Платформа объединяет в себе <span className="text-blue-600 font-medium">современные методики обучения</span>, <span className="text-blue-600 font-medium">интеллектуальную аналитику прогресса</span> и интуитивно понятный интерфейс, создавая <span className="text-blue-600 font-medium">уникальную экосистему для эффективного образования</span>.
                </motion.p>
              </div>
            </motion.div>

            {/* Правая колонка - ключевые особенности */}
            <motion.div
              className="order-1 lg:order-2 space-y-6 lg:pl-6 xl:pl-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
                {[
                  {
                    icon: Brain,
                    title: "ИИ-ассистент",
                    description: "Персональный помощник для создания и оптимизации курсов"
                  },
                  {
                    icon: Target,
                    title: "Персонализация",
                    description: "Адаптивные программы обучения под каждого студента"
                  },
                  {
                    icon: BarChart3,
                    title: "Аналитика",
                    description: "Детальная статистика прогресса и рекомендации"
                  },
                  {
                    icon: Globe,
                    title: "Доступность",
                    description: "Обучение в любое время и в любом месте"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 lg:gap-5 p-4 lg:p-5 rounded-xl lg:rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500 group"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.15, ease: "easeOut" }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-slate-700 to-slate-800 dark:from-blue-500 dark:to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/25 dark:shadow-blue-500/25 group-hover:shadow-slate-500/40 dark:group-hover:shadow-blue-500/40 transition-all duration-300">
                      <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base lg:text-lg text-blue-600 mb-1 lg:mb-2 group-hover:text-blue-700 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ секция */}
      <section 
        className="py-32 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20" 
        style={{ marginBottom: '80px' }}
        id="faq"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Часто задаваемые вопросы
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Ответы на самые популярные вопросы о SmartCourse
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "Как ИИ создает курсы?",
                answer: "Наш ИИ анализирует тему курса, целевую аудиторию и цели обучения, затем создает оптимальную структуру с учетом лучших педагогических практик и современных методик обучения."
              },
              {
                question: "Можно ли редактировать созданный ИИ курс?",
                answer: "Конечно! ИИ создает базовую структуру, которую вы можете полностью настроить под свои потребности: добавлять материалы, изменять последовательность, настраивать задания и тесты."
              },
              {
                question: "Какие форматы контента поддерживаются?",
                answer: "SmartCourse поддерживает видео, аудио, текст, изображения, интерактивные задания, тесты, презентации и многое другое. Вы можете создавать мультимедийные курсы любой сложности."
              },
              {
                question: "Есть ли бесплатный план?",
                answer: "Да, мы предлагаем бесплатный план с базовой функциональностью для создания до 3 курсов. Для расширенных возможностей доступны платные тарифы."
              },
              {
                question: "Как работает аналитика?",
                answer: "Платформа отслеживает прогресс каждого ученика, время изучения материалов, результаты тестов и многое другое. Вы получаете детальные отчеты для оптимизации курса."
              },
              {
                question: "Можно ли интегрировать с другими платформами?",
                answer: "Да, SmartCourse поддерживает интеграцию с популярными LMS, CRM-системами, платежными сервисами и инструментами для вебинаров."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-blue-600 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section 
        className="py-32 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white" 
        style={{ marginBottom: '80px' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Готовы создать свой первый курс?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам преподавателей, которые уже используют SmartCourse для создания качественных образовательных курсов
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                <Link to="/auth">
                  Начать бесплатно
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                Посмотреть демо
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">SmartCourse</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Компания</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">О нас</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Блог</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Карьера</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Пресса</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 SmartCourse. Все права защищены.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Политика конфиденциальности
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Условия использования
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Переключатель темы в нижнем левом углу */}
      <div className="fixed bottom-6 left-6 z-50">
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      </div>
    </main>
  );
};

export default LandingPage;