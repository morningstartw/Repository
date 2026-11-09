// js/components/post-modal.js - 商品刊登與 AI 一鍵拍照自動填表彈窗
import { Store } from '../store.js';
import { AIEngine } from '../ai-engine.js';

export const PostModal = {
  render() {
    const user = Store.getUserProfile();

    return `
      <div id="post-item-modal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 z-50 overflow-y-auto animate-fade-in" onclick="if(event.target === this) window.UniApp.closeModal()">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto relative">
          
          <!-- Close Button -->
          <button onclick="window.UniApp.closeModal()" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center text-sm font-bold shadow-sm">
            ✕
          </button>

          <!-- Header -->
          <div class="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <h2 class="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>📸</span> 刊登二手商品 · AI 智能輔助上架
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              可點選下方「AI 拍照模擬辨識」，體驗拍照即時分析品名、分類與合理價格！
            </p>
          </div>

          <!-- Form Body -->
          <div class="p-5 md:p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
            
            <!-- AI Photo Recognition Simulation Presets -->
            <div class="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 rounded-2xl p-3.5 space-y-2">
              <div class="flex items-center justify-between font-bold text-indigo-800 dark:text-indigo-300">
                <span class="flex items-center gap-1.5">
                  <span class="text-base">✨</span> 體驗 AI 拍照辨識自動填表：
                </span>
                <span class="text-[10px] bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded-full font-semibold">
                  一鍵自動帶入
                </span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button type="button" onclick="window.UniApp.applyAIPhotoPreset('book_calculus')" class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 hover:border-indigo-500 text-center space-y-0.5 transition-all hover:scale-102">
                  <div class="text-xl">📚</div>
                  <div class="font-bold text-[11px] truncate">微積分原文書</div>
                  <div class="text-[9px] text-slate-400">教材換課本</div>
                </button>
                <button type="button" onclick="window.UniApp.applyAIPhotoPreset('ipad')" class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 hover:border-indigo-500 text-center space-y-0.5 transition-all hover:scale-102">
                  <div class="text-xl">📱</div>
                  <div class="font-bold text-[11px] truncate">Apple iPad</div>
                  <div class="text-[9px] text-slate-400">3C 二手出清</div>
                </button>
                <button type="button" onclick="window.UniApp.applyAIPhotoPreset('cooker')" class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 hover:border-indigo-500 text-center space-y-0.5 transition-all hover:scale-102">
                  <div class="text-xl">🍲</div>
                  <div class="font-bold text-[11px] truncate">宿舍大同電鍋</div>
                  <div class="text-[9px] text-emerald-600 font-bold">零元免費贈送</div>
                </button>
                <button type="button" onclick="window.UniApp.applyAIPhotoPreset('headphones')" class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 hover:border-indigo-500 text-center space-y-0.5 transition-all hover:scale-102">
                  <div class="text-xl">🎧</div>
                  <div class="font-bold text-[11px] truncate">Sony 降噪耳機</div>
                  <div class="text-[9px] text-slate-400">自習神物</div>
                </button>
              </div>
            </div>

            <form id="post-item-form" onsubmit="window.UniApp.submitPostForm(event)" class="space-y-3.5">
              <!-- Item Title -->
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  商品標題 <span class="text-rose-500">*</span>
                </label>
                <input type="text" id="post-title" required placeholder="例如：Stewart 微積分 9th 原文書 (附期中期末考古題)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500">
              </div>

              <!-- Category & Condition Row -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">商品分類 *</label>
                  <select id="post-category" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs">
                    <option value="課本教材">📚 課本教材</option>
                    <option value="3C電子">💻 3C電子</option>
                    <option value="家具生活">🛋️ 家具生活</option>
                    <option value="服飾配件">👗 服飾配件</option>
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">新舊保存狀況 *</label>
                  <select id="post-condition" required onchange="window.UniApp.onPostConditionChange()" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs">
                    <option value="95成新">95成新 (外觀如新)</option>
                    <option value="9成新" selected>9成新 (輕微使用痕跡)</option>
                    <option value="85成新">85成新 (功能良好)</option>
                    <option value="8成新">8成新 (正常磨損)</option>
                    <option value="7成新">7成新 (外觀明顯瑕疵)</option>
                  </select>
                </div>
              </div>

              <!-- Price & Trade Type -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    欲售金額 (填 0 即為免費贈送) *
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                    <input type="number" id="post-price" required min="0" value="450" oninput="window.UniApp.onPostPriceInput(this.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  </div>
                </div>
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">交易方式 *</label>
                  <select id="post-trade-type" required onchange="window.UniApp.onPostTradeTypeChange(this.value)" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs">
                    <option value="買賣">💰 買賣交易</option>
                    <option value="交換/買賣">🔄 以物易物 (可買賣或換物)</option>
                    <option value="免費贈送">🎁 零元免費贈送</option>
                  </select>
                </div>
              </div>

              <!-- AI Valuation Helper Tip -->
              <div id="post-ai-estimate-box" class="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl p-2.5 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
                <span class="flex items-center gap-1">
                  <span>✨</span> AI 估算合理售價區間：
                </span>
                <span id="post-ai-estimate-val" class="font-bold">NT$ 400 ~ 500</span>
              </div>

              <!-- Exchange Wish Inputs (Shown if tradeType includes 交換) -->
              <div id="post-exchange-box" class="hidden bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-3 space-y-2">
                <label class="block font-bold text-purple-800 dark:text-purple-300">
                  希望交換的物品心願
                </label>
                <input type="text" id="post-exchange-target" placeholder="例如：想換 線性代數 或 微分方程 教科書" class="w-full bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-1.5 text-xs">
                <label class="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-medium">
                  <input type="checkbox" id="post-exchange-diff" checked class="rounded text-purple-600">
                  <span>可接受補差價 (雙方約定金額 ±$100~200)</span>
                </label>
              </div>

              <!-- School & Meetup Location -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">所屬學校</label>
                  <input type="text" id="post-school" readonly value="${user.school || '國立臺灣大學'}" class="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-500">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">校園面交建議地點 *</label>
                  <input type="text" id="post-meetup" required placeholder="例如：總圖書館正門 / 小福商場" value="台大總圖書館門口" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs">
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">詳細說明</label>
                <textarea id="post-desc" rows="3" placeholder="註明物品現況、有無筆記劃記、面交方便時間等..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs leading-relaxed focus:outline-hidden"></textarea>
              </div>

              <!-- Submit Button -->
              <div class="pt-2">
                <button type="submit" class="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2">
                  <span>🚀</span> 確認刊登上架 (獲得 +30 冒險 EXP 🌱)
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    `;
  }
};
