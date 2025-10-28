import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import apiClient from '../../lib/api';

interface CourseFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    level: string;
    isPublished: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function CourseForm({ initialData, onSuccess, onCancel }: CourseFormProps) {
  const isEditing = !!initialData?.id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    duration: initialData?.duration || 0,
    level: initialData?.level || 'Начальный',
    isPublished: initialData?.isPublished || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPublished: checked
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && initialData?.id) {
        await apiClient.updateCourse(initialData.id, formData);
      } else {
        await apiClient.createCourse(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Ошибка при сохранении курса:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Редактирование курса' : 'Создание нового курса'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название курса</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите название курса"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание курса"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Стоимость (₽)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleNumberChange}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Длительность (часов)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleNumberChange}
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Уровень сложности</Label>
            <Input
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="Например: Начальный, Средний, Продвинутый"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isPublished">Опубликован</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : isEditing ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}