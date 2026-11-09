// js/components/product-modal.js - 商品詳情、以物易物申請、面交地標與公開問答彈窗
import { Store } from '../store.js';

export const ProductModal = {
  render(itemId) {
    const item = Store.getItemById(itemId);
    if (!item) return '';

    const seller = item.seller || { name: '同學', school: item.school, rating: 5.0, verifiedEdu: true, mascot: '🐶' };
    const isFree = item.price === 0 || item.tradeType.includes('贈送');
    const isWishlisted = Store.isWishlisted(item.id);
    const questions = item.questions || [];

    return `
      <div id="product-detail-modal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 z-50 overflow-y-auto animate-fade-in" onclick="if(event.target === this) window.UniApp.closeModal()">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto relative">
          
          <!-- Close Button -->
          <button onclick="window.UniApp.closeModal()" class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center text-sm font-bold shadow-sm transition-transform active:scale-90">
            ✕
          </button>

          <!-- Top Image & Badges -->
          <div class="h-48 md:h-56 bg-gradient-to-tr from-slate-100 to-indigo-50 dark:from-slate-800 dark:to-slate-850 flex items-center justify-center text-7xl relative select-none">
            <span>${item.images && item.images[0] ? item.images[0] : '📦'}</span>
            
            <span class="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-xl shadow-md ${isFree ? 'bg-emerald-600 text-white' : item.tradeType.includes('交換') ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white'}">
              ${item.tradeType}
            </span>

            <span class="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              🌱 環保減碳估算：約 ${item.carbonSavedKg || 3.0} kg
            </span>
          </div>

          <!-- Content Details -->
          <div class="p-5 md:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            
            <!-- Title & Price -->
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                  ${item.category}
                </span>
                <span class="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  新舊度：${item.condition}
                </span>
                <span class="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                  狀態：${item.status}
                </span>
              </div>

              <h2 class="text-lg md:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                ${item.title}
              </h2>

              <div class="flex items-baseline gap-2 pt-1">
                <span class="text-2xl font-black ${isFree ? 'text-emerald-600' : 'text-indigo-600 dark:text-indigo-400'}">
                  ${isFree ? 'FREE $0 (免費贈送)' : `NT$ ${item.price.toLocaleString()}`}
                </span>
                ${item.originalPrice ? `<span class="text-xs text-slate-400 line-through">市價約 NT$ ${item.originalPrice.toLocaleString()}</span>` : ''}
              </div>
            </div>

            <!-- AI Price Valuation Box -->
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-3.5 space-y-1.5 text-xs">
              <div class="flex items-center justify-between font-bold text-indigo-800 dark:text-indigo-300">
                <span class="flex items-center gap-1.5">
                  <span class="text-base">✨</span> AI 智能價格分析：
                </span>
                <span>建議區間 NT$ ${item.aiValuation ? `${item.aiValuation.low} ~ ${item.aiValuation.high}` : '行情估算中'}</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                ${item.aiValuation ? item.aiValuation.note : '依據各大專院校歷史二手價格、新舊程度與折舊率模型試算'} 
                <span class="text-amber-600 dark:text-amber-400 font-semibold">(✨ 系統估算值，僅供參考)</span>
              </p>
            </div>

            <!-- Exchange Wish Box (if Barter) -->
            ${item.exchangeWish ? `
              <div class="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-3.5 space-y-1 text-xs">
                <div class="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <span>🔄</span> 賣家以物易物心願：
                </div>
                <div class="text-slate-700 dark:text-slate-200 font-medium">
                  目標物品：<span class="font-bold text-purple-600 dark:text-purple-400">${item.exchangeWish.targetItem}</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  ${item.exchangeWish.acceptPriceDiff ? `✓ 賣家願意接受補差價 (約 ±$${item.exchangeWish.priceDiffRange || 100} 元)` : '✕ 賣家希望等價物品交換，不另補差價'}
                </p>
              </div>
            ` : ''}

            <!-- Description -->
            <div class="space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span class="font-bold block text-slate-900 dark:text-slate-100">商品完整說明：</span>
              <p class="whitespace-pre-line">${item.description}</p>
            </div>

            <!-- Campus Meetup Location & Map Indicator -->
            <div class="border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>📍</span> 建議同校面交地點：
                </span>
                <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                  校園公共安全場所
                </span>
              </div>
              <div class="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
                ${item.school} · ${item.meetupLocation}
              </div>
              <p class="text-[11px] text-slate-400">
                ⚠️ 校園面交提醒：優先約在校園總圖門口、學生餐廳、校門警衛室等燈光明亮且人流充足地點。
              </p>
            </div>

            <!-- Seller Card -->
            <div class="border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-xl shadow-xs">
                  ${seller.mascot || '🐶'}
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-slate-900 dark:text-slate-100 text-sm">${seller.name}</span>
                    ${seller.verifiedEdu ? '<span class="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-300">EDU 信箱已認證 ✓</span>' : ''}
                  </div>
                  <span class="text-[11px] text-slate-500">${seller.school} · ${seller.department || '在校學生'}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-amber-500 font-bold text-sm">★ ${seller.rating || 5.0}</div>
                <span class="text-[10px] text-slate-400">已累積 ${seller.reviewCount || 10} 筆好評</span>
              </div>
            </div>

            <!-- Public Q&A Board -->
            <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <span>💬</span> 公開問答留言區 (${questions.length})
                </span>
                <span class="text-[11px] text-slate-400">系統自動過濾電話與個資</span>
              </div>

              <!-- Question Input Form -->
              <div class="flex gap-2">
                <input type="text" id="qa-input-text" placeholder="向賣家詢問商品細節 (請勿公開留電話或宿舍號碼)..." class="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-hidden">
                <button onclick="window.UniApp.submitQuestion('${item.id}')" class="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs hover:bg-slate-900">
                  提問
                </button>
              </div>

              <!-- Questions List -->
              <div class="space-y-2">
                ${questions.length === 0 ? `
                  <p class="text-xs text-slate-400 text-center py-2">目前尚無同學提問，點擊上方即可搶先留言！</p>
                ` : questions.map(q => `
                  <div class="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                    <div class="flex items-center justify-between text-slate-500">
                      <span class="font-bold text-slate-700 dark:text-slate-300">🙋 ${q.author}：</span>
                      <span class="text-[10px]">公開提問</span>
                    </div>
                    <p class="text-slate-800 dark:text-slate-200 pl-4 border-l-2 border-indigo-400">${q.text}</p>
                    ${q.answer ? `
                      <div class="mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-indigo-700 dark:text-indigo-400 pl-4">
                        <span class="font-bold">賣家回覆：</span>${q.answer}
                      </div>
                    ` : `
                      <button onclick="window.UniApp.replyQuestion('${item.id}', '${q.id}')" class="text-[11px] text-indigo-600 hover:underline">
                        賣家回覆...
                      </button>
                    `}
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Bottom CTA Action Bar -->
          <div class="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <button onclick="window.UniApp.onToggleWishlist('${item.id}')" class="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                <span>${isWishlisted ? '❤️ 已收藏' : '🤍 收藏好物'}</span>
              </button>
              <button onclick="window.UniApp.openReportModal('${item.id}')" class="p-2 rounded-xl text-slate-400 hover:text-rose-500 text-xs" title="檢舉爭議商品">
                🚩 檢舉
              </button>
            </div>

            <div class="flex items-center gap-2">
              ${isFree ? `
                <button onclick="window.UniApp.submitTradeRequest('${item.id}', '排隊免費索取')" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5">
                  <span>🎁</span> 排隊免費索取 (+100 EXP)
                </button>
              ` : item.tradeType.includes('交換') ? `
                <button onclick="window.UniApp.submitTradeRequest('${item.id}', '提出以物易物交換')" class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5">
                  <span>🔄</span> 申請物品交換
                </button>
                <button onclick="window.UniApp.submitTradeRequest('${item.id}', '出價現金購買')" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95">
                  出價購買
                </button>
              ` : `
                <button onclick="window.UniApp.submitTradeRequest('${item.id}', '出價現金購買')" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5">
                  <span>💰</span> 立即出價 / 約定面交
                </button>
              `}
            </div>
          </div>

        </div>
      </div>
    `;
  }
};
