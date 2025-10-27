import { useState } from 'react';
import { GripVertical, Copy, Trash2, Edit, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { QuizEditor } from './QuizEditor';
import { Block } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlockEditorProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (content: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDragStart?: (e: React.DragEvent, blockId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetBlockId: string) => void;
}

export function BlockEditor({ block, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onDragStart, onDragOver, onDrop }: BlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleContentChange = (newContent: any) => {
    onUpdate(newContent);
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'heading':
        return isEditing ? (
          <Input
            value={block.content.text || ''}
            onChange={(e) => handleContentChange({ ...block.content, text: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="text-lg"
            autoFocus
          />
        ) : (
          <h3 
            className="text-lg text-foreground cursor-text hover:bg-accent/50 p-2 rounded"
            onClick={() => setIsEditing(true)}
          >
            {block.content.text || 'Заголовок'}
          </h3>
        );

      case 'text':
        return isEditing ? (
          <Textarea
            value={block.content.text || ''}
            onChange={(e) => handleContentChange({ ...block.content, text: e.target.value })}
            onBlur={() => setIsEditing(false)}
            rows={4}
            autoFocus
          />
        ) : (
          <p 
            className="text-foreground cursor-text hover:bg-accent/50 p-2 rounded whitespace-pre-wrap"
            onClick={() => setIsEditing(true)}
          >
            {block.content.text || 'Текстовый блок'}
          </p>
        );

      case 'image':
        return (
          <div className="space-y-2">
            {block.content.src ? (
              <ImageWithFallback 
                src={block.content.src} 
                alt={block.content.alt || 'Изображение'}
                className="max-w-full h-auto rounded"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-2">
                    <Edit className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Нажмите, чтобы добавить изображение</p>
                </div>
              </div>
            )}
            {block.content.caption && (
              <p className="text-sm text-muted-foreground text-center">{block.content.caption}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-2">
            {block.content.src ? (
              <video 
                controls 
                className="w-full rounded"
                poster={block.content.poster}
              >
                <source src={block.content.src} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-48 bg-muted rounded flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Нажмите, чтобы добавить видео</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-2">
            {block.content.src ? (
              <audio controls className="w-full">
                <source src={block.content.src} type="audio/mp3" />
              </audio>
            ) : (
              <div className="w-full h-16 bg-muted rounded flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Нажмите, чтобы добавить аудио</p>
              </div>
            )}
          </div>
        );

      case 'file':
        return (
          <div className="p-4 bg-muted rounded border-2 border-dashed border-border">
            {block.content.name ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                  📄
                </div>
                <div>
                  <p className="text-sm text-foreground">{block.content.name}</p>
                  <p className="text-xs text-muted-foreground">{block.content.size || 'Неизвестный размер'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Нажмите, чтобы загрузить файл</p>
              </div>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg text-foreground">Квиз</h4>
                <p className="text-sm text-muted-foreground">
                  {block.content.quizId ? 'Квиз настроен' : 'Настройте вопросы для квиза'}
                </p>
              </div>
              <Button onClick={() => setShowQuizEditor(true)}>
                Редактировать вопросы
              </Button>
            </div>
            {block.content.questionsCount && (
              <div className="text-sm text-muted-foreground">
                Вопросов: {block.content.questionsCount}
              </div>
            )}
          </div>
        );

      default:
        return <div className="p-4 bg-muted rounded">Неизвестный тип блока</div>;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    onDragStart?.(e, block.id);
  };



  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    onDragOver?.(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop?.(e, block.id);
  };

  return (
    <>
      <div
        className="w-full"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={(e) => {
          setIsDragging(false);
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Card 
          className={`group hover:shadow-md transition-all cursor-pointer ${
            isSelected ? 'ring-2 ring-blue-500' : ''
          } ${isDragging ? 'opacity-50 scale-95' : ''} ${isDragOver ? 'border-2 border-dashed border-primary' : ''}`}
          onClick={onSelect}
        >
        <CardContent className="p-0">
          <div className="flex">
            {/* Drag Handle */}
            <div className="w-8 flex items-center justify-center py-4 text-muted-foreground hover:text-foreground cursor-grab">
              <GripVertical className="w-4 h-4" />
            </div>
            
            {/* Block Content */}
            <div className="flex-1 p-4">
              {renderBlockContent()}
            </div>
            
            {/* Action Buttons */}
            <div className="w-16 flex flex-col gap-1 p-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="h-7 px-1"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-7 px-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Quiz Editor Modal */}
      {showQuizEditor && block.type === 'quiz' && (
        <QuizEditor
          quizId={block.content.quizId}
          onClose={() => setShowQuizEditor(false)}
          onSave={(quizData) => {
            handleContentChange({
              ...block.content,
              quizId: quizData.id,
              questionsCount: quizData.questions.length
            });
            setShowQuizEditor(false);
          }}
        />
      )}
    </>
  );
}