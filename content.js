// YouTube Ban Extension - Content Script

class YouTubeBanManager {
  constructor() {
    this.bannedVideos = new Set();
    this.bannedChannels = new Set();
    this.observer = null;
    this.init();
  }

  async init() {
    // Загружаем данные о банах из storage
    await this.loadBannedData();
    
    // Начинаем наблюдение за изменениями DOM
    this.startObserver();
    
    // Обрабатываем уже существующие элементы
    this.processExistingElements();
  }

  async loadBannedData() {
    try {
      const result = await browser.storage.local.get(['bannedVideos', 'bannedChannels']);
      this.bannedVideos = new Set(result.bannedVideos || []);
      this.bannedChannels = new Set(result.bannedChannels || []);
    } catch (error) {
      console.error('Ошибка загрузки данных о банах:', error);
    }
  }

  startObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processElement(node);
            }
          });
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processExistingElements() {
    // Обрабатываем основные карточки видео
    const videoElements = document.querySelectorAll('ytd-rich-item-renderer');
    videoElements.forEach(element => this.processElement(element));
    
    // Обрабатываем элементы боковой панели
    const sidebarElements = document.querySelectorAll('yt-lockup-view-model');
    sidebarElements.forEach(element => this.processElement(element));
  }

  processElement(element) {
    // Проверяем, является ли элемент видео или содержит видео
    let videoElement = element.closest('ytd-rich-item-renderer') || 
                      (element.matches('ytd-rich-item-renderer') ? element : null);
    
    // Также проверяем элементы боковой панели
    if (!videoElement) {
      videoElement = element.closest('yt-lockup-view-model') || 
                    (element.matches('yt-lockup-view-model') ? element : null);
    }
    
    if (!videoElement) return;

    // Проверяем, не обработан ли уже этот элемент
    if (videoElement.dataset.banButtonsAdded) return;

    // Получаем информацию о видео и канале
    const videoInfo = this.extractVideoInfo(videoElement);
    if (!videoInfo) return;

    // Проверяем, не забанен ли элемент
    if (this.isElementBanned(videoInfo)) {
      this.hideElement(videoElement);
      return;
    }

    // Определяем, является ли элемент боковой панелью
    const isSidebar = videoElement.closest('ytd-watch-next-secondary-results-renderer') !== null ||
                     videoElement.classList.contains('yt-lockup-view-model--horizontal');

    // Добавляем кнопки бана
    this.addBanButtons(videoElement, videoInfo, isSidebar);
    videoElement.dataset.banButtonsAdded = 'true';
  }

  extractVideoInfo(element) {
    try {
      // Получаем ссылку на видео - обновленные селекторы для новой структуры YouTube
      const videoLink = element.querySelector('a[href*="/watch?v="]');
      if (!videoLink) return null;

      const videoUrl = videoLink.href;
      const videoId = this.extractVideoId(videoUrl);
      if (!videoId) return null;

      // Получаем информацию о канале - разные селекторы для разных типов элементов
      let channelLink = element.querySelector('a[href*="/@"]');
      
      // Для боковой панели канал может быть в тексте без ссылки
      if (!channelLink) {
        const channelText = element.querySelector('.yt-content-metadata-view-model__metadata-text');
        if (channelText && !channelText.querySelector('a')) {
          // Это текст канала без ссылки
          return {
            videoId,
            videoUrl,
            channelName: channelText.textContent.trim(),
            channelUrl: '',
            element
          };
        }
      }
      
      const channelName = channelLink ? channelLink.textContent.trim() : 'Неизвестный канал';
      const channelUrl = channelLink ? channelLink.href : '';

      return {
        videoId,
        videoUrl,
        channelName,
        channelUrl,
        element
      };
    } catch (error) {
      console.error('Ошибка извлечения информации о видео:', error);
      return null;
    }
  }

  extractVideoId(url) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  }

  // Делаем метод доступным для внешнего использования
  static extractVideoId(url) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  }

  isElementBanned(videoInfo) {
    return this.bannedVideos.has(videoInfo.videoId) || 
           this.bannedChannels.has(videoInfo.channelName);
  }

  hideElement(element) {
    element.style.display = 'none';
  }

  toggleBanPanel(buttonContainer, compactBtn) {
    const isExpanded = buttonContainer.classList.contains('expanded');
    
    if (isExpanded) {
      // Сворачиваем панель
      buttonContainer.classList.remove('expanded');
      compactBtn.classList.remove('expanded');
      compactBtn.textContent = 'Б';
      compactBtn.title = 'Показать опции бана';
    } else {
      // Разворачиваем панель
      buttonContainer.classList.add('expanded');
      compactBtn.classList.add('expanded');
      compactBtn.textContent = '✕';
      compactBtn.title = 'Скрыть опции бана';
    }
  }

  addBanButtons(element, videoInfo, isSidebar = false) {
    // Создаем контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.className = `yt-ban-buttons-container${isSidebar ? ' sidebar' : ''}`;
    
    // Кнопка бана видео
    const banVideoBtn = document.createElement('button');
    banVideoBtn.className = 'yt-ban-btn yt-ban-video-btn';
    banVideoBtn.textContent = isSidebar ? '🚫 Видео' : '🚫 Бан видео';
    banVideoBtn.title = 'Забанить это видео';
    banVideoBtn.onclick = () => this.banVideo(videoInfo);

    // Кнопка бана канала
    const banChannelBtn = document.createElement('button');
    banChannelBtn.className = 'yt-ban-btn yt-ban-channel-btn';
    banChannelBtn.textContent = isSidebar ? '🚫 Канал' : '🚫 Бан канал';
    banChannelBtn.title = 'Забанить весь канал';
    banChannelBtn.onclick = () => this.banChannel(videoInfo);

    buttonContainer.appendChild(banVideoBtn);
    buttonContainer.appendChild(banChannelBtn);

    // Создаем компактную кнопку "Б"
    const compactBtn = document.createElement('button');
    compactBtn.className = `yt-ban-compact-btn${isSidebar ? ' sidebar' : ''}`;
    compactBtn.textContent = 'Б';
    compactBtn.title = 'Показать опции бана';
    compactBtn.onclick = () => this.toggleBanPanel(buttonContainer, compactBtn);

    // Находим место для вставки кнопок
    let targetContainer;
    
    if (isSidebar) {
      // Для боковой панели ищем контейнер метаданных
      targetContainer = element.querySelector('.yt-lockup-metadata-view-model__text-container') ||
                       element.querySelector('.yt-lockup-metadata-view-model');
    } else {
      // Для основных карточек видео
      targetContainer = element.querySelector('.yt-lockup-metadata-view-model__text-container');
    }
    
    if (targetContainer) {
      // Добавляем компактную кнопку и панель
      targetContainer.appendChild(compactBtn);
      targetContainer.appendChild(buttonContainer);
    } else {
      // Альтернативные селекторы для разных версий YouTube
      const fallbackContainer = element.querySelector('.yt-lockup-metadata-view-model, #metadata, .metadata');
      
      if (fallbackContainer) {
        fallbackContainer.appendChild(compactBtn);
        fallbackContainer.appendChild(buttonContainer);
      } else {
        // Если ничего не найдено, добавляем в конец элемента
        element.appendChild(compactBtn);
        element.appendChild(buttonContainer);
      }
    }
  }

  async banVideo(videoInfo) {
    this.bannedVideos.add(videoInfo.videoId);
    await this.saveBannedData();
    this.hideElement(videoInfo.element);
    
    // Показываем уведомление
    this.showNotification('Видео забанено!');
  }

  async banChannel(videoInfo) {
    this.bannedChannels.add(videoInfo.channelName);
    await this.saveBannedData();
    this.hideElement(videoInfo.element);
    
    // Скрываем все видео с этого канала
    this.hideChannelVideos(videoInfo.channelName);
    
    // Показываем уведомление
    this.showNotification(`Канал "${videoInfo.channelName}" забанен!`);
  }

  hideChannelVideos(channelName) {
    // Скрываем видео в основных карточках
    const allVideoElements = document.querySelectorAll('ytd-rich-item-renderer');
    allVideoElements.forEach(element => {
      const channelLink = element.querySelector('a[href*="/@"]');
      if (channelLink && channelLink.textContent.trim() === channelName) {
        this.hideElement(element);
      }
    });
    
    // Скрываем видео в боковой панели
    const sidebarElements = document.querySelectorAll('yt-lockup-view-model');
    sidebarElements.forEach(element => {
      const channelLink = element.querySelector('a[href*="/@"]');
      const channelText = element.querySelector('.yt-content-metadata-view-model__metadata-text');
      
      if ((channelLink && channelLink.textContent.trim() === channelName) ||
          (channelText && !channelText.querySelector('a') && channelText.textContent.trim() === channelName)) {
        this.hideElement(element);
      }
    });
  }

  async saveBannedData() {
    try {
      await browser.storage.local.set({
        bannedVideos: Array.from(this.bannedVideos),
        bannedChannels: Array.from(this.bannedChannels)
      });
    } catch (error) {
      console.error('Ошибка сохранения данных о банах:', error);
    }
  }

  showNotification(message) {
    // Создаем простое уведомление
    const notification = document.createElement('div');
    notification.className = 'yt-ban-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

// Инициализируем менеджер банов
const banManager = new YouTubeBanManager();

// Слушаем сообщения от popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'unbanAll':
      banManager.bannedVideos.clear();
      banManager.bannedChannels.clear();
      banManager.saveBannedData();
      
      // Показываем все скрытые элементы
      const hiddenElements = document.querySelectorAll('ytd-rich-item-renderer[style*="display: none"], yt-lockup-view-model[style*="display: none"]');
      hiddenElements.forEach(element => {
        element.style.display = '';
      });
      
      // Удаляем кнопки бана
      const buttonContainers = document.querySelectorAll('.yt-ban-buttons-container');
      buttonContainers.forEach(container => {
        container.remove();
      });
      
      // Удаляем компактные кнопки
      const compactButtons = document.querySelectorAll('.yt-ban-compact-btn');
      compactButtons.forEach(button => {
        button.remove();
      });
      
      // Сбрасываем флаги обработки
      const processedElements = document.querySelectorAll('[data-ban-buttons-added]');
      processedElements.forEach(element => {
        delete element.dataset.banButtonsAdded;
      });
      
      // Переобрабатываем элементы
      banManager.processExistingElements();
      
      sendResponse({success: true});
      break;

    case 'unbanVideo':
      banManager.bannedVideos.delete(request.videoId);
      banManager.saveBannedData();
      
      // Показываем скрытые видео с этим ID
      const hiddenVideos = document.querySelectorAll('ytd-rich-item-renderer[style*="display: none"], yt-lockup-view-model[style*="display: none"]');
      hiddenVideos.forEach(element => {
        const videoLink = element.querySelector('a[href*="/watch?v="]');
        if (videoLink) {
          const videoId = YouTubeBanManager.extractVideoId(videoLink.href);
          if (videoId === request.videoId) {
            element.style.display = '';
          }
        }
      });
      
      sendResponse({success: true});
      break;

    case 'unbanChannel':
      banManager.bannedChannels.delete(request.channelName);
      banManager.saveBannedData();
      
      // Показываем скрытые видео с этого канала
      const hiddenChannels = document.querySelectorAll('ytd-rich-item-renderer[style*="display: none"], yt-lockup-view-model[style*="display: none"]');
      hiddenChannels.forEach(element => {
        const channelLink = element.querySelector('a[href*="/@"]');
        const channelText = element.querySelector('.yt-content-metadata-view-model__metadata-text');
        
        if ((channelLink && channelLink.textContent.trim() === request.channelName) ||
            (channelText && !channelText.querySelector('a') && channelText.textContent.trim() === request.channelName)) {
          element.style.display = '';
        }
      });
      
      sendResponse({success: true});
      break;

    default:
      sendResponse({success: false, error: 'Неизвестное действие'});
  }
});
