// js/store.js - 核心資料層與 LocalStorage 狀態管理
import { INITIAL_GOODS, INITIAL_USER_PROFILE } from './seed-data.js';

const STORAGE_KEY_GOODS = 'uniswap_goods_v1';
const STORAGE_KEY_USER = 'uniswap_user_v1';
const STORAGE_KEY_REPORTS = 'uniswap_reports_v1';

export const Store = {
  // 初始化或載入商品
  getItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_GOODS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage unavailable, using in-memory seed', e);
    }
    this.resetToSeed();
    return INITIAL_GOODS;
  },

  getItemById(id) {
    const items = this.getItems();
    return items.find(item => item.id === id) || null;
  },

  saveItem(itemData) {
    const items = this.getItems();
    const id = itemData.id || `prod-${Date.now().toString().slice(-4)}`;
    const newItem = {
      ...itemData,
      id,
      status: itemData.status || '上架中',
      createdAt: itemData.createdAt || new Date().toISOString(),
      questions: itemData.questions || [],
      images: itemData.images && itemData.images.length > 0 ? itemData.images : ['📦']
    };

    const existingIndex = items.findIndex(item => item.id === id);
    if (existingIndex >= 0) {
      items[existingIndex] = newItem;
    } else {
      items.unshift(newItem);
    }

    this._saveItems(items);
    this.addExp(30); // 刊登成功獎勵 30 EXP
    return newItem;
  },

  updateItemStatus(id, newStatus) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (!item) return null;
    item.status = newStatus;
    this._saveItems(items);

    if (newStatus === '交易完成') {
      this.addExp(item.ecoExp || 50);
      this.addCarbonSaved(item.carbonSavedKg || 3.0);
    }
    return item;
  },

  deleteItem(id) {
    let items = this.getItems();
    items = items.filter(i => i.id !== id);
    this._saveItems(items);
    return true;
  },

  // 收藏清單
  isWishlisted(id) {
    const user = this.getUserProfile();
    return (user.wishlistIds || []).includes(id);
  },

  toggleWishlist(id) {
    const user = this.getUserProfile();
    user.wishlistIds = user.wishlistIds || [];
    const index = user.wishlistIds.indexOf(id);
    let added = false;
    if (index >= 0) {
      user.wishlistIds.splice(index, 1);
    } else {
      user.wishlistIds.push(id);
      added = true;
    }
    this.saveUserProfile(user);
    return added;
  },

  // 公開問答
  addQuestion(itemId, { author, text }) {
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return null;
    item.questions = item.questions || [];
    const q = {
      id: `q-${Date.now()}`,
      author: author || '校園好心人',
      text,
      createdAt: new Date().toISOString()
    };
    item.questions.push(q);
    this._saveItems(items);
    return q;
  },

  answerQuestion(itemId, questionId, answerText) {
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return null;
    const q = (item.questions || []).find(q => q.id === questionId);
    if (!q) return null;
    q.answer = answerText;
    this._saveItems(items);
    return q;
  },

  // 使用者檔案與遊戲化 EXP
  getUserProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage unavailable, using initial user profile', e);
    }
    return { ...INITIAL_USER_PROFILE };
  },

  saveUserProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
    return profile;
  },

  addExp(amount) {
    const user = this.getUserProfile();
    user.exp = (user.exp || 0) + amount;
    while (user.exp >= user.maxExp) {
      user.exp -= user.maxExp;
      user.level = (user.level || 1) + 1;
      user.maxExp = Math.round(user.maxExp * 1.3);
      user.notifications.unshift({
        id: `lvl-${Date.now()}`,
        text: `🎉 恭喜升級！您已晉升至 Lv.${user.level}，解鎖新守護稱號！`,
        time: '剛剛',
        read: false
      });
    }
    this.saveUserProfile(user);
    return user;
  },

  addCarbonSaved(kg) {
    const user = this.getUserProfile();
    user.carbonSavedTotalKg = +(Number(user.carbonSavedTotalKg || 0) + Number(kg)).toFixed(1);
    this.saveUserProfile(user);
  },

  // 檢舉管理 (中階功能 19)
  getReports() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return [
      { id: 'rep-1', itemId: 'prod-002', reason: '價格與說明疑有爭議', reporter: '李同學', status: '待審核', date: '2026-11-08' }
    ];
  },

  addReport(itemId, reason, reporter = '同學匿名檢舉') {
    const reports = this.getReports();
    const rep = { id: `rep-${Date.now()}`, itemId, reason, reporter, status: '待審核', date: new Date().toISOString().split('T')[0] };
    reports.unshift(rep);
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn(e);
    }
    return rep;
  },

  resolveReport(reportId, action) {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return null;
    rep.status = action === 'dismiss' ? '已駁回' : '已處置下架';
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn(e);
    }
    if (action === 'remove') {
      this.deleteItem(rep.itemId);
    }
    return rep;
  },

  resetToSeed() {
    try {
      localStorage.setItem(STORAGE_KEY_GOODS, JSON.stringify(INITIAL_GOODS));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(INITIAL_USER_PROFILE));
    } catch (e) {
      console.warn(e);
    }
  },

  _saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY_GOODS, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save goods to localStorage', e);
    }
  }
};
