import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { 
  Building2, 
  Users, 
  BookOpen, 
  Settings, 
  Home,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    path: '/courses',
    label: 'Курсы',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    path: '/crm/orgs',
    label: 'Организации',
    icon: <Building2 className="h-4 w-4" />,
    roles: ['ADMIN', 'MANAGER', 'CANDIDATE'],
  },
  {
    path: '/crm/contacts',
    label: 'Контакты',
    icon: <Users className="h-4 w-4" />,
    roles: ['ADMIN', 'MANAGER', 'CLIENT'],
  },
  {
    path: '/settings/consents',
    label: 'Согласия',
    icon: <Settings className="h-4 w-4" />,
  },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const hasAccess = (item: NavigationItem) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  };

  return (
    <Card className="w-64 h-screen sticky top-0">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="mb-6">
          <Link to="/courses" className="flex items-center gap-2 text-xl font-bold">
            <Home className="h-6 w-6" />
            SmartCourse
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            if (!hasAccess(item)) return null;

            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t">
          {user && (
            <div className="mb-4 text-sm text-muted-foreground">
              <p className="font-medium">{user.fullName}</p>
              <p>{user.email}</p>
              <p className="text-xs">{user.role}</p>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};