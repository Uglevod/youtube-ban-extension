#!/bin/bash

# Быстрое решение проблемы с подписью в Firefox

echo "🦊 Быстрое решение проблемы с подписью Firefox"
echo "============================================="

echo ""
echo "🔧 Способ 1: Отключение через about:config (САМЫЙ ПРОСТОЙ)"
echo "1. Откройте Firefox"
echo "2. Введите в адресной строке: about:config"
echo "3. Нажмите 'Принять риск и продолжить'"
echo "4. Найдите: xpinstall.signatures.required"
echo "5. Дважды кликните на значение (изменится с true на false)"
echo "6. Перезапустите Firefox"
echo "7. Установите расширение YBan-Firefox.xpi"
echo ""

echo "🔧 Способ 2: Временная установка (БЕЗ ПЕРЕЗАПУСКА)"
echo "1. Откройте Firefox"
echo "2. Введите в адресной строке: about:debugging"
echo "3. Нажмите 'Этот Firefox'"
echo "4. Нажмите 'Загрузить временное дополнение'"
echo "5. Выберите файл manifest-firefox.json"
echo "6. Расширение установится временно"
echo ""

echo "🔧 Способ 3: Запуск с отключенной проверкой"
echo "Закройте Firefox и выполните:"
echo "firefox --disable-xpinstall-signature-verification"
echo ""

echo "🔧 Способ 4: Автоматическая настройка"
echo "Выполните: ./firefox-dev-setup.sh"
echo ""

echo "📋 После установки:"
echo "1. Перейдите на YouTube"
echo "2. Найдите кнопки 'Б' на карточках видео"
echo "3. Протестируйте функциональность"
echo ""

echo "⚠️  Если ничего не помогает:"
echo "1. Скачайте Firefox Developer Edition"
echo "2. Установите расширение в Developer Edition"
echo "3. Или используйте Chrome/Edge для тестирования"
echo ""

echo "🎯 Рекомендуемый порядок:"
echo "1. Попробуйте Способ 1 (самый простой)"
echo "2. Если не работает - Способ 2 (временная установка)"
echo "3. Для постоянного использования - Способ 4 (автонастройка)"
