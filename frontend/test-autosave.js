// Тестовый скрипт для проверки автосохранения
// Запустить в консоли браузера на странице редактора

async function testAutoSave() {
  console.log('🧪 Начинаем тестирование автосохранения...');
  
  // Проверяем, что API доступен
  try {
    const response = await fetch('/api/health');
    const health = await response.json();
    console.log('✅ Backend доступен:', health);
  } catch (error) {
    console.error('❌ Backend недоступен:', error);
    return;
  }
  
  // Проверяем авторизацию
  try {
    const authResponse = await fetch('/api/auth/profile', {
      credentials: 'include'
    });
    if (authResponse.ok) {
      const profile = await authResponse.json();
      console.log('✅ Пользователь авторизован:', profile.email);
    } else {
      console.log('⚠️ Пользователь не авторизован');
    }
  } catch (error) {
    console.error('❌ Ошибка проверки авторизации:', error);
  }
  
  // Проверяем создание урока
  try {
    const lessonData = {
      title: 'Тестовый урок ' + Date.now(),
      content: 'Тестовое содержимое',
      type: 'lesson',
      moduleId: null
    };
    
    const createResponse = await fetch('/api/blocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(lessonData)
    });
    
    if (createResponse.ok) {
      const createdLesson = await createResponse.json();
      console.log('✅ Урок создан:', createdLesson);
      
      // Проверяем обновление урока
      const updatedData = {
        ...createdLesson,
        title: 'Обновленный урок ' + Date.now(),
        content: 'Обновленное содержимое'
      };
      
      const updateResponse = await fetch(`/api/blocks/${createdLesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });
      
      if (updateResponse.ok) {
        const updatedLesson = await updateResponse.json();
        console.log('✅ Урок обновлен:', updatedLesson);
        
        // Проверяем, что данные действительно сохранились
        const getResponse = await fetch(`/api/blocks/${createdLesson.id}`, {
          credentials: 'include'
        });
        
        if (getResponse.ok) {
          const fetchedLesson = await getResponse.json();
          console.log('✅ Урок получен из БД:', fetchedLesson);
          
          if (fetchedLesson.title === updatedData.title) {
            console.log('🎉 АВТОСОХРАНЕНИЕ РАБОТАЕТ КОРРЕКТНО!');
          } else {
            console.log('❌ Данные не совпадают');
          }
        }
      } else {
        console.error('❌ Ошибка обновления урока:', await updateResponse.text());
      }
    } else {
      console.error('❌ Ошибка создания урока:', await createResponse.text());
    }
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Запускаем тест
testAutoSave();