import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, Edit, Plus, Building2, ExternalLink } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  inn: string;
  site?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    contacts: number;
  };
}

interface CreateOrgData {
  name: string;
  inn: string;
  site?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

// API функции
const fetchOrganizations = async (): Promise<Organization[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/orgs', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Ошибка загрузки организаций');
  }
  
  return response.json();
};

const createOrganization = async (data: CreateOrgData): Promise<Organization> => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/orgs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка создания организации');
  }
  
  return response.json();
};

const deleteOrganization = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/orgs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Ошибка удаления организации');
  }
};

export function OrganizationsList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrg, setNewOrg] = useState<CreateOrgData>({
    name: '',
    inn: '',
    site: '',
    status: 'ACTIVE',
  });

  const queryClient = useQueryClient();

  // Загрузка организаций
  const { data: organizations = [], isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });

  // Создание организации
  const createMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setIsCreateDialogOpen(false);
      setNewOrg({ name: '', inn: '', site: '', status: 'ACTIVE' });
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  // Удаление организации
  const deleteMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  // Фильтрация организаций
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.inn.includes(searchTerm)
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.name || !newOrg.inn) {
      alert('Заполните обязательные поля');
      return;
    }
    createMutation.mutate(newOrg);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить организацию "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      PENDING: 'outline',
    } as const;
    
    const labels = {
      ACTIVE: 'Активная',
      INACTIVE: 'Неактивная',
      PENDING: 'Ожидает',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка организаций...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Ошибка загрузки организаций</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Организации</h1>
          <p className="text-muted-foreground">
            Управление организациями в CRM системе
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить организацию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать организацию</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  placeholder="Название организации"
                  required
                />
              </div>
              <div>
                <Label htmlFor="inn">ИНН *</Label>
                <Input
                  id="inn"
                  value={newOrg.inn}
                  onChange={(e) => setNewOrg({ ...newOrg, inn: e.target.value })}
                  placeholder="ИНН организации"
                  required
                />
              </div>
              <div>
                <Label htmlFor="site">Сайт</Label>
                <Input
                  id="site"
                  value={newOrg.site}
                  onChange={(e) => setNewOrg({ ...newOrg, site: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="status">Статус</Label>
                <Select value={newOrg.status} onValueChange={(value: any) => setNewOrg({ ...newOrg, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Активная</SelectItem>
                    <SelectItem value="INACTIVE">Неактивная</SelectItem>
                    <SelectItem value="PENDING">Ожидает</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Создание...' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Поиск */}
      <div className="w-full max-w-md">
        <Input
          placeholder="Поиск по названию или ИНН..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Список организаций */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrganizations.map((org) => (
          <Card key={org.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                </div>
                {getStatusBadge(org.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">ИНН</p>
                <p className="font-mono">{org.inn}</p>
              </div>
              
              {org.site && (
                <div>
                  <p className="text-sm text-muted-foreground">Сайт</p>
                  <a 
                    href={org.site} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {org.site}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">Контакты</p>
                <p>{org._count?.contacts || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Создана</p>
                <p>{new Date(org.createdAt).toLocaleDateString('ru-RU')}</p>
              </div>
              
              <div className="flex justify-between pt-2">
                <Link to={`/crm/orgs/${org.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Подробнее
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(org.id, org.name)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Организации не найдены</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Создайте первую организацию'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить организацию
            </Button>
          )}
        </div>
      )}
    </div>
  );
}