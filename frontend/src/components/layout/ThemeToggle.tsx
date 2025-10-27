import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ThemeToggleProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export function ThemeToggle({ darkMode, toggleTheme }: ThemeToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
      animate={isAnimating ? { rotate: [0, 360] } : {}}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleClick}
        className="rounded-full relative overflow-hidden bg-gradient-to-br from-background to-muted hover:from-muted hover:to-background dark:from-gray-800 dark:to-gray-900 dark:hover:from-gray-700 dark:hover:to-gray-800 border-2 border-border hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
        aria-label="Переключить тему"
      >
      <AnimatePresence mode="wait">
        {darkMode ? (
          <motion.div
            key="sun"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 180, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-5 w-5 text-yellow-500 transition-colors duration-300" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -180, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-5 w-5 text-blue-700 transition-colors duration-300" />
          </motion.div>
        )}
      </AnimatePresence>
        </Button>
    </motion.div>
  );
}