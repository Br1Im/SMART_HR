import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Edit, Users, Mail } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UpdateUserData {
  fullName: string;
  email: string;
  role: string;
}

// API функции
const fetchUsers = async (search?: string, role?: string): Promise<User[]> => {
  const result = await apiClient.getUsers(1, 100, search, role);
  return result.data || [];
};

const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка обновления пользователя');
  }
  
  return response.json();
};

export function ContactsList() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState<UpdateUserData>({
    fullName: '',
    email: '',
    role: '',
  });

  const queryClient = useQueryClient();

  // Загрузка пользователей
  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users', searchTerm, selectedRoleFilter],
    queryFn: () => fetchUsers(searchTerm || undefined, selectedRoleFilter !== 'all' ? selectedRoleFilter : undefined),
  });

  // Убеждаемся, что users всегда массив
  const usersArray = Array.isArray(users) ? users : [];

  // Обновление пользователя
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditDialogOpen(false);
      setEditingUser(null);
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  // Фильтрация пользователей
  const filteredUsers = usersArray.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRoleFilter === 'all' || user.role === selectedRoleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserData.fullName || !editUserData.email || !editUserData.role || !editingUser) {
      alert('Заполните обязательные поля');
      return;
    }
    updateMutation.mutate({ id: editingUser.id, data: editUserData });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditUserData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'ADMIN': 'Администратор',
      'MANAGER': 'Менеджер',
      'CURATOR': 'Куратор',
      'CLIENT': 'Клиент',
      'CANDIDATE': 'Кандидат'
    };
    return roleNames[role] || role;
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка пользователей...</div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Ошибка загрузки пользователей</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Контакты</h1>
          <p className="text-muted-foreground">
            Управление контактами в CRM системе. Все зарегистрированные пользователи должны быть здесь.
          </p>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex space-x-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Поиск по имени, email или роли..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-64">
          <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по роли" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все роли</SelectItem>
              <SelectItem value="ADMIN">Администратор</SelectItem>
              <SelectItem value="MANAGER">Менеджер</SelectItem>
              <SelectItem value="CURATOR">Куратор</SelectItem>
              <SelectItem value="CLIENT">Клиент</SelectItem>
              <SelectItem value="CANDIDATE">Кандидат</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Список пользователей */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                {user.fullName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a 
                  href={`mailto:${user.email}`} 
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </a>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Роль</p>
                <p>{getRoleDisplayName(user.role)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Зарегистрирован</p>
                <p>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditDialog(user)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Редактировать
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Пользователи не найдены</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedRoleFilter !== 'all' 
              ? 'Попробуйте изменить фильтры поиска' 
              : 'Пользователи не зарегистрированы'
            }
          </p>
        </div>
      )}

      {/* Диалог редактирования пользователя */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editFullName">Полное имя *</Label>
              <Input
                id="editFullName"
                value={editUserData.fullName}
                onChange={(e) => setEditUserData({ ...editUserData, fullName: e.target.value })}
                placeholder="Имя пользователя"
                required
              />
            </div>
            <div>
              <Label htmlFor="editEmail">Email *</Label>
              <Input
                id="editEmail"
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="editRole">Роль</Label>
              <Select value={editUserData.role} onValueChange={(value) => setEditUserData({ ...editUserData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Администратор</SelectItem>
                  <SelectItem value="MANAGER">Менеджер</SelectItem>
                  <SelectItem value="CURATOR">Куратор</SelectItem>
                  <SelectItem value="CLIENT">Клиент</SelectItem>
                  <SelectItem value="CANDIDATE">Кандидат</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}