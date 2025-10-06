// YouTube Ban Extension - Popup Script

class PopupManager {
  constructor() {
    this.bannedVideos = [];
    this.bannedChannels = [];
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadBannedData();
    this.updateUI();
  }

  bindEvents() {
    // Кнопка разбана всех
    document.getElementById('unbanAllBtn').addEventListener('click', () => {
      this.unbanAll();
    });

    // Кнопка обновления
    document.getElementById('refreshBtn').addEventListener('click', () => {
      this.refreshData();
    });
  }

  async loadBannedData() {
    try {
      const response = await browser.runtime.sendMessage({ action: 'getBannedData' });
      if (response.success) {
        this.bannedVideos = response.data.bannedVideos || [];
        this.bannedChannels = response.data.bannedChannels || [];
      }
    } catch (error) {
      console.error('Ошибка загрузки данных о банах:', error);
      this.showError('Ошибка загрузки данных');
    }
  }

  updateUI() {
    this.updateStats();
    this.updateBannedVideosList();
    this.updateBannedChannelsList();
  }

  updateStats() {
    document.getElementById('bannedVideosCount').textContent = this.bannedVideos.length;
    document.getElementById('bannedChannelsCount').textContent = this.bannedChannels.length;
  }

  updateBannedVideosList() {
    const container = document.getElementById('bannedVideosList');
    
    if (this.bannedVideos.length === 0) {
      container.innerHTML = '<div class="empty-state">Нет забаненных видео</div>';
      return;
    }

    // Очищаем контейнер
    container.innerHTML = '';

    // Создаем элементы программно для надежной привязки событий
    this.bannedVideos.forEach(videoId => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'banned-item video-item';
      itemDiv.setAttribute('data-video-id', videoId);

      const infoDiv = document.createElement('div');
      infoDiv.className = 'item-info';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'item-title';
      titleDiv.textContent = `Видео ID: ${videoId}`;

      const idDiv = document.createElement('div');
      idDiv.className = 'item-id';
      idDiv.textContent = videoId;

      infoDiv.appendChild(titleDiv);
      infoDiv.appendChild(idDiv);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => {
        this.unbanVideo(videoId);
      });

      itemDiv.appendChild(infoDiv);
      itemDiv.appendChild(removeBtn);
      container.appendChild(itemDiv);
    });
  }

  updateBannedChannelsList() {
    const container = document.getElementById('bannedChannelsList');
    
    if (this.bannedChannels.length === 0) {
      container.innerHTML = '<div class="empty-state">Нет забаненных каналов</div>';
      return;
    }

    // Очищаем контейнер
    container.innerHTML = '';

    // Создаем элементы программно для надежной привязки событий
    this.bannedChannels.forEach(channelName => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'banned-item channel-item';
      itemDiv.setAttribute('data-channel-name', channelName);

      const infoDiv = document.createElement('div');
      infoDiv.className = 'item-info';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'item-title';
      titleDiv.textContent = channelName;

      const idDiv = document.createElement('div');
      idDiv.className = 'item-id';
      idDiv.textContent = 'Канал';

      infoDiv.appendChild(titleDiv);
      infoDiv.appendChild(idDiv);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => {
        this.unbanChannel(channelName);
      });

      itemDiv.appendChild(infoDiv);
      itemDiv.appendChild(removeBtn);
      container.appendChild(itemDiv);
    });
  }

  async unbanAll() {
    if (this.bannedVideos.length === 0 && this.bannedChannels.length === 0) {
      this.showMessage('Нет забаненных элементов');
      return;
    }

    if (confirm('Вы уверены, что хотите разбанить все видео и каналы?')) {
      try {
        const response = await browser.runtime.sendMessage({ action: 'unbanAll' });
        if (response.success) {
          this.bannedVideos = [];
          this.bannedChannels = [];
          this.updateUI();
          this.showMessage('Все баны сняты!');
        } else {
          this.showError('Ошибка при снятии банов');
        }
      } catch (error) {
        console.error('Ошибка разбана всех:', error);
        this.showError('Ошибка при снятии банов');
      }
    }
  }

  async unbanVideo(videoId) {
    console.log('Попытка разбана видео:', videoId);
    try {
      const response = await browser.runtime.sendMessage({ 
        action: 'unbanVideo', 
        videoId: videoId 
      });
      
      console.log('Ответ от background script:', response);
      
      if (response.success) {
        this.bannedVideos = this.bannedVideos.filter(id => id !== videoId);
        this.updateUI();
        this.showMessage(`Видео ${videoId} разбанено`);
        console.log('Видео успешно разбанено');
      } else {
        console.error('Ошибка разбана видео:', response.error);
        this.showError('Ошибка при разбане видео');
      }
    } catch (error) {
      console.error('Ошибка разбана видео:', error);
      this.showError('Ошибка при разбане видео');
    }
  }

  async unbanChannel(channelName) {
    console.log('Попытка разбана канала:', channelName);
    try {
      const response = await browser.runtime.sendMessage({ 
        action: 'unbanChannel', 
        channelName: channelName 
      });
      
      console.log('Ответ от background script:', response);
      
      if (response.success) {
        this.bannedChannels = this.bannedChannels.filter(name => name !== channelName);
        this.updateUI();
        this.showMessage(`Канал "${channelName}" разбанен`);
        console.log('Канал успешно разбанен');
      } else {
        console.error('Ошибка разбана канала:', response.error);
        this.showError('Ошибка при разбане канала');
      }
    } catch (error) {
      console.error('Ошибка разбана канала:', error);
      this.showError('Ошибка при разбане канала');
    }
  }

  async refreshData() {
    await this.loadBannedData();
    this.updateUI();
    this.showMessage('Данные обновлены');
  }

  showMessage(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 2000);
  }
}

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Инициализируем менеджер popup
const popupManager = new PopupManager();
