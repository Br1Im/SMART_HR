import { useState, useEffect } from 'react';
import { CoursesList } from './components/CoursesList';
import { CourseEditor } from './components/CourseEditor';
import { StudentView } from './components/StudentView';
import { QuizResults } from './components/QuizResults';

type ViewType = 'courses' | 'editor' | 'student' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Функция переключения темы
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Применение темы при изменении состояния
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('editor');
  };

  const handleCreateCourse = () => {
    // Mock creating a new course
    const newCourseId = Date.now().toString();
    setSelectedCourseId(newCourseId);
    setCurrentView('editor');
  };

  const handleBackToCourses = () => {
    setCurrentView('courses');
    setSelectedCourseId(null);
  };

  const handleSwitchToStudent = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('student');
  };

  const handleViewResults = () => {
    setCurrentView('results');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'courses':
        return (
          <div>
            <CoursesList 
              onCourseSelect={handleCourseSelect}
              onCreateCourse={handleCreateCourse}
            />
            {/* Navigation buttons for demo */}
            <div className="fixed bottom-6 right-6 flex gap-2">
              <button
                onClick={() => handleSwitchToStudent('1')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm"
              >
                👨‍🎓 Режим студента
              </button>
              <button
                onClick={handleViewResults}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors text-sm"
              >
                📊 Результаты квизов
              </button>
            </div>
          </div>
        );
      
      case 'editor':
        return selectedCourseId ? (
          <div>
            <CourseEditor 
              courseId={selectedCourseId}
              onBack={handleBackToCourses}
            />
            {/* Navigation button for demo */}
            <div className="fixed bottom-6 right-6">
              <button
                onClick={() => handleSwitchToStudent(selectedCourseId)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm"
              >
                👨‍🎓 Превью для студента
              </button>
            </div>
          </div>
        ) : null;
      
      case 'student':
        return selectedCourseId ? (
          <StudentView 
            courseId={selectedCourseId}
            onBack={handleBackToCourses}
          />
        ) : null;
      
      case 'results':
        return (
          <QuizResults 
            onBack={handleBackToCourses}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {renderCurrentView()}
      
      {/* Кнопка переключения темы в левом нижнем углу */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg"
        aria-label="Переключить тему"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}