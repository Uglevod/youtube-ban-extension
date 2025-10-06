#!/bin/bash

# Скрипт для создания правильного XPI файла для Firefox

echo "🔧 Создание XPI файла для Firefox"
echo "=================================="

# Удаляем старый XPI если есть
if [ -f "YBan.xpi" ]; then
    echo "🗑️  Удаляем старый XPI файл..."
    rm YBan.xpi
fi

# Создаем временную папку для сборки
TEMP_DIR="temp_xpi"
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
echo "🔍 Проверяем структуру XPI..."
ls -la "$TEMP_DIR/"

# Создаем XPI архив
echo "📦 Создаем XPI архив..."
cd "$TEMP_DIR"
zip -r ../YBan.xpi . -x "*.DS_Store" "*.git*" "test_*" "*.md" "*.sh"
cd ..

# Удаляем временную папку
echo "🧹 Очищаем временные файлы..."
rm -rf "$TEMP_DIR"

# Проверяем созданный XPI
echo "✅ Проверяем созданный XPI..."
echo "📊 Размер файла:"
ls -lh YBan.xpi

echo "📋 Содержимое XPI:"
unzip -l YBan.xpi

echo ""
echo "🎉 XPI файл создан успешно!"
echo "📁 Файл: YBan.xpi"
echo ""
echo "📋 Инструкции по установке:"
echo "1. Откройте Firefox"
echo "2. Перейдите в about:addons"
echo "3. Нажмите 'Установить дополнение из файла'"
echo "4. Выберите файл YBan.xpi"
echo "5. Подтвердите установку"
echo ""
echo "⚠️  Если Firefox показывает 'файл поврежден':"
echo "1. Включите 'about:config'"
echo "2. Найдите 'xpinstall.signatures.required'"
echo "3. Установите значение 'false'"
echo "4. Перезапустите Firefox"
echo "5. Попробуйте установить снова"
