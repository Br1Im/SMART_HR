import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, BookOpen, BarChart3, Settings, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

interface AdminNavigationProps {
  className?: string;
}

export function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Показываем навигацию только для админов и кураторов
  if (!user || !['ADMIN', 'CURATOR'].includes(user.role)) {
    return null;
  }

  const navigationItems = [
    {
      id: 'dashboard',
      to: '/dashboard',
      icon: Home,
      label: 'Главная',
      roles: ['ADMIN', 'CURATOR', 'CLIENT', 'CANDIDATE']
    },
    {
      id: 'courses',
      to: '/courses',
      icon: BookOpen,
      label: 'Курсы',
      roles: ['ADMIN', 'CURATOR', 'CLIENT', 'CANDIDATE']
    },
    {
      id: 'orgs',
      to: '/crm/orgs',
      icon: Building2,
      label: 'Организации',
      roles: ['ADMIN', 'CURATOR']
    },
    {
      id: 'contacts',
      to: '/crm/contacts',
      icon: Users,
      label: 'Контакты',
      roles: ['ADMIN', 'CURATOR']
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <motion.nav 
      className={`bg-background border-b border-border ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || 
              (item.to === '/crm/orgs' && location.pathname.startsWith('/crm/orgs')) ||
              (item.to === '/crm/contacts' && location.pathname.startsWith('/crm/contacts')) ||
              (item.to === '/dashboard' && location.pathname === '/');

            return (
              <Link key={item.id} to={item.to}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}