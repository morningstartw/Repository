// js/app.js - 全國大學生二手物品交換與買賣平台 主邏輯控制器
import { Store } from './store.js';
import { filterItems } from './filter-engine.js';
import { AIEngine } from './ai-engine.js';
import { Gamification } from './components/gamification.js';
import { Navbar } from './components/navbar.js';
import { HeroAI } from './components/hero-ai.js';
import { ProductCard } from './components/product-card.js';
import { ProductModal } from './components/product-modal.js';
import { PostModal } from './components/post-modal.js';
import { UserCenter } from './components/user-center.js';
import { AdminModal } from './components/admin-modal.js';

class UniAppController {
  constructor() {
    this.activeFilters = {
      keyword: '',
      category: '全部',
      tradeType: '全部',
      minPrice: '',
      maxPrice: '',
      school: '國立臺灣大學',
      schoolOnly: true,
      sort: 'newest',
      wishlistOnly: false
    };
    this.activeMascot = Gamification.MASCOTS[0]; // 預設臺大黑白汪
  }

  init() {
    this.renderAll();
    this.bindEvents();
  }

  renderAll() {
    Navbar.render('navbar-container');
    Gamification.renderGamificationHeader('gamification-container');
    Gamification.renderMascotFilterBar('mascot-filter-container', (mascotId) => this.selectMascot(mascotId));
    HeroAI.render('hero-ai-container', this.activeFilters, this.activeMascot);
    this.renderProductGrid();
  }

  renderProductGrid() {
    const gridEl = document.getElementById('product-grid');
    const emptyEl = document.getElementById('empty-state');
    const countEl = document.getElementById('product-count');
    if (!gridEl) return;

    const allItems = Store.getItems();
    const user = Store.getUserProfile();

    const criteria = {
      ...this.activeFilters,
      wishlistIds: user.wishlistIds || []
    };

    const filtered = filterItems(allItems, criteria);

    if (countEl) {
      countEl.innerText = `共找到 ${filtered.length} 件好物`;
    }

    if (filtered.length === 0) {
      gridEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
    } else {
      if (emptyEl) emptyEl.classList.add('hidden');
      gridEl.innerHTML = filtered.map(item => ProductCard.render(item)).join('');
    }
  }

  // AI 自然語言搜尋觸發
  onAISearchSubmit() {
    const input = document.getElementById('ai-search-input');
    const text = input ? input.value : '';
    if (!text.trim()) {
      this.resetAllFilters();
      return;
    }

    const parsed = AIEngine.parseNaturalQuery(text);
    this.activeFilters.keyword = parsed.keyword;
    if (parsed.category !== '全部') this.activeFilters.category = parsed.category;
    if (parsed.tradeType !== '全部') this.activeFilters.tradeType = parsed.tradeType;
    if (parsed.maxPrice !== null) this.activeFilters.maxPrice = parsed.maxPrice;

    // 顯示 AI 解析橫幅
    const banner = document.getElementById('ai-parsed-status');
    const bannerText = document.getElementById('ai-parsed-text');
    if (banner && bannerText) {
      bannerText.innerText = `✨ ${parsed.summary}`;
      banner.classList.remove('hidden');
    }

    // 重新渲染篩選與清單
    HeroAI.render('hero-ai-container', this.activeFilters, this.activeMascot);
    this.renderProductGrid();
  }

  applyPresetQuery(query) {
    const input = document.getElementById('ai-search-input');
    if (input) input.value = query;
    this.onAISearchSubmit();
  }

  clearAISearch() {
    this.activeFilters.keyword = '';
    this.activeFilters.maxPrice = '';
    const banner = document.getElementById('ai-parsed-status');
    if (banner) banner.classList.add('hidden');
    HeroAI.render('hero-ai-container', this.activeFilters, this.activeMascot);
    this.renderProductGrid();
  }

  onCategoryChange(category) {
    this.activeFilters.category = category;
    HeroAI.render('hero-ai-container', this.activeFilters, this.activeMascot);
    this.renderProductGrid();
  }

  onTradeTypeChange(tradeType) {
    this.activeFilters.tradeType = tradeType;
    HeroAI.render('hero-ai-container', this.activeFilters, this.activeMascot);
    this.renderProductGrid();
  }

  onPriceChange() {
    const minInput = document.getElementById('filter-min-price');
    const maxInput = document.getElementById('filter-max-price');
    this.activeFilters.minPrice = minInput ? minInput.value : '';
    this.activeFilters.maxPrice = maxInput ? maxInput.value : '';
    this.renderProductGrid();
  }

  onSortChange(sort) {
    this.activeFilters.sort = sort;
    this.renderProductGrid();
  }

  onSchoolChange(school) {
    this.activeFilters.school = school;
    this.renderProductGrid();
  }

  onSchoolOnlyToggle(isChecked) {
    this.activeFilters.schoolOnly = isChecked;
    this.renderProductGrid();
  }

  toggleWishlistFilter() {
    this.activeFilters.wishlistOnly = !this.activeFilters.wishlistOnly;
    const btn = document.getElementById('btn-wishlist-filter');
    if (btn) {
      if (this.activeFilters.wishlistOnly) {
        btn.classList.add('ring-2', 'ring-rose-500', 'bg-rose-50');
      } else {
        btn.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-50');
      }
    }
    this.renderProductGrid();
  }

  onToggleWishlist(itemId) {
    const isAdded = Store.toggleWishlist(itemId);
    Navbar.render('navbar-container');
    this.renderProductGrid();
    this.showToast(isAdded ? '❤️ 已加入收藏清單！' : '已從收藏清單移除');
  }

  selectMascot(mascotId) {
    const m = Gamification.MASCOTS.find(mascot => mascot.id === mascotId);
    if (!m) return;
    this.activeMascot = m;
    const user = Store.getUserProfile();
    user.avatarEmoji = m.emoji;
    user.mascotName = m.name;
    user.school = m.school;
    Store.saveUserProfile(user);

    // 同步更新學校篩選
    this.activeFilters.school = m.school;
    const schoolSelect = document.getElementById('nav-school-select');
    if (schoolSelect) schoolSelect.value = m.school;

    Gamification.renderGamificationHeader('gamification-container');
    HeroAI.render('hero-ai-container', this.activeFilters, this.activeMascot);
    this.renderProductGrid();
    this.showToast(`🐾 已切換守護神獸為【${m.name}】！優先顯示 ${m.school} 好物。`);
  }

  resetAllFilters() {
    this.activeFilters = {
      keyword: '',
      category: '全部',
      tradeType: '全部',
      minPrice: '',
      maxPrice: '',
      school: '國立臺灣大學',
      schoolOnly: true,
      sort: 'newest',
      wishlistOnly: false
    };
    this.renderAll();
  }

  // 彈窗模組控制器
  openProductModal(itemId) {
    const container = document.getElementById('modal-root');
    if (!container) return;
    container.innerHTML = ProductModal.render(itemId);
  }

  openPostModal() {
    const container = document.getElementById('modal-root');
    if (!container) return;
    container.innerHTML = PostModal.render();
  }

  openUserCenterModal() {
    const container = document.getElementById('modal-root');
    if (!container) return;
    container.innerHTML = UserCenter.render();
  }

  openAdminModal() {
    const container = document.getElementById('modal-root');
    if (!container) return;
    container.innerHTML = AdminModal.render();
  }

  openNotificationsModal() {
    const user = Store.getUserProfile();
    (user.notifications || []).forEach(n => n.read = true);
    Store.saveUserProfile(user);
    Navbar.render('navbar-container');
    alert(`【站內即時通知中心】\n\n` + (user.notifications || []).map(n => `• [${n.time}] ${n.text}`).join('\n\n'));
  }

  openLuckyBox() {
    const reward = Gamification.drawLuckyBox();
    Gamification.renderGamificationHeader('gamification-container');
    alert(`🎉 【恭喜翻開每日校園好物盲盒！】\n\n${reward.text}\n\n當前經驗值已增加 +${reward.exp} EXP！`);
  }

  closeModal() {
    const container = document.getElementById('modal-root');
    if (container) container.innerHTML = '';
  }

  // 刊登 AI 表單聯動
  applyAIPhotoPreset(photoKey) {
    const analysis = AIEngine.autoAnalyzePhoto(photoKey);
    const titleEl = document.getElementById('post-title');
    const catEl = document.getElementById('post-category');
    const condEl = document.getElementById('post-condition');
    const priceEl = document.getElementById('post-price');
    const tradeTypeEl = document.getElementById('post-trade-type');
    const descEl = document.getElementById('post-desc');
    const estimateValEl = document.getElementById('post-ai-estimate-val');

    if (titleEl) titleEl.value = analysis.title;
    if (catEl) catEl.value = analysis.category;
    if (condEl) condEl.value = analysis.condition;
    if (priceEl) priceEl.value = analysis.suggestedPrice;
    if (tradeTypeEl) tradeTypeEl.value = analysis.suggestedTradeType;
    if (descEl) descEl.value = analysis.description;

    this.onPostTradeTypeChange(analysis.suggestedTradeType);
    this.updatePostAIEstimate();

    this.showToast('✨ AI 拍照辨識完成！已自動填寫標題、分類與定價建議。');
  }

  onPostTradeTypeChange(tradeType) {
    const exchangeBox = document.getElementById('post-exchange-box');
    const priceEl = document.getElementById('post-price');
    if (exchangeBox) {
      if (tradeType.includes('交換')) {
        exchangeBox.classList.remove('hidden');
      } else {
        exchangeBox.classList.add('hidden');
      }
    }
    if (tradeType === '免費贈送' && priceEl) {
      priceEl.value = 0;
    }
  }

  onPostPriceInput(price) {
    const tradeTypeEl = document.getElementById('post-trade-type');
    if (Number(price) === 0 && tradeTypeEl) {
      tradeTypeEl.value = '免費贈送';
    }
    this.updatePostAIEstimate();
  }

  onPostConditionChange() {
    this.updatePostAIEstimate();
  }

  updatePostAIEstimate() {
    const catEl = document.getElementById('post-category');
    const condEl = document.getElementById('post-condition');
    const priceEl = document.getElementById('post-price');
    const estimateValEl = document.getElementById('post-ai-estimate-val');

    const cat = catEl ? catEl.value : '課本教材';
    const cond = condEl ? condEl.value : '9成新';
    const price = priceEl && priceEl.value ? Number(priceEl.value) : 400;

    const est = AIEngine.estimatePrice(cat, cond, price * 2);
    if (estimateValEl) {
      estimateValEl.innerText = `NT$ ${est.low} ~ ${est.high}`;
    }
  }

  submitPostForm(event) {
    event.preventDefault();
    const title = document.getElementById('post-title').value;
    const category = document.getElementById('post-category').value;
    const condition = document.getElementById('post-condition').value;
    const price = Number(document.getElementById('post-price').value || 0);
    const tradeType = document.getElementById('post-trade-type').value;
    const meetup = document.getElementById('post-meetup').value;
    const desc = document.getElementById('post-desc').value;

    const user = Store.getUserProfile();
    const newItem = {
      title,
      category,
      condition,
      price,
      originalPrice: price > 0 ? Math.round(price * 2.2) : 500,
      tradeType,
      school: user.school || '國立臺灣大學',
      meetupLocation: meetup,
      description: desc || '物品保存良好，歡迎校內面交！',
      seller: {
        id: user.id,
        name: user.name,
        school: user.school,
        department: user.department,
        email: user.email,
        verifiedEdu: true,
        rating: 5.0,
        mascot: user.avatarEmoji || '🐶'
      },
      status: '上架中',
      ecoExp: 35,
      carbonSavedKg: price === 0 ? 12.0 : 3.5,
      aiValuation: {
        low: Math.max(50, Math.round(price * 0.9)),
        high: Math.round(price * 1.1),
        note: '依據品相與校園行情估算之合理區間。'
      }
    };

    Store.saveItem(newItem);
    this.closeModal();
    this.renderAll();
    this.showToast('🎉 商品上架成功！獲得 +30 冒險 EXP 🌱');
  }

  // 交易互動
  submitTradeRequest(itemId, actionType) {
    const item = Store.getItemById(itemId);
    if (!item) return;
    Store.updateItemStatus(itemId, '已預約');
    Store.addExp(40);
    this.closeModal();
    this.renderAll();
    alert(`【交易申請已送出！】\n\n您已對「${item.title}」提出【${actionType}】。\n\n系統已為您鎖定該商品為「已預約 (面交中)」，並已向賣家發送校園即時聊聊通知！\n\n約定面交地點：📍 ${item.school} · ${item.meetupLocation}`);
  }

  submitQuestion(itemId) {
    const input = document.getElementById('qa-input-text');
    const text = input ? input.value.trim() : '';
    if (!text) return;

    // 個資檢測
    if (/09\d{2}[-\s]?\d{3}[-\s]?\d{3}/.test(text)) {
      alert('⚠️ 安全警語：為保護個人隱私，問答區禁止公開留言手機號碼！請改於站內私訊聯繫。');
      return;
    }

    const user = Store.getUserProfile();
    Store.addQuestion(itemId, { author: user.name, text });
    this.openProductModal(itemId); // 重新渲染問答區
    this.showToast('💬 提問已送出！');
  }

  replyQuestion(itemId, questionId) {
    const reply = prompt('請輸入身為賣家對此提問之公開回覆：');
    if (reply && reply.trim()) {
      Store.answerQuestion(itemId, questionId, reply.trim());
      this.openProductModal(itemId);
      this.showToast('✓ 已回覆提問');
    }
  }

  openReportModal(itemId) {
    const reason = prompt('請輸入檢舉此商品之事由（例如：價格與實物不符、疑似詐騙違禁品）：');
    if (reason && reason.trim()) {
      Store.addReport(itemId, reason.trim(), '熱心同學');
      alert('🚩 感謝回報！檢舉案件已送交管理員審核中心處理。');
    }
  }

  resolveReport(reportId, action) {
    Store.resolveReport(reportId, action);
    this.openAdminModal();
    this.renderProductGrid();
    this.showToast(action === 'remove' ? '✓ 爭議商品已處置下架！' : '✓ 已駁回該檢舉');
  }

  onChangeListingStatus(itemId, newStatus) {
    Store.updateItemStatus(itemId, newStatus);
    this.openUserCenterModal();
    this.renderProductGrid();
    this.showToast(`✓ 商品狀態已更新為【${newStatus}】！`);
  }

  onDeleteListing(itemId) {
    if (confirm('確定要下架並刪除此商品嗎？')) {
      Store.deleteItem(itemId);
      this.openUserCenterModal();
      this.renderProductGrid();
      this.showToast('✓ 商品已下架刪除');
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce-slow';
    toast.innerHTML = `<span>🔔</span><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 2800);
  }

  bindEvents() {
    // 監聽鍵盤 Enter 在自然語言搜尋框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target && e.target.id === 'ai-search-input') {
        this.onAISearchSubmit();
      }
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }
}

// 實例化全域控制器掛載至 window
window.UniApp = new UniAppController();
document.addEventListener('DOMContentLoaded', () => {
  window.UniApp.init();
});
