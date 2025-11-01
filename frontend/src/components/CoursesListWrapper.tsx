import { useNavigate } from 'react-router-dom';
import { CoursesList } from './CoursesList';
import { useRoleCheck } from './ProtectedRoute';

interface CoursesListWrapperProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export function CoursesListWrapper({ darkMode, toggleTheme }: CoursesListWrapperProps) {
  const navigate = useNavigate();
  const { isAdminOrCurator } = useRoleCheck();

  const handleCourseSelect = (courseId: string) => {
    // Админы и кураторы идут в редактор, клиенты и кандидаты - в студенческий режим
    if (isAdminOrCurator()) {
      navigate(`/editor/${courseId}`);
    } else {
      navigate(`/student/${courseId}`);
    }
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