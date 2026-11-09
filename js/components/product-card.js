// js/components/product-card.js - 商品卡片渲染元件
import { Store } from '../store.js';
import { Security } from '../security.js';

export const ProductCard = {
  render(item) {
    const isWishlisted = Store.isWishlisted(item.id);
    const seller = item.seller || { name: '同學', school: item.school, rating: 5.0, verifiedEdu: true, mascot: '🐶' };
    const isFree = item.price === 0 || (item.tradeType && item.tradeType.includes('贈送'));

    const safeTitle = Security.escapeHtml(item.title);
    const safeDesc = Security.escapeHtml(item.description);
    const safeSellerName = Security.escapeHtml(seller.name);
    const safeCategory = Security.escapeHtml(item.category);
    const safeCondition = Security.escapeHtml(item.condition);
    const safeLocation = Security.escapeHtml(item.meetupLocation ? item.meetupLocation.split('/')[0].trim() : item.school);

    // 交易方式色彩
    let tradeBadgeClass = 'bg-indigo-600 text-white';
    let tradeText = '💰 買賣交易';
    if (item.tradeType.includes('交換')) {
      tradeBadgeClass = 'bg-purple-600 text-white';
      tradeText = '🔄 以物易物';
    } else if (isFree) {
      tradeBadgeClass = 'bg-emerald-600 text-white';
      tradeText = '🎁 零元贈送';
    }

    // 狀態標籤
    let statusBadge = '';
    if (item.status === '已預約') {
      statusBadge = '<span class="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold">已預約 (面交中)</span>';
    } else if (item.status === '交易完成') {
      statusBadge = '<span class="px-2 py-0.5 rounded-md bg-slate-500 text-white text-[10px] font-bold">交易已完成</span>';
    }

    return `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group relative cursor-pointer" onclick="window.UniApp.openProductModal('${item.id}')">
        
        <!-- Top Image Container -->
        <div class="h-40 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-850 flex items-center justify-center text-5xl relative overflow-hidden select-none">
          <span class="group-hover:scale-110 transition-transform duration-300">${item.images && item.images[0] ? item.images[0] : '📦'}</span>
          
          <!-- Trade Type Badge -->
          <span class="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs ${tradeBadgeClass}">
            ${tradeText}
          </span>

          <!-- EXP Reward Badge -->
          <span class="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
            <span>⚡</span> +${item.ecoExp || 30} EXP
          </span>

          <!-- Wishlist Heart Button -->
          <button onclick="event.stopPropagation(); window.UniApp.onToggleWishlist('${item.id}')" 
                  class="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center justify-center text-sm shadow-md hover:scale-110 transition-transform">
            <span>${isWishlisted ? '❤️' : '🤍'}</span>
          </button>
        </div>

        <!-- Body Content -->
        <div class="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-1">
              <span class="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                ${safeCategory} · ${safeCondition}
              </span>
              ${statusBadge}
            </div>

            <h3 class="font-bold text-xs md:text-sm text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              ${safeTitle}
            </h3>

            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              ${safeDesc}
            </p>
          </div>

          <!-- Price & AI Valuation -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-base md:text-lg font-black ${isFree ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}">
                  ${isFree ? 'FREE $0' : `NT$ ${item.price.toLocaleString()}`}
                </span>
                ${item.originalPrice ? `<span class="text-[11px] text-slate-400 line-through ml-1.5">市價 $${item.originalPrice.toLocaleString()}</span>` : ''}
              </div>
              ${item.exchangeWish ? `<span class="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.5 rounded">可補差價換</span>` : ''}
            </div>

            <!-- AI Price Valuation Snippet -->
            <div class="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-lg px-2 py-1 flex items-center justify-between text-[10px] text-indigo-700 dark:text-indigo-300">
              <span class="flex items-center gap-1 font-medium">
                <span>✨</span> AI 估算行情：
              </span>
              <span class="font-bold">${item.aiValuation ? `NT$ ${item.aiValuation.low} ~ ${item.aiValuation.high}` : '行情分析中'}</span>
            </div>
          </div>

          <!-- Seller & Campus Meetup Footer -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div class="flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs">${seller.mascot || '🐶'}</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">${safeSellerName}</span>
              ${seller.verifiedEdu ? '<span class="text-emerald-600 font-bold" title="已通過 .edu.tw 身分驗證">✓</span>' : ''}
              <span class="text-[10px] text-amber-500 font-bold">★${seller.rating || 5.0}</span>
            </div>
            <span class="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">
              📍 ${safeLocation}
            </span>
          </div>
        </div>
      </div>
    `;
  }
};
