#!/bin/bash

# Скрипт для создания оптимизированного XPI файла для Firefox

echo "🦊 Создание XPI файла для Firefox"
echo "=================================="

# Удаляем старый XPI если есть
if [ -f "YBan-Firefox.xpi" ]; then
    echo "🗑️  Удаляем старый XPI файл..."
    rm YBan-Firefox.xpi
fi

# Создаем временную папку для сборки
TEMP_DIR="temp_firefox"
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

echo "📁 Создаем временную папку..."
mkdir "$TEMP_DIR"

# Копируем только необходимые файлы для расширения
echo "📋 Копируем файлы расширения..."

# Используем специальный манифест для Firefox
cp manifest-firefox.json "$TEMP_DIR/manifest.json"
cp background.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp popup.css "$TEMP_DIR/"
cp styles.css "$TEMP_DIR/"

# Папка с иконками
cp -r icons "$TEMP_DIR/"

# Проверяем структуру
echo "🔍 Проверяем структуру XPI..."
ls -la "$TEMP_DIR/"

# Создаем XPI архив
echo "📦 Создаем XPI архив..."
cd "$TEMP_DIR"
zip -r ../YBan-Firefox.xpi . -x "*.DS_Store" "*.git*" "test_*" "*.md" "*.sh"
cd ..

# Удаляем временную папку
echo "🧹 Очищаем временные файлы..."
rm -rf "$TEMP_DIR"

# Проверяем созданный XPI
echo "✅ Проверяем созданный XPI..."
echo "📊 Размер файла:"
ls -lh YBan-Firefox.xpi

echo "📋 Содержимое XPI:"
unzip -l YBan-Firefox.xpi

echo ""
echo "🎉 XPI файл для Firefox создан успешно!"
echo "📁 Файл: YBan-Firefox.xpi"
echo ""
echo "📋 Инструкции по установке в Firefox:"
echo "1. Откройте Firefox"
echo "2. Перейдите в about:addons"
echo "3. Нажмите 'Установить дополнение из файла'"
echo "4. Выберите файл YBan-Firefox.xpi"
echo "5. Подтвердите установку"
echo ""
echo "⚠️  Если Firefox показывает 'файл поврежден':"
echo "1. Откройте about:config"
echo "2. Найдите 'xpinstall.signatures.required'"
echo "3. Установите значение 'false'"
echo "4. Перезапустите Firefox"
echo "5. Попробуйте установить снова"
echo ""
echo "🔧 Альтернативный способ (временная установка):"
echo "1. Откройте about:debugging"
echo "2. Нажмите 'Этот Firefox'"
echo "3. Нажмите 'Загрузить временное дополнение'"
echo "4. Выберите файл manifest.json из папки проекта"
echo ""
echo "📝 Особенности Firefox версии:"
echo "✅ Оптимизированный манифест для Firefox"
echo "✅ Поддержка Firefox 78+"
echo "✅ Правильные иконки для всех размеров"
echo "✅ Content Security Policy"
echo "✅ Web Accessible Resources"
