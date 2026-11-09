// js/components/user-center.js - 個人中心、賣場狀態追蹤與評價信用系統
import { Store } from '../store.js';

export const UserCenter = {
  render() {
    const user = Store.getUserProfile();
    const allItems = Store.getItems();
    // 找出目前使用者上架的商品 (模擬 user.name 或是目前刊登的)
    const myListings = allItems.filter(item => item.seller && (item.seller.name.includes('我') || item.seller.email === user.email || item.seller.id === user.id));

    return `
      <div id="user-center-modal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 z-50 overflow-y-auto animate-fade-in" onclick="if(event.target === this) window.UniApp.closeModal()">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto relative">
          
          <button onclick="window.UniApp.closeModal()" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center text-sm font-bold shadow-sm">
            ✕
          </button>

          <!-- User Profile Banner -->
          <div class="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-3xl shadow-md border-2 border-white dark:border-slate-800">
              ${user.avatarEmoji || '🐶'}
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h2 class="text-base md:text-lg font-extrabold text-slate-900 dark:text-slate-100">${user.name}</h2>
                <span class="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  EDU.TW 校園認證 ✓
                </span>
              </div>
              <p class="text-xs text-slate-500">${user.school} · ${user.department || '資訊工程系'}</p>
              <div class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                冒險進度：Lv.${user.level} ${user.levelTitle} · 累計減碳 ${user.carbonSavedTotalKg}kg 🌱
              </div>
            </div>
          </div>

          <!-- Tabs: 我的賣場商品 / 成就勳章 / 信用評價 -->
          <div class="p-5 md:p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
            
            <!-- Section 1: 我的刊登與狀態追蹤 (中階功能 14 & 17) -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>📦</span> 我刊登的二手好物 (${myListings.length})
                </h3>
                <span class="text-[11px] text-slate-400">可隨時切換上架中、已預約或交易完成</span>
              </div>

              ${myListings.length === 0 ? `
                <div class="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-2">
                  <p>您目前尚未刊登任何商品</p>
                  <button onclick="window.UniApp.closeModal(); window.UniApp.openPostModal();" class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-xs">
                    立即 AI 拍照上架
                  </button>
                </div>
              ` : `
                <div class="space-y-2.5">
                  ${myListings.map(item => `
                    <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850">
                      <div class="flex items-center gap-3">
                        <span class="text-3xl">${item.images && item.images[0] ? item.images[0] : '📦'}</span>
                        <div>
                          <div class="font-bold text-slate-800 dark:text-slate-200">${item.title}</div>
                          <div class="text-[11px] text-slate-500">
                            ${item.price === 0 ? '免費贈送' : `NT$ ${item.price}`} · ${item.category} · 📍 ${item.meetupLocation}
                          </div>
                        </div>
                      </div>

                      <!-- Status Toggle Actions -->
                      <div class="flex items-center gap-1.5 shrink-0">
                        <select onchange="window.UniApp.onChangeListingStatus('${item.id}', this.value)" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-semibold text-xs text-indigo-600">
                          <option value="上架中" ${item.status === '上架中' ? 'selected' : ''}>上架中</option>
                          <option value="已預約" ${item.status === '已預約' ? 'selected' : ''}>已預約 (面交中)</option>
                          <option value="交易完成" ${item.status === '交易完成' ? 'selected' : ''}>交易完成 ✓</option>
                        </select>
                        <button onclick="window.UniApp.onDeleteListing('${item.id}')" class="px-2 py-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs" title="刪除商品">
                          🗑️
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- Section 2: 校園成就勳章牆 (遊戲化) -->
            <div class="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 class="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>🏆</span> 已解鎖成就勳章
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                ${(user.badges || []).map(b => `
                  <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                    <div class="text-2xl">${b.icon}</div>
                    <div class="font-bold text-slate-800 dark:text-slate-200 text-[11px]">${b.name}</div>
                    <div class="text-[10px] text-slate-400">${b.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Section 3: 評價信用與回饋機制 -->
            <div class="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 class="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>⭐</span> 買賣互評紀錄 (5.0 滿分信用)
              </h3>
              <div class="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900 rounded-xl p-3 text-xs space-y-1">
                <div class="flex justify-between items-center text-amber-900 dark:text-amber-200 font-bold">
                  <span>買家 王同學 給予 5 星好評：</span>
                  <span>★★★★★</span>
                </div>
                <p class="text-slate-600 dark:text-slate-300">「學長微積分課本保存超好，面交在總圖很準時，推推！」</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  }
};
