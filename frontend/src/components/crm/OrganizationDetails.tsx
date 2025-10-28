import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  Users, 
  Phone, 
  Mail, 
  Plus,
  Edit,
  ExternalLink 
} from 'lucide-react';
import { CrmLayout } from '../layout/CrmLayout';
import { withRole, ROLES } from '../../hoc';

interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  inn: string;
  site?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  contacts: Contact[];
}

const fetchOrganization = async (id: string): Promise<Organization> => {
  const response = await fetch(`/api/organizations/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organization');
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

export const OrganizationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: organization, isLoading, error } = useQuery({
    queryKey: ['organization', id],
    queryFn: () => fetchOrganization(id!),
    enabled: !!id,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/crm/orgs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Ошибка загрузки организации: {(error as Error).message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/crm/orgs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/crm/orgs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Организация не найдена
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CrmLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/crm/orgs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              {organization.name}
            </h1>
            <p className="text-muted-foreground">
              ИНН: {organization.inn}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/crm/orgs/${organization.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Редактировать
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Детали</TabsTrigger>
          <TabsTrigger value="contacts">
            Контакты ({organization.contacts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Информация об организации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Название
                    </label>
                    <p className="text-lg font-medium">{organization.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      ИНН
                    </label>
                    <p className="font-mono">{organization.inn}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Статус
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(organization.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Веб-сайт
                    </label>
                    {organization.site ? (
                      <div className="mt-1">
                        <a 
                          href={organization.site} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <Globe className="h-4 w-4" />
                          {organization.site}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Не указан</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Дата создания
                    </label>
                    <p>{new Date(organization.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Последнее обновление
                    </label>
                    <p>{new Date(organization.updatedAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Контакты организации
                </CardTitle>
                <Button asChild>
                  <Link to={`/crm/contacts/new?orgId=${organization.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить контакт
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {organization.contacts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Должность</TableHead>
                      <TableHead>Добавлен</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organization.contacts.map((contact) => (
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>У этой организации пока нет контактов</p>
                  <Button className="mt-4" asChild>
                    <Link to={`/crm/contacts/new?orgId=${organization.id}`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить первый контакт
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </CrmLayout>
  );
};

// Экспортируем компонент с проверкой ролей
export default withRole([ROLES.ADMIN, ROLES.CURATOR])(OrganizationDetails);