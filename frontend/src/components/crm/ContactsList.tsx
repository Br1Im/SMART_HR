import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Search, Users, Phone, Mail, Building2, Filter } from 'lucide-react';
import { CrmLayout } from '../layout/CrmLayout';
import { withRole, ROLES } from '../../hoc';

interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  org?: {
    id: string;
    name: string;
    inn: string;
  };
}

interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Organization {
  id: string;
  name: string;
  inn: string;
}

const fetchContacts = async (
  page: number, 
  limit: number, 
  search?: string, 
  orgId?: string
): Promise<ContactsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }
  
  if (orgId) {
    params.append('orgId', orgId);
  }

  const response = await fetch(`/api/contacts?${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }

  return response.json();
};

const fetchOrganizations = async (): Promise<Organization[]> => {
  const response = await fetch('/api/organizations?limit=1000', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  const data = await response.json();
  return data.organizations || [];
};

export const ContactsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const limit = 10;

  // Получаем orgId из URL параметров если есть
  const urlOrgId = searchParams.get('orgId');
  React.useEffect(() => {
    if (urlOrgId) {
      setSelectedOrgId(urlOrgId);
    }
  }, [urlOrgId]);

  const { data: contactsData, isLoading: contactsLoading, error: contactsError } = useQuery({
    queryKey: ['contacts', page, search, selectedOrgId],
    queryFn: () => fetchContacts(page, limit, search, selectedOrgId || undefined),
  });

  const { data: organizations } = useQuery({
    queryKey: ['organizations-list'],
    queryFn: fetchOrganizations,
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

  const handleOrgFilter = (orgId: string) => {
    setSelectedOrgId(orgId);
    setPage(1);
    
    // Обновляем URL параметры
    if (orgId) {
      setSearchParams({ orgId });
    } else {
      setSearchParams({});
    }
  };

  if (contactsError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Ошибка загрузки контактов: {(contactsError as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedOrg = organizations?.find(org => org.id === selectedOrgId);

  return (
    <CrmLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Контакты</h1>
          <p className="text-muted-foreground">
            {selectedOrg 
              ? `Контакты организации "${selectedOrg.name}"`
              : 'Управление контактами в CRM системе'
            }
          </p>
        </div>
        <Button asChild>
          <Link to={`/crm/contacts/new${selectedOrgId ? `?orgId=${selectedOrgId}` : ''}`}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить контакт
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Список контактов
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Select value={selectedOrgId} onValueChange={handleOrgFilter}>
              <SelectTrigger className="w-[250px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Все организации" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все организации</SelectItem>
                {organizations?.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name} ({org.inn})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline">
              Найти
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {contactsLoading ? (
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
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Должность</TableHead>
                    <TableHead>Организация</TableHead>
                    <TableHead>Добавлен</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactsData?.contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/crm/contacts/${contact.id}`}
                          className="hover:underline text-blue-600"
                        >
                          {contact.fullName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {contact.phone ? (
                          <a 
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.role ? (
                          <Badge variant="outline">{contact.role}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.org ? (
                          <Link 
                            to={`/crm/orgs/${contact.org.id}`}
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <Building2 className="h-3 w-3" />
                            {contact.org.name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/crm/contacts/${contact.id}`}>
                            Подробнее
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {contactsData && contactsData.totalPages > 1 && (
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
                    Страница {page} из {contactsData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === contactsData.totalPages}
                  >
                    Вперед
                  </Button>
                </div>
              )}

              {contactsData?.contacts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {search || selectedOrgId 
                      ? 'Контакты не найдены' 
                      : 'Нет контактов'
                    }
                  </p>
                  {selectedOrgId && (
                    <Button className="mt-4" asChild>
                      <Link to={`/crm/contacts/new?orgId=${selectedOrgId}`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить контакт
                      </Link>
                    </Button>
                  )}
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
export default withRole([ROLES.ADMIN, ROLES.CURATOR])(ContactsList);