import { motion } from "framer-motion";
import { Search, Filter, Plus, Grid3X3, List } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Status } from '../../types';


interface HeaderProps {
  title_1: string;
  title_2: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: Status | 'all';
  setStatusFilter: (status: Status | 'all') => void;
  userFilter?: 'all' | 'favorites' | 'started';
  setUserFilter?: (filter: 'all' | 'favorites' | 'started') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onCreateItem?: () => void;
  createButtonText?: string;
  darkMode?: boolean;
  toggleTheme?: () => void;
}

export function Header({
  title_1,
  title_2,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  userFilter,
  setUserFilter,
  viewMode,
  setViewMode,
  onCreateItem,
  createButtonText = "Создать",
  darkMode = false,
  toggleTheme
}: HeaderProps) {
  return (
    <motion.div 
      className="bg-background border-b border-border"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Левая часть */}
          <motion.div 
            className="flex flex-row items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {/* Логотип */}
            <motion.h1 
              className="text-2xl text-foreground cursor-pointer select-none leading-none flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 10 }}
              whileHover={{ scale: 1.05 }}
            >
              {title_1}
              <motion.span
                className="text-blue-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {title_2}
              </motion.span>
            </motion.h1>

            {/* Поиск и фильтры в одной строке */}
            <div className="flex flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
              {/* Поиск */}
              <motion.div 
                className="relative w-full md:w-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </motion.div>

              {/* Фильтр статуса */}
              <motion.div
                className="w-full md:w-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | 'all')}>
                  <SelectTrigger className="w-full md:w-45">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="published">Опубликованы</SelectItem>
                    <SelectItem value="draft">Черновики</SelectItem>
                    <SelectItem value="hidden">Скрыты</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Фильтр пользователя */}
              {userFilter && setUserFilter && (
                <motion.div
                  className="w-full md:w-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Select value={userFilter} onValueChange={(value) => setUserFilter(value as 'all' | 'favorites' | 'started')}>
                    <SelectTrigger className="w-full md:w-45">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все курсы</SelectItem>
                      <SelectItem value="favorites">Избранные</SelectItem>
                      <SelectItem value="started">Начатые</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Правая часть */}
          <motion.div 
            className="flex items-center gap-2 md:gap-4 ml-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Переключатель вида */}
            <div className="flex gap-1 items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-md"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-md"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>



            {/* Кнопка создания */}
            {onCreateItem && (
              <Button onClick={onCreateItem} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                {createButtonText}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
