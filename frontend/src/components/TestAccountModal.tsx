import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Shield, Settings, Building, GraduationCap } from 'lucide-react';

interface TestAccount {
  email: string;
  password: string;
  fullName: string;
  role: string;
  description: string;
  icon: React.ComponentType<any>;
  lightColor: string;
  darkColor: string;
}

interface TestAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, password: string) => void;
  darkMode?: boolean;
}

const testAccounts: TestAccount[] = [
  {
    email: 'admin@smartcourse.ru',
    password: 'password123',
    fullName: 'Системный администратор',
    role: 'ADMIN',
    description: 'Полный доступ ко всем функциям системы',
    icon: Shield,
    lightColor: 'text-red-600 bg-red-50 border-red-200',
    darkColor: 'dark:text-red-400 dark:bg-red-900/20 dark:border-red-800/30',
  },
  {
    email: 'curator@smartcourse.ru',
    password: 'password123',
    fullName: 'Куратор курсов',
    role: 'CURATOR',
    description: 'Управление курсами и контентом',
    icon: GraduationCap,
    lightColor: 'text-purple-600 bg-purple-50 border-purple-200',
    darkColor: 'dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800/30',
  },
  {
    email: 'manager@smartcourse.ru',
    password: 'password123',
    fullName: 'Менеджер',
    role: 'MANAGER',
    description: 'Управление пользователями и организациями',
    icon: Settings,
    lightColor: 'text-blue-600 bg-blue-50 border-blue-200',
    darkColor: 'dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/30',
  },
  {
    email: 'client@smartcourse.ru',
    password: 'password123',
    fullName: 'Клиент компании',
    role: 'CLIENT',
    description: 'Доступ к корпоративным курсам',
    icon: Building,
    lightColor: 'text-green-600 bg-green-50 border-green-200',
    darkColor: 'dark:text-green-400 dark:bg-green-900/20 dark:border-green-800/30',
  },
  {
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Тестовый кандидат',
    role: 'CANDIDATE',
    description: 'Базовый доступ к публичным курсам',
    icon: User,
    lightColor: 'text-gray-600 bg-gray-50 border-gray-200',
    darkColor: 'dark:text-gray-400 dark:bg-gray-800/50 dark:border-gray-700/50',
  },
];

export const TestAccountModal: React.FC<TestAccountModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectAccount,
  darkMode = false
}) => {
  const handleSelectAccount = (account: TestAccount) => {
    onSelectAccount(account.email, account.password);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'dark' : ''}`}>
      {/* Transparent clickable area */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{ backgroundColor: 'transparent' }}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative rounded-lg shadow-xl 
                   w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl
                   max-h-[90vh] sm:max-h-[85vh] lg:max-h-[80vh] 
                   overflow-hidden border ${
                     darkMode 
                       ? 'bg-gray-900 border-gray-700' 
                       : 'bg-white border-gray-200'
                   }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 
                        border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg sm:text-xl font-semibold ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Выберите тестовый аккаунт
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'hover:bg-gray-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            <X className={`h-5 w-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[65vh] lg:max-h-[60vh] 
                        overflow-y-auto custom-scrollbar">
          <p className={`text-sm mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Выберите один из предустановленных аккаунтов для быстрого входа в систему:
          </p>
          
          <div className="space-y-2 sm:space-y-3">
            {testAccounts.map((account, index) => {
              const IconComponent = account.icon;
              return (
                <motion.button
                  key={account.email}
                  type="button"
                  onClick={() => handleSelectAccount(account)}
                  className={`w-full p-3 sm:p-4 text-left 
                             transition-colors duration-150 
                             rounded-lg focus:outline-none focus:ring-2 
                             border ${
                               darkMode 
                                 ? 'border-gray-700 hover:bg-gray-800/50 hover:border-gray-600 focus:ring-blue-400' 
                                 : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-blue-500'
                             }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg border flex-shrink-0
                                    ${account.lightColor} ${account.darkColor}`}>
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center 
                                      sm:space-x-2 mb-1 space-y-1 sm:space-y-0">
                        <p className={`text-sm font-semibold truncate ${
                          darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {account.fullName}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 
                                         rounded-full text-xs font-medium 
                                         self-start sm:self-auto
                                         ${account.lightColor} ${account.darkColor}`}>
                          {account.role}
                        </span>
                      </div>
                      <p className={`text-xs mb-1 break-all sm:break-normal ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {account.email}
                      </p>
                      <p className={`text-xs leading-relaxed ${
                        darkMode ? 'text-gray-200' : 'text-gray-600'
                      }`}>
                        {account.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-t ${
          darkMode 
            ? 'border-gray-700 bg-gray-800/50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <p className={`text-xs text-center leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-500'
          }`}>
            Данные аккаунты предназначены только для демонстрации и тестирования
          </p>
        </div>
      </motion.div>
    </div>
  );
};