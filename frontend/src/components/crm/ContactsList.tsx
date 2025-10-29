import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, Edit, Plus, Users, Mail, Phone, Building2 } from 'lucide-react';

interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  orgId: string;
  createdAt: string;
  org: {
    id: string;
    name: string;
  };
}

interface Organization {
  id: string;
  name: string;
}

interface CreateContactData {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  orgId: string;
}

interface UpdateContactData {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  orgId: string;
}

// API функции
const fetchContacts = async (): Promise<Contact[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/contacts', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Ошибка загрузки контактов');
  }
  
  return response.json();
};

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

const createContact = async (data: CreateContactData): Promise<Contact> => {
  const token = localStorage.getItem('token');
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

const updateContact = async (id: string, data: UpdateContactData): Promise<Contact> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/contacts/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка обновления контакта');
  }
  
  return response.json();
};

const deleteContact = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
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

export function ContactsList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('all');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<CreateContactData>({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    orgId: '',
  });
  const [editContact, setEditContact] = useState<UpdateContactData>({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    orgId: '',
  });

  const queryClient = useQueryClient();

  // Загрузка контактов
  const { data: contacts = [], isLoading: contactsLoading, error: contactsError } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });

  // Загрузка организаций для селекта
  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });

  // Создание контакта
  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsCreateDialogOpen(false);
      setNewContact({ fullName: '', email: '', phone: '', role: '', orgId: '' });
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  // Обновление контакта
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactData }) => updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsEditDialogOpen(false);
      setEditingContact(null);
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  // Удаление контакта
  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: Error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  // Фильтрация контактов
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.org.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrg = selectedOrgFilter === 'all' || contact.orgId === selectedOrgFilter;
    
    return matchesSearch && matchesOrg;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.fullName || !newContact.email || !newContact.orgId) {
      alert('Заполните обязательные поля');
      return;
    }
    createMutation.mutate(newContact);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContact.fullName || !editContact.email || !editContact.orgId || !editingContact) {
      alert('Заполните обязательные поля');
      return;
    }
    updateMutation.mutate({ id: editingContact.id, data: editContact });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить контакт "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setEditContact({
      fullName: contact.fullName,
      email: contact.email,
      phone: contact.phone || '',
      role: contact.role,
      orgId: contact.orgId,
    });
    setIsEditDialogOpen(true);
  };

  if (contactsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка контактов...</div>
      </div>
    );
  }

  if (contactsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Ошибка загрузки контактов</div>
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
            Управление контактами в CRM системе
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
            <form onSubmit={handleCreateSubmit} className="space-y-4">
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
              <div>
                <Label htmlFor="orgId">Организация *</Label>
                <Select value={newContact.orgId} onValueChange={(value) => setNewContact({ ...newContact, orgId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите организацию" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
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

      {/* Фильтры */}
      <div className="flex space-x-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Поиск по имени, email, должности или организации..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-64">
          <Select value={selectedOrgFilter} onValueChange={setSelectedOrgFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по организации" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все организации</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Список контактов */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                {contact.fullName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a 
                  href={`mailto:${contact.email}`} 
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {contact.phone}
                  </a>
                </div>
              )}
              
              {contact.role && (
                <div>
                  <p className="text-sm text-muted-foreground">Должность</p>
                  <p>{contact.role}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">Организация</p>
                <Link 
                  to={`/crm/orgs/${contact.orgId}`}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Building2 className="w-4 h-4 mr-1" />
                  {contact.org.name}
                </Link>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Добавлен</p>
                <p>{new Date(contact.createdAt).toLocaleDateString('ru-RU')}</p>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditDialog(contact)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Редактировать
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(contact.id, contact.fullName)}
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

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Контакты не найдены</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedOrgFilter !== 'all' 
              ? 'Попробуйте изменить фильтры поиска' 
              : 'Создайте первый контакт'
            }
          </p>
          {!searchTerm && selectedOrgFilter === 'all' && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить контакт
            </Button>
          )}
        </div>
      )}

      {/* Диалог редактирования контакта */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать контакт</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editFullName">Полное имя *</Label>
              <Input
                id="editFullName"
                value={editContact.fullName}
                onChange={(e) => setEditContact({ ...editContact, fullName: e.target.value })}
                placeholder="Имя контакта"
                required
              />
            </div>
            <div>
              <Label htmlFor="editEmail">Email *</Label>
              <Input
                id="editEmail"
                type="email"
                value={editContact.email}
                onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="editPhone">Телефон</Label>
              <Input
                id="editPhone"
                value={editContact.phone}
                onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <Label htmlFor="editRole">Должность</Label>
              <Input
                id="editRole"
                value={editContact.role}
                onChange={(e) => setEditContact({ ...editContact, role: e.target.value })}
                placeholder="Директор, Менеджер, и т.д."
              />
            </div>
            <div>
              <Label htmlFor="editOrgId">Организация *</Label>
              <Select value={editContact.orgId} onValueChange={(value) => setEditContact({ ...editContact, orgId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите организацию" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
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