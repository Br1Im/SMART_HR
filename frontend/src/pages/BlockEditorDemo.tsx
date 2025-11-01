import { useState } from 'react';
import { BlockEditor } from '../components/BlockEditor';
import { Block } from '../types';

// Мок-данные для демонстрации различных типов блоков
const mockBlocks: Block[] = [
  {
    id: 'block-1',
    type: 'heading',
    content: {
      text: 'Заголовок урока'
    },
    order: 1
  },
  {
    id: 'block-2',
    type: 'text',
    content: {
      text: 'Это текстовый блок с примером содержимого. Здесь может быть любой текст, который описывает материал урока. Текст может быть многострочным и содержать различную информацию для студентов.'
    },
    order: 2
  },
  {
    id: 'block-3',
    type: 'image',
    content: {
      src: 'https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=Пример+изображения',
      alt: 'Пример изображения',
      caption: 'Подпись к изображению'
    },
    order: 3
  },
  {
    id: 'block-4',
    type: 'video',
    content: {
      src: '',
      poster: 'https://via.placeholder.com/600x300/059669/FFFFFF?text=Видео+блок'
    },
    order: 4
  },
  {
    id: 'block-5',
    type: 'audio',
    content: {
      src: ''
    },
    order: 5
  },
  {
    id: 'block-6',
    type: 'file',
    content: {
      name: 'Документ_урока.pdf',
      size: '2.5 MB',
      url: '#'
    },
    order: 6
  },
  {
    id: 'block-7',
    type: 'quiz',
    content: {
      quizId: 'quiz-1',
      questionsCount: 5
    },
    order: 7
  },
  {
    id: 'block-8',
    type: 'text',
    content: {
      text: 'Еще один текстовый блок для демонстрации'
    },
    order: 8
  }
];

function BlockEditorDemo() {
  const [blocks, setBlocks] = useState<Block[]>(mockBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleBlockUpdate = (blockId: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, content: { ...block.content, ...content } }
        : block
    ));
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleBlockDuplicate = (blockId: string) => {
    const blockToDuplicate = blocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        id: `${blockToDuplicate.id}-copy-${Date.now()}`,
        order: blockToDuplicate.order + 0.5
      };
      setBlocks([...blocks, newBlock].sort((a, b) => a.order - b.order));
    }
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('text/plain', blockId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    const draggedBlockId = e.dataTransfer.getData('text/plain');
    
    if (draggedBlockId === targetBlockId) return;

    const draggedBlock = blocks.find(block => block.id === draggedBlockId);
    const targetBlock = blocks.find(block => block.id === targetBlockId);
    
    if (draggedBlock && targetBlock) {
      const newBlocks = blocks.map(block => {
        if (block.id === draggedBlockId) {
          return { ...block, order: targetBlock.order };
        }
        if (block.id === targetBlockId) {
          return { ...block, order: draggedBlock.order };
        }
        return block;
      });
      
      setBlocks(newBlocks.sort((a, b) => a.order - b.order));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок страницы */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Демо BlockEditor
            </h1>
            <p className="text-muted-foreground">
              Просмотр дизайна и функциональности компонента BlockEditor
            </p>
          </div>

          {/* Список блоков */}
          <div className="space-y-4">
            {blocks.map((block) => (
              <BlockEditor
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => setSelectedBlockId(block.id)}
                onUpdate={(content) => handleBlockUpdate(block.id, content)}
                onDelete={() => handleBlockDelete(block.id)}
                onDuplicate={() => handleBlockDuplicate(block.id)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>

          {/* Информация о демо */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Возможности BlockEditor:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Редактирование:</strong> Кликните на текст для редактирования</li>
              <li>• <strong>Перетаскивание:</strong> Используйте иконку захвата для изменения порядка</li>
              <li>• <strong>Дублирование:</strong> Кнопка копирования создает копию блока</li>
              <li>• <strong>Удаление:</strong> Кнопка корзины удаляет блок</li>
              <li>• <strong>Типы блоков:</strong> Заголовок, текст, изображение, видео, аудио, файл, квиз</li>
              <li>• <strong>Выделение:</strong> Кликните на блок для выделения</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockEditorDemo;