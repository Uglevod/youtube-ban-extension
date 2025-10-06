#!/bin/bash

# Скрипт для настройки Firefox для разработки расширений
# Автоматически отключает проверку подписи и создает профиль разработчика

echo "🦊 Настройка Firefox для разработки расширений"
echo "=============================================="

# Проверяем, запущен ли Firefox
if pgrep -x "firefox" > /dev/null; then
    echo "⚠️  Firefox запущен. Закройте Firefox перед продолжением."
    echo "Нажмите Enter когда закроете Firefox..."
    read
fi

# Создаем профиль разработчика
echo "📁 Создаем профиль разработчика..."
PROFILE_DIR="$HOME/.mozilla/firefox/developer"
mkdir -p "$PROFILE_DIR"

# Создаем prefs.js с отключенной проверкой подписи
echo "⚙️  Настраиваем отключение проверки подписи..."
cat > "$PROFILE_DIR/prefs.js" << 'EOF'
// Отключение проверки подписи расширений
user_pref("xpinstall.signatures.required", false);
user_pref("extensions.checkUpdateSecurity", false);
user_pref("extensions.autoDisableScopes", 0);
user_pref("extensions.enabledScopes", 15);
user_pref("devtools.chrome.enabled", true);
user_pref("devtools.debugger.remote-enabled", true);
user_pref("devtools.debugger.remote-port", 6000);
user_pref("devtools.debugger.remote-websocket", true);
user_pref("devtools.debugger.remote-websocket.port", 6000);
user_pref("devtools.debugger.remote-websocket.force-local", true);
EOF

# Создаем profiles.ini
echo "📝 Создаем конфигурацию профиля..."
cat > "$HOME/.mozilla/firefox/profiles.ini" << EOF
[Install$RANDOM]
Default=developer
Locked=1

[Profile0]
Name=developer
IsRelative=1
Path=developer
Default=1
EOF

echo "✅ Профиль разработчика создан: $PROFILE_DIR"

# Создаем скрипт запуска Firefox
echo "🚀 Создаем скрипт запуска..."
cat > "start-firefox-dev.sh" << 'EOF'
#!/bin/bash
# Запуск Firefox с профилем разработчика и отключенной проверкой подписи

echo "🦊 Запуск Firefox Developer Mode"
echo "================================"

# Определяем путь к Firefox
if command -v firefox &> /dev/null; then
    FIREFOX_CMD="firefox"
elif command -v firefox-bin &> /dev/null; then
    FIREFOX_CMD="firefox-bin"
else
    echo "❌ Firefox не найден в PATH"
    echo "Установите Firefox или добавьте его в PATH"
    exit 1
fi

# Запускаем Firefox с профилем разработчика
echo "Запускаем Firefox с отключенной проверкой подписи..."
$FIREFOX_CMD --profile ~/.mozilla/firefox/developer \
             --disable-xpinstall-signature-verification \
             --new-instance \
             --no-remote \
             "$@"
EOF

chmod +x start-firefox-dev.sh

echo ""
echo "🎉 Настройка завершена!"
echo "======================="
echo ""
echo "📋 Что было сделано:"
echo "✅ Создан профиль разработчика"
echo "✅ Отключена проверка подписи расширений"
echo "✅ Настроены инструменты разработчика"
echo "✅ Создан скрипт запуска"
echo ""
echo "🚀 Как использовать:"
echo "1. Запустите: ./start-firefox-dev.sh"
echo "2. Установите расширение через about:addons"
echo "3. Или используйте about:debugging для временной установки"
echo ""
echo "📁 Файлы:"
echo "- Профиль: $PROFILE_DIR"
echo "- Скрипт запуска: ./start-firefox-dev.sh"
echo ""
echo "⚠️  Важно:"
echo "- Используйте этот профиль только для разработки"
echo "- Не используйте его для обычного веб-серфинга"
echo "- Регулярно обновляйте Firefox"
echo ""
echo "🔧 Альтернативные способы:"
echo "- about:config → xpinstall.signatures.required → false"
echo "- about:debugging → Загрузить временное дополнение"
echo "- Firefox Developer Edition"
