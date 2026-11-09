// js/components/gamification.js - 萌寵小動物吉祥物與校園冒險遊戲化系統
import { Store } from '../store.js';

export const Gamification = {
  // 校園萌寵資料庫
  MASCOTS: [
    { id: 'ntu', emoji: '🐶', name: '臺大黑白汪', role: '面交隊長 (同校安全面交)', school: '國立臺灣大學', color: 'indigo' },
    { id: 'ntnu', emoji: '🐱', name: '師大文藝貓', role: '課本知識官 (教材講義交換)', school: '國立臺灣師大', color: 'rose' },
    { id: 'nycu', emoji: '🦦', name: '交大極客獺', role: '3C 鑑價師 (科技行情分析)', school: '國立陽明交大', color: 'purple' },
    { id: 'ncku', emoji: '🦫', name: '成大水豚長老', role: '零元佛心綠色大使 (減碳循環)', school: '國立成功大學', color: 'emerald' },
    { id: 'ncu', emoji: '🐿️', name: '中央百寶松鼠', role: '願望清單管家 (收藏降價追蹤)', school: '國立中央大學', color: 'amber' }
  ],

  renderGamificationHeader(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const user = Store.getUserProfile();
    const expPercent = Math.min(100, Math.round((user.exp / user.maxExp) * 100));

    el.innerHTML = `
      <div class="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border border-emerald-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative cursor-pointer" onclick="window.UniApp.showMascotSelector()">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-2xl shadow-md border-2 border-white dark:border-slate-800 transition-transform hover:scale-105" title="點擊切換伴讀萌寵">
              ${user.avatarEmoji || '🐶'}
            </div>
            <span class="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white dark:border-slate-800">
              Lv.${user.level || 1}
            </span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-slate-800 dark:text-slate-100">${user.name}</span>
              <span class="text-[11px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                🐾 ${user.mascotName || '臺大黑白汪 (面交隊長)'}
              </span>
            </div>
            <!-- EXP Progress Bar -->
            <div class="flex items-center gap-2 mt-1.5">
              <div class="w-36 md:w-48 bg-emerald-200 dark:bg-emerald-950/60 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" style="width: ${expPercent}%;"></div>
              </div>
              <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">EXP ${user.exp} / ${user.maxExp} (減碳 ${user.carbonSavedTotalKg}kg 🌱)</span>
            </div>
          </div>
        </div>

        <!-- Badges & Lucky Box Button -->
        <div class="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button onclick="window.UniApp.openLuckyBox()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95">
            <span>🎁</span> 每日校園盲盒抽卡
          </button>
          <div class="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl text-xs">
            ${(user.badges || []).map(b => `<span title="${b.name}: ${b.desc}" class="cursor-pointer hover:scale-125 transition-transform">${b.icon}</span>`).join('')}
            <span class="text-[10px] text-slate-400 font-semibold ml-1">${(user.badges || []).length}勳章</span>
          </div>
        </div>
      </div>
    `;
  },

  renderMascotFilterBar(containerId, onSelectCallback) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span class="font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1">
          <span>🐾</span> 校園守護神獸：
        </span>
        ${this.MASCOTS.map(m => `
          <button onclick="window.UniApp.selectMascot('${m.id}')" 
                  class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-600 dark:text-slate-300 font-medium shrink-0 flex items-center gap-1.5 shadow-xs transition-all hover:scale-102">
            <span>${m.emoji}</span>
            <span>${m.name.split(' ')[0]}</span>
            <span class="text-[10px] opacity-75 font-normal">(${m.school.replace('國立', '')})</span>
          </button>
        `).join('')}
      </div>
    `;
  },

  drawLuckyBox() {
    const rewards = [
      { text: '獲得成大水豚長老加持【+50 減碳冒險點數】🌱', exp: 50 },
      { text: '獲得交大極客獺贈送【二手 3C 鑑價九折免手續費卷】⚡', exp: 40 },
      { text: '獲得師大文藝貓【原文書免運同校面交幸運符】📚', exp: 45 },
      { text: '獲得台大黑白汪【今日面交雙倍好運護身符】🐶', exp: 60 }
    ];
    const picked = rewards[Math.floor(Math.random() * rewards.length)];
    Store.addExp(picked.exp);
    return picked;
  }
};
