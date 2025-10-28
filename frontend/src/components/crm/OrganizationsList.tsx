import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Plus, Search, Building2, ExternalLink } from 'lucide-react';
import { CrmLayout } from '../layout/CrmLayout';
import { withRole, ROLES } from '../../hoc';

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

interface OrganizationsResponse {
  organizations: Organization[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const fetchOrganizations = async (page: number, limit: number, search?: string): Promise<OrganizationsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`/api/organizations?${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  return response.json();
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
    <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
      {labels[status as keyof typeof labels] || status}
    </Badge>
  );
};

export const OrganizationsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['organizations', page, search],
    queryFn: () => fetchOrganizations(page, limit, search),
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Ошибка загрузки организаций: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <CrmLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Организации</h1>
          <p className="text-muted-foreground">
            Управление организациями в CRM системе
          </p>
        </div>
        <Button asChild>
          <Link to="/crm/orgs/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить организацию
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Список организаций
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или ИНН..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              Найти
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>ИНН</TableHead>
                    <TableHead>Сайт</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Создана</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/crm/orgs/${org.id}`}
                          className="hover:underline text-blue-600"
                        >
                          {org.name}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {org.inn}
                      </TableCell>
                      <TableCell>
                        {org.site ? (
                          <a 
                            href={org.site} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            {org.site}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(org.status)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {org._count?.contacts || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/crm/orgs/${org.id}`}>
                            Подробнее
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Назад
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Страница {page} из {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.totalPages}
                  >
                    Вперед
                  </Button>
                </div>
              )}

              {data?.organizations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {search ? 'Организации не найдены' : 'Нет организаций'}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </CrmLayout>
  );
};

// Экспортируем компонент с проверкой ролей
export default withRole([ROLES.ADMIN, ROLES.CURATOR])(OrganizationsList);