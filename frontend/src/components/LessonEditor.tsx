import { useState } from 'react';
import { Link, ArrowUp, ArrowDown, Copy, Trash2, Plus, Type, Heading, Image, Video, Volume2, File, HelpCircle, Undo, Redo } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { StatusIcon } from './StatusIcon';
import { BlockEditor } from './BlockEditor';
import { QuizEditor } from './QuizEditor';
import { Lesson, Block } from '../types';

interface LessonEditorProps {
  lesson: Lesson;
  onLessonUpdate: (lesson: Lesson) => void;
}

export function LessonEditor({ lesson, onLessonUpdate }: LessonEditorProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [lessonTitle, setLessonTitle] = useState(lesson.title);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const blockTypes = [
    { type: 'text', label: 'Текст', icon: Type },
    { type: 'heading', label: 'Заголовок', icon: Heading },
    { type: 'image', label: 'Изображение', icon: Image },
    { type: 'video', label: 'Видео', icon: Video },
    { type: 'audio', label: 'Аудио', icon: Volume2 },
    { type: 'file', label: 'Файл', icon: File },
    { type: 'quiz', label: 'Квиз', icon: HelpCircle },
  ];

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: type as Block['type'],
      content: type === 'text' ? { text: 'Новый текстовый блок' } :
               type === 'heading' ? { text: 'Новый заголовок' } :
               type === 'quiz' ? { quizId: null } : {},
      order: lesson.blocks.length + 1,
      lessonId: lesson.id
    };

    const updatedLesson = {
      ...lesson,
      blocks: [...lesson.blocks, newBlock]
    };
    onLessonUpdate(updatedLesson);
    setSelectedBlock(newBlock);
  };

  const updateBlock = (blockId: string, content: any) => {
    const updatedBlocks = lesson.blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    );
    const updatedLesson = { ...lesson, blocks: updatedBlocks };
    onLessonUpdate(updatedLesson);
    
    // Update selected block if it's the one being edited
    if (selectedBlock?.id === blockId) {
      setSelectedBlock({ ...selectedBlock, content });
    }
  };

  const deleteBlock = (blockId: string) => {
    const updatedBlocks = lesson.blocks.filter(block => block.id !== blockId);
    const updatedLesson = { ...lesson, blocks: updatedBlocks };
    onLessonUpdate(updatedLesson);
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const duplicateBlock = (blockId: string) => {
    const blockToDuplicate = lesson.blocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;
    
    const newBlock: Block = {
      ...blockToDuplicate,
      id: Date.now().toString(),
      order: blockToDuplicate.order + 1
    };
    
    const updatedBlocks = [...lesson.blocks, newBlock].sort((a, b) => a.order - b.order);
    const updatedLesson = { ...lesson, blocks: updatedBlocks };
    onLessonUpdate(updatedLesson);
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    const draggedBlockId = e.dataTransfer.getData('text/plain');
    
    if (draggedBlockId === targetBlockId) return;
    
    const draggedBlock = lesson.blocks.find(b => b.id === draggedBlockId);
    const targetBlock = lesson.blocks.find(b => b.id === targetBlockId);
    
    if (!draggedBlock || !targetBlock) return;
    
    const updatedBlocks = lesson.blocks.map(block => {
      if (block.id === draggedBlockId) {
        return { ...block, order: targetBlock.order };
      } else if (draggedBlock.order < targetBlock.order && block.order > draggedBlock.order && block.order <= targetBlock.order) {
        return { ...block, order: block.order - 1 };
      } else if (draggedBlock.order > targetBlock.order && block.order < draggedBlock.order && block.order >= targetBlock.order) {
        return { ...block, order: block.order + 1 };
      }
      return block;
    });
    
    const updatedLesson = { ...lesson, blocks: updatedBlocks.sort((a, b) => a.order - b.order) };
    onLessonUpdate(updatedLesson);
  };

  const saveTitle = () => {
    const updatedLesson = { ...lesson, title: lessonTitle };
    onLessonUpdate(updatedLesson);
    setIsEditingTitle(false);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex-1 flex">
      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Lesson Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Link className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <StatusIcon status={lesson.status} />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {isSaving ? (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Сохранено</span>
                  </>
                )}
              </div>
              <Button variant="ghost" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Lesson Title */}
          {isEditingTitle ? (
            <div className="flex gap-2">
              <Input
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                className="text-lg"
                autoFocus
              />
              <Button size="sm" onClick={saveTitle}>Сохранить</Button>
            </div>
          ) : (
            <h2 
              className="text-lg text-foreground cursor-pointer hover:text-primary"
              onClick={() => setIsEditingTitle(true)}
            >
              {lesson.title}
            </h2>
          )}
        </div>

        {/* Add Block Buttons */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground mr-2">Добавить блок:</span>
            {blockTypes.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant="outline" 
                size="sm"
                onClick={() => addBlock(type)}
                className="h-8"
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Blocks Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {lesson.blocks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg text-foreground mb-2">Урок пуст</h3>
              <p className="text-muted-foreground mb-4">Добавьте блоки контента, чтобы создать урок</p>
            </div>
          ) : (
            lesson.blocks.map((block) => (
              <BlockEditor
                key={block.id}
                block={block}
                isSelected={selectedBlock?.id === block.id}
                onSelect={() => setSelectedBlock(block)}
                onUpdate={(content) => updateBlock(block.id, content)}
                onDelete={() => deleteBlock(block.id)}
                onDuplicate={() => duplicateBlock(block.id)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Properties Panel */}
      {selectedBlock && (
        <div className="w-80 bg-card border-l border-border p-4">
          <h3 className="text-sm text-foreground mb-4">Свойства блока</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Тип блока</label>
              <Badge variant="secondary" className="mt-1">
                {blockTypes.find(t => t.type === selectedBlock.type)?.label}
              </Badge>
            </div>

            {selectedBlock.type === 'image' && (
              <>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Alt-текст</label>
                  <Input
                    placeholder="Описание изображения"
                    value={selectedBlock.content.alt || ''}
                    onChange={(e) => updateBlock(selectedBlock.id, { ...selectedBlock.content, alt: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Подпись</label>
                  <Input
                    placeholder="Подпись к изображению"
                    value={selectedBlock.content.caption || ''}
                    onChange={(e) => updateBlock(selectedBlock.id, { ...selectedBlock.content, caption: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {selectedBlock.type === 'video' && (
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Автозапуск</label>
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={selectedBlock.content.autoplay || false}
                    onChange={(e) => updateBlock(selectedBlock.id, { ...selectedBlock.content, autoplay: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Автоматически запускать видео</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}