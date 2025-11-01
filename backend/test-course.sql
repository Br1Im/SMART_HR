-- Создание тестового курса
INSERT INTO "courses" (id, title, description, level, "isPublished", "authorId", "createdAt", "updatedAt")
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  'Тестовый курс для отладки',
  'Курс для тестирования создания модулей',
  'BEGINNER',
  0,
  u.id,
  datetime('now'),
  datetime('now')
FROM "users" u 
WHERE u.email = 'admin@smartcourse.ru'
AND NOT EXISTS (
  SELECT 1 FROM "courses" WHERE id = '550e8400-e29b-41d4-a716-446655440000'
);