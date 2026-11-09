// js/components/navbar.js - 頂部導覽列與狀態切換
import { Store } from '../store.js';

export const Navbar = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const user = Store.getUserProfile();
    const wishlistCount = (user.wishlistIds || []).length;
    const unreadNoticeCount = (user.notifications || []).filter(n => !n.read).length;

    el.innerHTML = `
      <header class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <!-- Logo & Title -->
          <div class="flex items-center gap-2.5 cursor-pointer" onclick="window.UniApp.resetAllFilters()">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-md transition-transform hover:scale-105">
              🐾
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">UniSwap AI</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">校園版</span>
              </div>
              <span class="text-[11px] block text-slate-500 dark:text-slate-400">全國大學生二手物品交換與買賣平台</span>
            </div>
          </div>

          <!-- School Switcher with 同校優先 Toggle -->
          <div class="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span class="text-slate-500 ml-1">📍 學校：</span>
            <select id="nav-school-select" onchange="window.UniApp.onSchoolChange(this.value)" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden">
              <option value="國立臺灣大學" selected>國立臺灣大學 (我的學校)</option>
              <option value="國立臺灣師大">國立臺灣師大</option>
              <option value="國立臺灣科技大學">國立臺灣科技大學</option>
              <option value="國立成功大學">國立成功大學</option>
              <option value="國立中央大學">國立中央大學</option>
              <option value="全部">全國跨校不限</option>
            </select>
            <label class="flex items-center gap-1.5 cursor-pointer pl-1 pr-2 text-slate-600 dark:text-slate-300 font-medium">
              <input type="checkbox" id="nav-school-only" onchange="window.UniApp.onSchoolOnlyToggle(this.checked)" checked class="rounded text-indigo-600 focus:ring-indigo-500">
              <span>同校面交優先</span>
            </label>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <!-- 📸 AI 拍照上架 -->
            <button onclick="window.UniApp.openPostModal()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95">
              <span>📸</span>
              <span class="hidden sm:inline">AI 拍照上架</span>
              <span class="sm:hidden">刊登</span>
            </button>

            <!-- Wishlist Heart -->
            <button onclick="window.UniApp.toggleWishlistFilter()" id="btn-wishlist-filter" class="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors" title="我的收藏">
              <span class="text-sm">❤️</span>
              <span id="nav-wishlist-count" class="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">${wishlistCount}</span>
            </button>

            <!-- Notifications -->
            <button onclick="window.UniApp.openNotificationsModal()" class="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors" title="站內通知">
              <span class="text-sm">🔔</span>
              ${unreadNoticeCount > 0 ? `<span class="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">${unreadNoticeCount}</span>` : ''}
            </button>

            <!-- User Center Profile -->
            <button onclick="window.UniApp.openUserCenterModal()" class="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors">
              <span class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-sm">${user.avatarEmoji || '🐶'}</span>
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">個人中心</span>
            </button>

            <!-- Admin Toggle Button (for grading check) -->
            <button onclick="window.UniApp.openAdminModal()" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 text-xs font-bold" title="管理員後台審查">
              🛡️
            </button>
          </div>
        </div>
      </header>
    `;
  }
};
