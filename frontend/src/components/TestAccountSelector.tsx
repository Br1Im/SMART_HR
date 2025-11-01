import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Shield, Settings, Building, GraduationCap } from 'lucide-react';

interface TestAccount {
  email: string;
  password: string;
  fullName: string;
  role: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface TestAccountSelectorProps {
  onSelectAccount: (email: string, password: string) => void;
}

const testAccounts: TestAccount[] = [
  {
    email: 'admin@smartcourse.ru',
    password: 'password123',
    fullName: 'Системный администратор',
    role: 'ADMIN',
    description: 'Полный доступ ко всем функциям системы',
    icon: Shield,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  {
    email: 'curator@smartcourse.ru',
    password: 'password123',
    fullName: 'Куратор курсов',
    role: 'CURATOR',
    description: 'Управление курсами и контентом',
    icon: GraduationCap,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    email: 'manager@smartcourse.ru',
    password: 'password123',
    fullName: 'Менеджер',
    role: 'MANAGER',
    description: 'Управление пользователями и организациями',
    icon: Settings,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    email: 'client@smartcourse.ru',
    password: 'password123',
    fullName: 'Клиент компании',
    role: 'CLIENT',
    description: 'Доступ к корпоративным курсам',
    icon: Building,
    color: 'text-green-600 bg-green-50 border-green-200',
  },
  {
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Тестовый кандидат',
    role: 'CANDIDATE',
    description: 'Базовый доступ к публичным курсам',
    icon: User,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
  },
];

export const TestAccountSelector: React.FC<TestAccountSelectorProps> = ({ onSelectAccount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelectAccount = (account: TestAccount) => {
    onSelectAccount(account.email, account.password);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        setButtonRect(buttonRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span className="font-medium">Тестовые аккаунты</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>

      {/* Портал для выпадающего списка */}
      {isOpen && buttonRect && (
        <>
          {/* Overlay для закрытия при клике вне */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
              style={{
                top: buttonRect.bottom + 8,
                left: buttonRect.left,
                width: buttonRect.width,
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
              <div className="py-2">
                {testAccounts.map((account, index) => {
                  const IconComponent = account.icon;
                  return (
                    <motion.button
                      key={account.email}
                      type="button"
                      onClick={() => handleSelectAccount(account)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg border ${account.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {account.fullName}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${account.color}`}>
                              {account.role}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {account.email}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {account.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};