import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Plus, 
  Save, 
  ArrowLeft, 
  Type, 
  AlignLeft, 
  Image, 
  Video, 
  Music, 
  FileText, 
  HelpCircle,
  GripVertical,
  Copy,
  Trash2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Lesson, Block, Status } from '../types';
import { BlockEditor } from './BlockEditor';
import { QuizEditor } from './QuizEditor';

interface NewLessonEditorProps {
  moduleId: string;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

const blockTypes = [
  { id: 'heading', label: 'Заголовок', icon: Type },
  { id: 'text', label: 'Текст', icon: AlignLeft },
  { id: 'image', label: 'Изображение', icon: Image },
  { id: 'video', label: 'Видео', icon: Video },
  { id: 'audio', label: 'Аудио', icon: Music },
  { id: 'file', label: 'Файл', icon: FileText },
  { id: 'quiz', label: 'Тест', icon: HelpCircle },
];

const NewLessonEditor: React.FC<NewLessonEditorProps> = ({ moduleId, onSave, onCancel }) => {
  const [lesson, setLesson] = useState<Lesson>({
    id: '',
    title: '',
    moduleId,
    order: 1,
    status: 'draft' as Status,
    blocks: []
  });

  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [editingQuizBlockId, setEditingQuizBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Генерация уникального ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Добавление нового блока
  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: generateId(),
      type: type as Block['type'],
      content: getDefaultContent(type),
      order: lesson.blocks.length + 1,
      lessonId: lesson.id || generateId()
    };

    setLesson(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));

    // Автоматически начинаем редактирование нового блока
    setEditingBlockId(newBlock.id);
  };

  // Получение контента по умолчанию для типа блока
  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'heading':
        return { text: 'Новый заголовок' };
      case 'text':
        return { text: 'Введите текст...' };
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'video':
        return { url: '', title: '', description: '' };
      case 'audio':
        return { url: '', title: '', description: '' };
      case 'file':
        return { url: '', name: '', description: '' };
      case 'quiz':
        return { quizId: '' };
      default:
        return {};
    }
  };

  // Обновление блока
  const updateBlock = (blockId: string, content: any) => {
    setLesson(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, content } : block
      )
    }));
  };

  // Дублирование блока
  const duplicateBlock = (blockId: string) => {
    const blockToDuplicate = lesson.blocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;

    const newBlock: Block = {
      ...blockToDuplicate,
      id: generateId(),
      order: blockToDuplicate.order + 1
    };

    setLesson(prev => ({
      ...prev,
      blocks: [
        ...prev.blocks.slice(0, blockToDuplicate.order),
        newBlock,
        ...prev.blocks.slice(blockToDuplicate.order).map(b => ({ ...b, order: b.order + 1 }))
      ]
    }));
  };

  // Удаление блока
  const deleteBlock = (blockId: string) => {
    setLesson(prev => ({
      ...prev,
      blocks: prev.blocks
        .filter(b => b.id !== blockId)
        .map((b, index) => ({ ...b, order: index + 1 }))
    }));
  };

  // Обработка перетаскивания
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(lesson.blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Обновляем порядок
    const updatedBlocks = items.map((block, index) => ({
      ...block,
      order: index + 1
    }));

    setLesson(prev => ({
      ...prev,
      blocks: updatedBlocks
    }));
  };

  // Сохранение урока
  const handleSave = async () => {
    if (!lesson.title.trim()) {
      alert('Пожалуйста, введите название урока');
      return;
    }

    setIsSaving(true);
    try {
      const lessonToSave: Lesson = {
        ...lesson,
        id: lesson.id || generateId()
      };
      
      await onSave(lessonToSave);
    } catch (error) {
      console.error('Ошибка при сохранении урока:', error);
      alert('Ошибка при сохранении урока');
    } finally {
      setIsSaving(false);
    }
  };

  // Обработка редактирования теста
  const handleQuizEdit = (blockId: string) => {
    setEditingQuizBlockId(blockId);
    setShowQuizEditor(true);
  };

  const handleQuizSave = (quizData: any) => {
    if (editingQuizBlockId) {
      updateBlock(editingQuizBlockId, { quizId: quizData.id });
    }
    setShowQuizEditor(false);
    setEditingQuizBlockId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Создание нового урока</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Черновик</Badge>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {/* Основная информация об уроке */}
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lesson-title">Название урока</Label>
            <Input
              id="lesson-title"
              value={lesson.title}
              onChange={(e) => setLesson(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Введите название урока"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="lesson-status">Статус</Label>
            <Select
              value={lesson.status}
              onValueChange={(value: Status) => setLesson(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="published">Опубликован</SelectItem>
                <SelectItem value="hidden">Скрыт</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Блоки урока */}
      <Card>
        <CardHeader>
          <CardTitle>Содержание урока</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Кнопки добавления блоков */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Добавить блок:</Label>
            <div className="flex flex-wrap gap-2">
              {blockTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock(type.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Список блоков */}
          {lesson.blocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Урок пока не содержит блоков</p>
              <p className="text-sm">Добавьте первый блок, используя кнопки выше</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="blocks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {lesson.blocks
                      .sort((a, b) => a.order - b.order)
                      .map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative ${snapshot.isDragging ? 'opacity-50' : ''}`}
                            >
                              <Card className="relative">
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    {/* Drag handle */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="flex-shrink-0 mt-2 cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="h-5 w-5 text-gray-400" />
                                    </div>

                                    {/* Block content */}
                                    <div className="flex-1 min-w-0">
                                      <BlockEditor
                                        block={block}
                                        isEditing={editingBlockId === block.id}
                                        onEdit={() => setEditingBlockId(block.id)}
                                        onSave={(content) => {
                                          updateBlock(block.id, content);
                                          setEditingBlockId(null);
                                        }}
                                        onCancel={() => setEditingBlockId(null)}
                                        onQuizEdit={() => handleQuizEdit(block.id)}
                                      />
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex-shrink-0 flex items-center space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => duplicateBlock(block.id)}
                                        title="Дублировать"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteBlock(block.id)}
                                        title="Удалить"
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Quiz Editor Modal */}
      {showQuizEditor && (
        <QuizEditor
          isOpen={showQuizEditor}
          onClose={() => {
            setShowQuizEditor(false);
            setEditingQuizBlockId(null);
          }}
          onSave={handleQuizSave}
        />
      )}
    </div>
  );
};

export default NewLessonEditor;