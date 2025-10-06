#!/bin/bash

# Скрипт для создания релиза с готовыми файлами

echo "🚀 Создание релиза v1.0.0"
echo "========================="

# Создаем папку для релиза
RELEASE_DIR="release-v1.0.0"
if [ -d "$RELEASE_DIR" ]; then
    rm -rf "$RELEASE_DIR"
fi

mkdir "$RELEASE_DIR"

echo "📦 Создаем готовые файлы..."

# Создаем все версии
./create-firefox-xpi.sh
./create-chrome-zip.sh
./create-xpi.sh

# Копируем готовые файлы в папку релиза
cp YBan-Firefox.xpi "$RELEASE_DIR/"
cp YBan-Chrome.zip "$RELEASE_DIR/"
cp YBan.xpi "$RELEASE_DIR/"

# Копируем документацию
cp README.md "$RELEASE_DIR/"
cp INSTALL.md "$RELEASE_DIR/"
cp FIREFOX_INSTALL.md "$RELEASE_DIR/"
cp FIREFOX_SIGNATURE_BYPASS.md "$RELEASE_DIR/"

# Создаем README для релиза
cat > "$RELEASE_DIR/RELEASE_NOTES.md" << 'EOF'
# YouTube Ban Extension v1.0.0

## 🎉 Первый релиз!

### Готовые файлы для установки:

- **YBan-Firefox.xpi** (21KB) - Оптимизированная версия для Firefox
- **YBan-Chrome.zip** (21KB) - Версия для Chrome/Chromium  
- **YBan.xpi** (21KB) - Универсальная версия

### ✨ Основные возможности:

- **Компактный интерфейс** - кнопка "Б" разворачивается в панель опций
- **Поддержка боковой панели** - работает с рекомендациями YouTube
- **Адаптивный дизайн** - поддержка мобильных устройств
- **Темная тема** - совместимость с темной темой YouTube

### 🚀 Быстрая установка:

#### Firefox:
1. Откройте `about:config`
2. Найдите `xpinstall.signatures.required`
3. Установите `false`
4. Установите `YBan-Firefox.xpi`

#### Chrome:
1. Откройте `chrome://extensions/`
2. Включите "Режим разработчика"
3. Загрузите `YBan-Chrome.zip`

### 📚 Документация:

- **README.md** - полное руководство
- **INSTALL.md** - инструкции по установке
- **FIREFOX_INSTALL.md** - специально для Firefox
- **FIREFOX_SIGNATURE_BYPASS.md** - решения проблем с подписью

### 🔧 Для разработчиков:

Все скрипты сборки включены в исходный код:
- `create-firefox-xpi.sh` - создание Firefox версии
- `create-chrome-zip.sh` - создание Chrome версии
- `create-xpi.sh` - создание универсальной версии

---

**Приятного использования! 🎊**
EOF

# Создаем ZIP архив релиза
echo "📦 Создаем архив релиза..."
cd "$RELEASE_DIR"
zip -r ../YouTube-Ban-Extension-v1.0.0.zip . -x "*.DS_Store"
cd ..

echo "✅ Релиз создан!"
echo "📁 Папка: $RELEASE_DIR"
echo "📦 Архив: YouTube-Ban-Extension-v1.0.0.zip"
echo ""
echo "📋 Содержимое релиза:"
ls -la "$RELEASE_DIR/"

echo ""
echo "🌐 Загрузите релиз на GitHub:"
echo "1. Перейдите на https://github.com/Uglevod/youtube-ban-extension/releases"
echo "2. Нажмите 'Create a new release'"
echo "3. Выберите тег v1.0.0"
echo "4. Загрузите файлы из папки $RELEASE_DIR"
echo "5. Или загрузите архив YouTube-Ban-Extension-v1.0.0.zip"
