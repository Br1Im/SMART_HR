import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Building2, Users, Plus, Edit, Trash2, Mail, Phone, ExternalLink } from 'lucide-react';

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

interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  orgId: string;
  createdAt: string;
}

interface UpdateOrgData {
  name: string;
  inn: string;
  site?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

interface CreateContactData {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
}

// API функции
const fetchOrganization = async (id: string): Promise<Organization> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/organizations/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Ошибка загрузки организации');
  }
  
  return response.json();
};

const updateOrganization = async (id: string, data: UpdateOrgData): Promise<Organization> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/organizations/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка обновления организации');
  }
  
  return response.json();
};

const createContact = async (data: CreateContactData & { orgId: string }): Promise<Contact> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка создания контакта');
  }
  
  return response.json();
};

const deleteContact = async (id: string): Promise<void> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/contacts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Ошибка удаления контакта');
  }
};

export function OrganizationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [editData, setEditData] = useState<UpdateOrgData>({
    name: '',
    inn: '',
    site: '',
    status: 'ACTIVE',
  });
  const [newContact, setNewContact] = useState<CreateContactData>({
    fullName: '',
    email: '',
    phone: '',
    role: '',
  });

  const queryClient = useQueryClient();

  // Загрузка организации
  const { data: organization, isLoading, error } = useQuery({
    queryKey: ['organization', id],
    queryFn: () => fetchOrganization(id!),
    enabled: !!id,
  });

  // Обновление организации
  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrgData) => updateOrganization(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', id] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  // Создание контакта
  const createContactMutation = useMutation({
    mutationFn: (data: CreateContactData) => createContact({ ...data, orgId: id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', id] });
      setIsContactDialogOpen(false);
      setNewContact({ fullName: '', email: '', phone: '', role: '' });
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  // Удаление контакта
  const deleteContactMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', id] });
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.name || !editData.inn) {
      alert('Заполните обязательные поля');
      return;
    }
    updateMutation.mutate(editData);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.fullName || !newContact.email) {
      alert('Заполните обязательные поля');
      return;
    }
    createContactMutation.mutate(newContact);
  };

  const handleDeleteContact = (contactId: string, contactName: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить контакт "${contactName}"?`)) {
      deleteContactMutation.mutate(contactId);
    }
  };

  const openEditDialog = () => {
    if (organization) {
      setEditData({
        name: organization.name,
        inn: organization.inn,
        site: organization.site || '',
        status: organization.status,
      });
      setIsEditDialogOpen(true);
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
        <div className="text-lg">Загрузка организации...</div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Ошибка загрузки организации</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/crm/orgs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к списку
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Building2 className="w-8 h-8 mr-3 text-blue-600" />
              {organization.name}
            </h1>
            <p className="text-muted-foreground">
              Детальная информация об организации
            </p>
          </div>
        </div>
        
        <Button onClick={openEditDialog}>
          <Edit className="w-4 h-4 mr-2" />
          Редактировать
        </Button>
      </div>

      {/* Информация об организации */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Информация об организации
            {getStatusBadge(organization.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Название</p>
            <p className="font-semibold">{organization.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ИНН</p>
            <p className="font-mono">{organization.inn}</p>
          </div>
          {organization.site && (
            <div>
              <p className="text-sm text-muted-foreground">Сайт</p>
              <a 
                href={organization.site} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                {organization.site}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Создана</p>
            <p>{new Date(organization.createdAt).toLocaleDateString('ru-RU')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Обновлена</p>
            <p>{new Date(organization.updatedAt).toLocaleDateString('ru-RU')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Контакты */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Контакты ({organization.contacts.length})
            </CardTitle>
            
            <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить контакт
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать контакт</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Полное имя *</Label>
                    <Input
                      id="fullName"
                      value={newContact.fullName}
                      onChange={(e) => setNewContact({ ...newContact, fullName: e.target.value })}
                      placeholder="Имя контакта"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Должность</Label>
                    <Input
                      id="role"
                      value={newContact.role}
                      onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                      placeholder="Директор, Менеджер, и т.д."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button type="submit" disabled={createContactMutation.isPending}>
                      {createContactMutation.isPending ? 'Создание...' : 'Создать'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {organization.contacts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет контактов</h3>
              <p className="text-muted-foreground mb-4">
                Добавьте первый контакт для этой организации
              </p>
              <Button onClick={() => setIsContactDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить контакт
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {organization.contacts.map((contact) => (
                <Card key={contact.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold">{contact.fullName}</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id, contact.fullName)}
                      disabled={deleteContactMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                    
                    {contact.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    
                    {contact.role && (
                      <div>
                        <p className="text-muted-foreground">Должность: {contact.role}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-muted-foreground">
                        Добавлен: {new Date(contact.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог редактирования организации */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать организацию</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editName">Название *</Label>
              <Input
                id="editName"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Название организации"
                required
              />
            </div>
            <div>
              <Label htmlFor="editInn">ИНН *</Label>
              <Input
                id="editInn"
                value={editData.inn}
                onChange={(e) => setEditData({ ...editData, inn: e.target.value })}
                placeholder="ИНН организации"
                required
              />
            </div>
            <div>
              <Label htmlFor="editSite">Сайт</Label>
              <Input
                id="editSite"
                value={editData.site}
                onChange={(e) => setEditData({ ...editData, site: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="editStatus">Статус</Label>
              <Select value={editData.status} onValueChange={(value: any) => setEditData({ ...editData, status: value })}>
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