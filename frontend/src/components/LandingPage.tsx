import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Brain, BarChart3, Target, Globe, Award, ArrowRight, Sparkles, Users, Clock } from 'lucide-react';

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
            className="absolute text-5xl text-blue-300/25 dark:text-blue-400/25 font-serif" style={{ top: '10%', left: '15%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0, 
              x: [0, 10, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5 },
              x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∫ f(x)dx
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-indigo-300/25 dark:text-indigo-400/25 font-serif" style={{ top: '20%', left: '75%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -15, 0], 
              rotate: [0, -3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.2 },
              x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∂f/∂x
          </motion.div>
          
          <motion.div 
            className="absolute text-6xl text-violet-300/25 dark:text-violet-400/25 font-serif" style={{ top: '35%', left: '85%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -12, 0], 
              rotate: [0, 4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.3 },
              x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 14, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            π
          </motion.div>
          
          <motion.div 
            className="absolute text-5xl text-amber-300/25 dark:text-amber-400/25 font-serif" style={{ top: '80%', left: '50%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 8, 0], 
              rotate: [0, -2, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.4 },
              x: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 13, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∇ × F
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-cyan-300/25 dark:text-cyan-400/25 font-serif" style={{ top: '75%', left: '15%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 10, 0], 
              rotate: [0, 3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.5 },
              x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∞
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-emerald-300/25 dark:text-emerald-400/25 font-serif" style={{ top: '15%', left: '25%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -12, 0], 
              rotate: [0, 4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.6 },
              x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 14, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            lim(x→∞)
          </motion.div>
          
          <motion.div 
            className="absolute text-5xl text-rose-300/25 dark:text-rose-400/25 font-serif" style={{ top: '30%', left: '65%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 15, 0], 
              rotate: [0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.7 },
              x: { duration: 17, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 17, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 17, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            e^(iπ) + 1 = 0
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-purple-300/25 dark:text-purple-400/25 font-serif" style={{ top: '60%', left: '80%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -10, 0], 
              rotate: [0, 3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.8 },
              x: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 13, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∑ᵢ₌₁ⁿ xᵢ
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-rose-300/25 dark:text-rose-400/25 font-serif" style={{ top: '85%', left: '70%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 12, 0], 
              rotate: [0, -4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.9 },
              x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 15, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            √(x² + y²)
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-teal-300/25 dark:text-teal-400/25 font-serif" style={{ top: '90%', left: '30%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 8, 0], 
              rotate: [0, 2, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 1.0 },
              x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            sin²x + cos²x = 1
          </motion.div>
          
          <motion.div 
            className="absolute text-5xl text-amber-300/25 dark:text-amber-400/25 font-serif" style={{ top: '1px', left: '10%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 10, 0],
              rotate: [0, 3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 1.1 },
              x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 14, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ∑
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-blue-300/25 dark:text-blue-400/25 font-serif" style={{ top: '25%', left: '40%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, -12, 0],
              rotate: [0, -4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 1.2 },
              x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            a² + b² = c²
          </motion.div>
          
          <motion.div 
            className="absolute text-6xl text-indigo-300/25 dark:text-indigo-400/25 font-serif" style={{ top: '5%', left: '55%' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 0.3,
              y: 0,
              x: [0, 15, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 1.3 },
              x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 15, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            F = ma
          </motion.div>
          
          <motion.div 
            className="absolute text-5xl text-violet-300/25 dark:text-violet-400/25 font-serif" style={{ top: 'calc(50% - 300px)', left: 'calc(50% - 100px)' }}
            animate={{ 
              y: [0, -10, 0], 
              rotate: [0, -3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          >
            E = mc²
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-amber-300/25 dark:text-amber-400/25 font-serif" style={{ top: 'calc(50% - 150px)', left: 'calc(50% + 250px)' }}
            animate={{ 
              y: [0, -12, 0], 
              rotate: [0, 4, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            ∮ E·dl
          </motion.div>
          
          <motion.div 
            className="absolute text-4xl text-cyan-300/25 dark:text-cyan-400/25 font-serif" style={{ top: 'calc(50% + 250px)', left: 'calc(50% - 200px)' }}
            animate={{ 
              y: [0, -15, 0], 
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          >
            ∇·B = 0
          </motion.div>
        </div>
        <motion.div 
            className="absolute text-xl text-pink-300/30 dark:text-pink-400/25 font-serif" style={{ top: '12%', left: '85%' }}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 9 }}
          >
            ∞
          </motion.div>
          <motion.div 
            className="absolute text-xl text-lime-300/30 dark:text-lime-400/25 font-serif" style={{ top: '82%', left: '12%' }}
            animate={{ 
              y: [0, -6, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 10 }}
          >
            π
          </motion.div>
          <motion.div 
            className="absolute text-xl text-orange-300/30 dark:text-orange-400/25 font-serif" style={{ top: '88%', right: '25%' }}
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -12, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 11 }}
          >
            ∑
          </motion.div>
        
        <motion.div 
          className="text-center max-w-4xl mx-auto px-6 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent" itemProp="name">
              SmartCourse
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
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
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Link to="/auth">
                Начать обучение
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Узнать больше
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Особенности */}
      <section className="py-20 bg-background" aria-label="Преимущества платформы SmartCourse">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Почему SmartCourse?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Современные технологии для создания эффективных образовательных курсов
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariants} custom={0}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">ИИ-помощник</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Персональный ИИ-ассистент поможет создать уникальный контент для ваших курсов
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} custom={1}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Аналитика</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Подробная статистика прогресса учеников и эффективности курсов
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} custom={2}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Адаптивность</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Курсы автоматически адаптируются под уровень и потребности каждого ученика
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} custom={3}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Globe className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Доступность</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Обучение в любое время и в любом месте с любого устройства
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Наши достижения</span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full"></div>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
              Цифры, которые говорят о качестве нашей платформы
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariants} custom={0} className="text-center">
              <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8 relative">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/10 rounded-full group-hover:scale-150 transition-all duration-500"></div>
                  <div className="flex flex-col items-center justify-center mb-6 relative">
                    <Users className="w-12 h-12 text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                      <CountUp end={10} suffix="K+" duration={2500} />
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Активных студентов</h3>
                  <p className="text-muted-foreground">Обучаются на нашей платформе каждый день</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} custom={1} className="text-center">
              <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8 relative">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/10 rounded-full group-hover:scale-150 transition-all duration-500"></div>
                  <div className="flex flex-col items-center justify-center mb-6 relative">
                    <BookOpen className="w-12 h-12 text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                      <CountUp end={500} suffix="+" duration={2000} />
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Курсов</h3>
                  <p className="text-muted-foreground">По различным направлениям и специальностям</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} custom={2} className="text-center">
              <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8 relative">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-600/10 rounded-full group-hover:scale-150 transition-all duration-500"></div>
                  <div className="flex flex-col items-center justify-center mb-6 relative">
                    <Award className="w-12 h-12 text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                      <CountUp end={95} suffix="%" duration={1800} />
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Успешных выпускников</h3>
                  <p className="text-muted-foreground">Завершают курсы и получают сертификаты</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Часто задаваемые вопросы</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ответы на самые популярные вопросы о нашей платформе
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariants} custom={0}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Как работает ИИ-генерация контента?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Наша система использует передовые языковые модели для создания персонализированного учебного контента, адаптированного под ваши потребности и уровень знаний.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} custom={1}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Можно ли учиться офлайн?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Да, многие материалы можно скачать для изучения без подключения к интернету. Прогресс синхронизируется при следующем подключении.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} custom={2}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Сколько стоит обучение?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    У нас есть бесплатные курсы и премиум-подписка с расширенными возможностями. Цены начинаются от 990 рублей в месяц.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} custom={3}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Признаются ли сертификаты?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Да, наши сертификаты признаются многими работодателями и образовательными учреждениями. Мы сотрудничаем с ведущими компаниями отрасли.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Готовы начать обучение?
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Присоединяйтесь к тысячам студентов, которые уже изменили свою жизнь с помощью SmartCourse
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
                <Link to="/auth">
                  Начать бесплатно
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                <Clock className="w-5 h-5 mr-2" />
                Демо-версия
              </Button>
            </motion.div>
            
            <motion.p 
              className="text-sm text-blue-200 mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Без обязательств • Отмена в любое время • Поддержка 24/7
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;