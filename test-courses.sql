-- Создание тестовых курсов для демонстрации

-- Тестовый курс 1: Основы программирования
INSERT INTO "courses" (id, title, description, "authorId", "createdAt", "updatedAt")
VALUES ('course-001', 'Основы программирования', 'Базовый курс по изучению основ программирования', 'curator-001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Тестовый курс 2: Веб-разработка
INSERT INTO "courses" (id, title, description, "authorId", "createdAt", "updatedAt")
VALUES ('course-002', 'Веб-разработка', 'Полный курс по современной веб-разработке', 'curator-001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Тестовый курс 3: Управление проектами
INSERT INTO "courses" (id, title, description, "authorId", "createdAt", "updatedAt")
VALUES ('course-003', 'Управление проектами', 'Курс по эффективному управлению IT-проектами', 'manager-001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Блоки для курса "Основы программирования"
INSERT INTO "blocks" (id, title, content, type, position, "courseId", "createdAt", "updatedAt")
VALUES 
('block-001', 'Введение в программирование', 'Что такое программирование и зачем оно нужно', 'TEXT', 1, 'course-001', NOW(), NOW()),
('block-002', 'Переменные и типы данных', 'Изучаем основные типы данных в программировании', 'TEXT', 2, 'course-001', NOW(), NOW()),
('block-003', 'Практическое задание', 'Создайте свою первую программу', 'TASK', 3, 'course-001', NOW(), NOW()),
('block-004', 'Тест по основам', 'Проверьте свои знания', 'QUIZ', 4, 'course-001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Блоки для курса "Веб-разработка"
INSERT INTO "blocks" (id, title, content, type, position, "courseId", "createdAt", "updatedAt")
VALUES 
('block-005', 'HTML основы', 'Изучаем структуру веб-страниц', 'TEXT', 1, 'course-002', NOW(), NOW()),
('block-006', 'CSS стилизация', 'Делаем страницы красивыми', 'TEXT', 2, 'course-002', NOW(), NOW()),
('block-007', 'JavaScript интерактивность', 'Добавляем динамику на страницы', 'TEXT', 3, 'course-002', NOW(), NOW()),
('block-008', 'Создание сайта', 'Практическое задание по созданию полноценного сайта', 'TASK', 4, 'course-002', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Блоки для курса "Управление проектами"
INSERT INTO "blocks" (id, title, content, type, position, "courseId", "createdAt", "updatedAt")
VALUES 
('block-009', 'Методологии разработки', 'Agile, Scrum, Kanban - что выбрать?', 'TEXT', 1, 'course-003', NOW(), NOW()),
('block-010', 'Планирование проекта', 'Как правильно планировать IT-проекты', 'TEXT', 2, 'course-003', NOW(), NOW()),
('block-011', 'Управление командой', 'Эффективная работа с разработчиками', 'TEXT', 3, 'course-003', NOW(), NOW()),
('block-012', 'Итоговый тест', 'Проверка знаний по управлению проектами', 'QUIZ', 4, 'course-003', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;