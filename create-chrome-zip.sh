#!/bin/bash

# Скрипт для создания ZIP файла для Chrome

echo "🔧 Создание ZIP файла для Chrome"
echo "================================="

# Удаляем старый ZIP если есть
if [ -f "YBan-Chrome.zip" ]; then
    echo "🗑️  Удаляем старый ZIP файл..."
    rm YBan-Chrome.zip
fi

# Создаем временную папку для сборки
TEMP_DIR="temp_chrome"
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

echo "📁 Создаем временную папку..."
mkdir "$TEMP_DIR"

# Копируем только необходимые файлы для расширения
echo "📋 Копируем файлы расширения..."

# Основные файлы
cp manifest.json "$TEMP_DIR/"
cp background.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp popup.css "$TEMP_DIR/"
cp styles.css "$TEMP_DIR/"

# Папка с иконками
cp -r icons "$TEMP_DIR/"

# Проверяем структуру
echo "🔍 Проверяем структуру ZIP..."
ls -la "$TEMP_DIR/"

# Создаем ZIP архив
echo "📦 Создаем ZIP архив..."
cd "$TEMP_DIR"
zip -r ../YBan-Chrome.zip . -x "*.DS_Store" "*.git*" "test_*" "*.md" "*.sh"
cd ..

# Удаляем временную папку
echo "🧹 Очищаем временные файлы..."
rm -rf "$TEMP_DIR"

# Проверяем созданный ZIP
echo "✅ Проверяем созданный ZIP..."
echo "📊 Размер файла:"
ls -lh YBan-Chrome.zip

echo ""
echo "🎉 ZIP файл для Chrome создан успешно!"
echo "📁 Файл: YBan-Chrome.zip"
echo ""
echo "📋 Инструкции по установке в Chrome:"
echo "1. Откройте Chrome"
echo "2. Перейдите в chrome://extensions/"
echo "3. Включите 'Режим разработчика'"
echo "4. Нажмите 'Загрузить распакованное расширение'"
echo "5. Выберите папку с распакованным ZIP"
echo ""
echo "📋 Или установите ZIP файл:"
echo "1. Распакуйте YBan-Chrome.zip"
echo "2. Следуйте инструкциям выше"
