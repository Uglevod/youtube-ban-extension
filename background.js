// YouTube Ban Extension - Background Script

class BanManager {
  constructor() {
    this.init();
  }

  init() {
    // Слушаем сообщения от content script и popup
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Указываем, что ответ будет асинхронным
    });

    // Обработка установки расширения
    browser.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getBannedData':
          const bannedData = await this.getBannedData();
          sendResponse({ success: true, data: bannedData });
          break;

        case 'unbanAll':
          await this.unbanAll();
          // Отправляем сообщение всем content scripts
          const tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
          for (const tab of tabs) {
            try {
              await browser.tabs.sendMessage(tab.id, { action: 'unbanAll' });
            } catch (error) {
              // Игнорируем ошибки для вкладок без content script
            }
          }
          sendResponse({ success: true });
          break;

        case 'unbanVideo':
          await this.unbanVideo(request.videoId);
          // Отправляем сообщение всем content scripts на YouTube
          const videoTabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
          for (const tab of videoTabs) {
            try {
              await browser.tabs.sendMessage(tab.id, { 
                action: 'unbanVideo', 
                videoId: request.videoId 
              });
            } catch (error) {
              // Игнорируем ошибки для вкладок без content script
            }
          }
          sendResponse({ success: true });
          break;

        case 'unbanChannel':
          await this.unbanChannel(request.channelName);
          // Отправляем сообщение всем content scripts на YouTube
          const channelTabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
          for (const tab of channelTabs) {
            try {
              await browser.tabs.sendMessage(tab.id, { 
                action: 'unbanChannel', 
                channelName: request.channelName 
              });
            } catch (error) {
              // Игнорируем ошибки для вкладок без content script
            }
          }
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Неизвестное действие' });
      }
    } catch (error) {
      console.error('Ошибка в background script:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async getBannedData() {
    try {
      const result = await browser.storage.local.get(['bannedVideos', 'bannedChannels']);
      return {
        bannedVideos: result.bannedVideos || [],
        bannedChannels: result.bannedChannels || []
      };
    } catch (error) {
      console.error('Ошибка получения данных о банах:', error);
      return { bannedVideos: [], bannedChannels: [] };
    }
  }

  async unbanAll() {
    try {
      await browser.storage.local.clear();
      console.log('Все баны сняты');
    } catch (error) {
      console.error('Ошибка снятия всех банов:', error);
      throw error;
    }
  }

  async unbanVideo(videoId) {
    try {
      const result = await browser.storage.local.get(['bannedVideos']);
      const bannedVideos = result.bannedVideos || [];
      const updatedVideos = bannedVideos.filter(id => id !== videoId);
      
      await browser.storage.local.set({ bannedVideos: updatedVideos });
      console.log(`Видео ${videoId} разбанено`);
    } catch (error) {
      console.error('Ошибка разбана видео:', error);
      throw error;
    }
  }

  async unbanChannel(channelName) {
    try {
      const result = await browser.storage.local.get(['bannedChannels']);
      const bannedChannels = result.bannedChannels || [];
      const updatedChannels = bannedChannels.filter(name => name !== channelName);
      
      await browser.storage.local.set({ bannedChannels: updatedChannels });
      console.log(`Канал ${channelName} разбанен`);
    } catch (error) {
      console.error('Ошибка разбана канала:', error);
      throw error;
    }
  }

  async handleInstallation(details) {
    if (details.reason === 'install') {
      console.log('YouTube Ban Extension установлено');
      
      // Инициализируем storage с пустыми массивами
      await browser.storage.local.set({
        bannedVideos: [],
        bannedChannels: []
      });
    } else if (details.reason === 'update') {
      console.log('YouTube Ban Extension обновлено');
    }
  }
}

// Инициализируем менеджер банов
const banManager = new BanManager();
