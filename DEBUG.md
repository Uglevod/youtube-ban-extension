# Отладка YouTube Ban Extension

## Проблема: Кнопки не появляются на YouTube

### Шаг 1: Проверьте установку расширения

1. Откройте Firefox
2. Перейдите в `about:debugging`
3. Убедитесь, что расширение загружено и активно
4. Проверьте, что нет ошибок в консоли

### Шаг 2: Проверьте консоль браузера

1. Откройте YouTube
2. Нажмите F12 для открытия инструментов разработчика
3. Перейдите на вкладку "Console"
4. Обновите страницу (F5)
5. Ищите сообщения от расширения:
   - "Обрабатываем элемент:"
   - "Информация о видео:"
   - "Кнопки бана добавлены"

### Шаг 3: Тестирование с test.html

1. Откройте файл `test.html` в браузере
2. Нажмите кнопку "Тест добавления кнопок"
3. Проверьте, появляются ли кнопки
4. Если кнопки появляются в тесте, но не на YouTube - проблема в селекторах

### Шаг 4: Проверка селекторов

Если кнопки не появляются на YouTube, возможно изменилась структура DOM. Проверьте:

1. Откройте YouTube
2. Нажмите F12
3. В консоли выполните:
```javascript
// Проверяем наличие элементов
document.querySelectorAll('ytd-rich-item-renderer').length

// Проверяем селекторы для ссылок на видео
document.querySelectorAll('a[href*="/watch?v="]').length

// Проверяем селекторы для каналов
document.querySelectorAll('a[href*="/@"]').length

// Проверяем контейнер метаданных
document.querySelectorAll('.yt-lockup-metadata-view-model__text-container').length
```

### Шаг 5: Обновление селекторов

Если селекторы не работают, обновите их в `content.js`:

1. Найдите функцию `extractVideoInfo`
2. Обновите селекторы для ссылок на видео и каналы
3. Найдите функцию `addBanButtons`
4. Обновите селектор для контейнера метаданных

### Шаг 6: Проверка стилей

Убедитесь, что стили загружаются:

1. В консоли браузера выполните:
```javascript
// Проверяем, загружены ли стили
document.querySelector('.yt-ban-buttons-container')
```

### Шаг 7: Ручная проверка

Если автоматическое добавление не работает:

1. Откройте консоль браузера на YouTube
2. Выполните код вручную:
```javascript
// Находим первый элемент видео
const element = document.querySelector('ytd-rich-item-renderer');
if (element) {
    // Создаем кнопки
    const container = document.createElement('div');
    container.className = 'yt-ban-buttons-container';
    container.innerHTML = '<button class="yt-ban-btn">🚫 Бан видео</button>';
    
    // Добавляем в элемент
    const metadata = element.querySelector('.yt-lockup-metadata-view-model__text-container');
    if (metadata) {
        metadata.appendChild(container);
        console.log('Кнопки добавлены вручную');
    }
}
```

## Частые проблемы и решения

### Проблема: Расширение не загружается
**Решение:** Проверьте `manifest.json` на ошибки, перезагрузите расширение

### Проблема: Кнопки появляются, но не работают
**Решение:** Проверьте функции `banVideo` и `banChannel` в `content.js`

### Проблема: Баны не сохраняются
**Решение:** Проверьте разрешения в `manifest.json`, убедитесь что `storage` разрешен

### Проблема: Кнопки появляются в неправильном месте
**Решение:** Обновите селектор в функции `addBanButtons`

## Логи отладки

Включите подробное логирование, добавив в начало `content.js`:

```javascript
console.log('YouTube Ban Extension загружен');
console.log('Найдено элементов ytd-rich-item-renderer:', document.querySelectorAll('ytd-rich-item-renderer').length);
```

## Контакты

Если проблема не решается:
1. Проверьте версию Firefox (требуется 60+)
2. Убедитесь, что JavaScript включен
3. Проверьте блокировщики рекламы (могут мешать работе)
4. Попробуйте в режиме инкогнито
