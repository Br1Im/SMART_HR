import { useNavigate } from 'react-router-dom';
import { CoursesList } from './CoursesList';

interface CoursesListWrapperProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export function CoursesListWrapper({ darkMode, toggleTheme }: CoursesListWrapperProps) {
  const navigate = useNavigate();

  const handleCourseSelect = (courseId: string) => {
    navigate(`/editor/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate('/courses/create');
  };

  return (
    <CoursesList 
      onCourseSelect={handleCourseSelect}
      onCreateCourse={handleCreateCourse}
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  );
}