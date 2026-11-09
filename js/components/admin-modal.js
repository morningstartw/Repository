// js/components/admin-modal.js - 管理員審查與爭議處理後台
import { Store } from '../store.js';

export const AdminModal = {
  render() {
    const reports = Store.getReports();
    const items = Store.getItems();

    return `
      <div id="admin-modal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 z-50 overflow-y-auto animate-fade-in" onclick="if(event.target === this) window.UniApp.closeModal()">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto relative">
          
          <button onclick="window.UniApp.closeModal()" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center text-sm font-bold shadow-sm">
            ✕
          </button>

          <!-- Header -->
          <div class="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-850 text-white flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xl">🛡️</span>
                <h2 class="text-base md:text-lg font-bold">校園二手平台 · 管理員後台控制中心</h2>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">中階功能 19 驗收：會員審查、爭議商品檢舉案件處置</p>
            </div>
            <span class="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full font-mono font-bold">
              系統監控中
            </span>
          </div>

          <!-- Body -->
          <div class="p-5 md:p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
            
            <!-- Section 1: 爭議檢舉審核案件 -->
            <div class="space-y-2.5">
              <h3 class="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>🚩 待處理檢舉案件 (${reports.length})</span>
                <span class="text-xs font-normal text-slate-400">審查會員回報之價格不實或商品違規</span>
              </h3>

              ${reports.length === 0 ? `
                <div class="text-center py-6 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
                  目前無待審核的檢舉案件，校園交易秩序良好！
                </div>
              ` : `
                <div class="space-y-2">
                  ${reports.map(rep => {
                    const reportedItem = items.find(i => i.id === rep.itemId) || { title: '已下架之商品' };
                    return `
                      <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-850 space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-slate-800 dark:text-slate-200">
                            案件 #${rep.id} · 檢舉對象：【${reportedItem.title}】
                          </span>
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${rep.status === '待審核' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}">
                            ${rep.status}
                          </span>
                        </div>
                        <div class="text-[11px] text-slate-600 dark:text-slate-300">
                          <strong>檢舉事由：</strong>${rep.reason} (檢舉人：${rep.reporter})
                        </div>
                        ${rep.status === '待審核' ? `
                          <div class="flex justify-end gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            <button onclick="window.UniApp.resolveReport('${rep.id}', 'dismiss')" class="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-medium">
                              駁回檢舉
                            </button>
                            <button onclick="window.UniApp.resolveReport('${rep.id}', 'remove')" class="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs">
                              確認處置並下架商品
                            </button>
                          </div>
                        ` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>

            <!-- Section 2: 全站商品總覽與快速控管 -->
            <div class="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 class="font-bold text-sm text-slate-900 dark:text-slate-100">
                📦 全站上架商品監控 (${items.length}件)
              </h3>
              <div class="max-h-40 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-800 rounded-xl p-2">
                ${items.map(it => `
                  <div class="flex items-center justify-between py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[11px]">
                    <span class="truncate max-w-[60%] font-medium">${it.title}</span>
                    <span class="text-slate-400">${it.school} · ${it.status}</span>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  }
};
