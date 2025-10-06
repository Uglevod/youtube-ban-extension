#!/bin/bash

# Скрипт для настройки GitHub репозитория
# Использование: ./setup-github.sh YOUR_GITHUB_USERNAME

if [ $# -eq 0 ]; then
    echo "Использование: $0 YOUR_GITHUB_USERNAME"
    echo "Пример: $0 john-doe"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="youtube-ban-extension"

echo "🚀 Настройка GitHub репозитория для YouTube Ban Extension"
echo "=================================================="

# Проверяем, что мы в правильной директории
if [ ! -f "manifest.json" ]; then
    echo "❌ Ошибка: manifest.json не найден. Убедитесь, что вы в правильной директории."
    exit 1
fi

echo "✅ Найдены файлы расширения"

# Добавляем удаленный репозиторий
echo "📡 Добавляем удаленный репозиторий..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

if [ $? -eq 0 ]; then
    echo "✅ Удаленный репозиторий добавлен"
else
    echo "⚠️  Удаленный репозиторий уже существует или произошла ошибка"
fi

# Отправляем код в GitHub
echo "📤 Отправляем код в GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "🎉 Успешно! Репозиторий создан и код загружен"
    echo "🌐 Ваш репозиторий: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Перейдите на https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "2. Добавьте описание репозитория"
    echo "3. Настройте темы (topics) для лучшей видимости"
    echo "4. Создайте релиз (Release) для распространения"
else
    echo "❌ Ошибка при отправке кода"
    echo "💡 Убедитесь, что:"
    echo "   - Репозиторий создан на GitHub"
    echo "   - У вас есть права на запись"
    echo "   - Вы авторизованы в Git"
    exit 1
fi
