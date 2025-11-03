SELECT email, LEFT(password, 30) as password_start, role 
FROM users 
WHERE email = 'admin@smartcourse.ru';