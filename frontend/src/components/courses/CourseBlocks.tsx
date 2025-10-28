import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Box, Button, Card, CardContent, Typography, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import apiClient from '../../lib/api';
import { Block } from '../../types';

type BlockType = 'TEXT' | 'VIDEO' | 'QUIZ' | 'ASSIGNMENT';

interface CourseBlocksProps {
  courseId: string;
}

const CourseBlocks: React.FC<CourseBlocksProps> = ({ courseId }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<Partial<Block>>({
    title: '',
    content: '',
    type: 'TEXT',
    courseId
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadBlocks();
  }, [courseId]);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getBlocks(courseId);
      setBlocks(data);
    } catch (error) {
      console.error('Ошибка при загрузке блоков:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (block?: Block) => {
    if (block) {
      setCurrentBlock(block);
      setIsEditing(true);
    } else {
      setCurrentBlock({ title: '', content: '', type: 'TEXT', courseId });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBlock({ title: '', content: '', type: 'TEXT', courseId });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setCurrentBlock(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBlock = async () => {
    try {
      if (!currentBlock.title) {
        alert('Пожалуйста, введите название блока');
        return;
      }

      if (isEditing && currentBlock.id) {
        await apiClient.updateBlock(currentBlock.id, currentBlock as Block);
      } else {
        await apiClient.createBlock({
          ...currentBlock,
          position: blocks.length,
        } as Block);
      }
      loadBlocks();
      handleCloseDialog();
    } catch (error) {
      console.error('Ошибка при сохранении блока:', error);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот блок?')) {
      try {
        await apiClient.deleteBlock(id);
        loadBlocks();
      } catch (error) {
        console.error('Ошибка при удалении блока:', error);
      }
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Обновляем позиции
    const updatedBlocks = items.map((item, index) => ({
      ...item,
      position: index
    }));
    
    setBlocks(updatedBlocks);
    
    // Отправляем обновленные позиции на сервер
    try {
      await apiClient.reorderBlocks(updatedBlocks.map(block => ({
        id: block.id,
        position: block.position
      })));
    } catch (error) {
      console.error('Ошибка при обновлении позиций:', error);
      loadBlocks(); // Перезагружаем блоки в случае ошибки
    }
  };

  const getBlockTypeLabel = (type: BlockType): string => {
    switch (type) {
      case 'TEXT': return 'Текст';
      case 'VIDEO': return 'Видео';
      case 'QUIZ': return 'Тест';
      case 'ASSIGNMENT': return 'Задание';
      default: return type;
    }
  };

  if (loading) {
    return <Typography>Загрузка блоков...</Typography>;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Блоки курса</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Добавить блок
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {blocks.length === 0 ? (
                <Typography>Блоки отсутствуют. Добавьте первый блок!</Typography>
              ) : (
                blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided) => (
                      <Card 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ mb: 2 }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box {...provided.dragHandleProps} sx={{ mr: 2 }}>
                            <DragIndicatorIcon />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{block.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {getBlockTypeLabel(block.type as BlockType)}
                            </Typography>
                            {block.content && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {block.content.length > 100 
                                  ? `${block.content.substring(0, 100)}...` 
                                  : block.content}
                              </Typography>
                            )}
                          </Box>
                          <Box>
                            <IconButton onClick={() => handleOpenDialog(block)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteBlock(block.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Редактировать блок' : 'Добавить блок'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Название блока"
            fullWidth
            variant="outlined"
            value={currentBlock.title || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="block-type-label">Тип блока</InputLabel>
            <Select
              labelId="block-type-label"
              name="type"
              value={currentBlock.type || 'TEXT'}
              label="Тип блока"
              onChange={handleInputChange}
            >
              <MenuItem value="TEXT">Текст</MenuItem>
              <MenuItem value="VIDEO">Видео</MenuItem>
              <MenuItem value="QUIZ">Тест</MenuItem>
              <MenuItem value="ASSIGNMENT">Задание</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="content"
            label="Содержимое"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={currentBlock.content || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSaveBlock} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseBlocks;