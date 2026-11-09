// js/components/hero-ai.js - AI 智能問答搜尋與複合篩選器
export const HeroAI = {
  render(containerId, activeFilters = {}, activeMascot = null) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const mascotEmoji = activeMascot ? activeMascot.emoji : '🐶';
    const mascotName = activeMascot ? activeMascot.name : '臺大黑白汪';

    const categories = ['全部', '課本教材', '3C電子', '家具生活', '服飾配件'];
    const tradeTypes = ['全部', '買賣', '交換', '免費贈送'];

    el.innerHTML = `
      <div class="space-y-4">
        <!-- AI Hero Prompt Search Container -->
        <div class="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 md:p-6 rounded-3xl border border-indigo-500/20 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
              <span class="text-lg animate-bounce">${mascotEmoji}</span>
              <span>${mascotName} AI 購物問答助手在線：</span>
            </div>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">支援預算、關鍵字、交換或贈送等自然語言查詢</span>
          </div>

          <!-- Input Bar -->
          <div class="relative">
            <input type="text" id="ai-search-input" 
                   value="${activeFilters.keyword || ''}" 
                   placeholder="試試輸入自然語言：例如「找 3000 元以下上課筆記平板」或「微積分課本交換」..." 
                   class="w-full bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-800/80 rounded-2xl px-4 py-3.5 text-xs md:text-sm text-slate-800 dark:text-slate-100 pr-32 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 shadow-inner">
            <button onclick="window.UniApp.onAISearchSubmit()" class="absolute right-2 top-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1 active:scale-95">
              <span>✨</span>
              <span>AI 智能尋寶</span>
            </button>
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span class="text-slate-400 dark:text-slate-500 text-[11px]">熱門推薦：</span>
            <button onclick="window.UniApp.applyPresetQuery('找 3000 元以下適合上課的二手平板')" class="px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              📱 3,000 元內二手 iPad/平板
            </button>
            <button onclick="window.UniApp.applyPresetQuery('微積分 Stewart 第9版 找交換')" class="px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              📚 微積分 9th 原文書換課本
            </button>
            <button onclick="window.UniApp.applyPresetQuery('宿舍出清 免費贈送')" class="px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              🎁 宿舍零元免費贈送電鍋
            </button>
          </div>

          <!-- AI Parsed Status Banner (if active) -->
          <div id="ai-parsed-status" class="hidden text-xs bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl p-2.5 text-indigo-800 dark:text-indigo-300 font-medium flex items-center justify-between">
            <span id="ai-parsed-text"></span>
            <button onclick="window.UniApp.clearAISearch()" class="text-[11px] underline opacity-80 hover:opacity-100">清除並看全部</button>
          </div>
        </div>

        <!-- Filter Controls (Categories, Trade Mode, Price Range, Sort) -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-xs">
          <!-- Category Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span class="font-bold text-slate-700 dark:text-slate-300 shrink-0 mr-1">商品分類：</span>
            ${categories.map(c => {
              const active = (activeFilters.category || '全部') === c;
              return `
                <button onclick="window.UniApp.onCategoryChange('${c}')" 
                        class="px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${active 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                  ${c === '課本教材' ? '📚 ' : c === '3C電子' ? '💻 ' : c === '家具生活' ? '🛋️ ' : c === '服飾配件' ? '👗 ' : '🌐 '}${c}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Secondary Filters Row: Trade Type, Price, Sort -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <!-- Trade Type Pills -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-bold text-slate-700 dark:text-slate-300 mr-1">交易方式：</span>
              ${tradeTypes.map(t => {
                const active = (activeFilters.tradeType || '全部') === t;
                return `
                  <button onclick="window.UniApp.onTradeTypeChange('${t}')"
                          class="px-2.5 py-1 rounded-lg font-medium transition-all ${active 
                            ? 'bg-purple-600 text-white shadow-xs' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                    ${t === '買賣' ? '💰 買賣' : t === '交換' ? '🔄 以物易物' : t === '免費贈送' ? '🎁 零元贈送' : '全部'}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Price & Sort -->
            <div class="flex items-center gap-3 flex-wrap">
              <!-- Price Input Range -->
              <div class="flex items-center gap-1.5">
                <span class="text-slate-500 font-medium">預算：$</span>
                <input type="number" id="filter-min-price" placeholder="最低" value="${activeFilters.minPrice || ''}" onchange="window.UniApp.onPriceChange()" class="w-16 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
                <span class="text-slate-400">~</span>
                <input type="number" id="filter-max-price" placeholder="最高" value="${activeFilters.maxPrice || ''}" onchange="window.UniApp.onPriceChange()" class="w-16 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
              </div>

              <!-- Sort Dropdown -->
              <div class="flex items-center gap-1">
                <span class="text-slate-500">排序：</span>
                <select id="filter-sort-select" onchange="window.UniApp.onSortChange(this.value)" class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden">
                  <option value="newest" ${(activeFilters.sort || 'newest') === 'newest' ? 'selected' : ''}>最新上架優先</option>
                  <option value="price-asc" ${activeFilters.sort === 'price-asc' ? 'selected' : ''}>價格：低到高</option>
                  <option value="price-desc" ${activeFilters.sort === 'price-desc' ? 'selected' : ''}>價格：高到低</option>
                  <option value="school-first" ${activeFilters.sort === 'school-first' ? 'selected' : ''}>同校面交優先</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
