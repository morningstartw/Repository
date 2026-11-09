# 全國大學生二手物品交換與買賣平台 (UniSwap AI) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 打造一個免安裝依賴、開啟即可完整運作的全端體驗校園二手物品交換與買賣平台（UniSwap AI），包含 AI 購物助手、AI 拍照上架、價格估算、校園信箱認證、以物易物與面交地圖。

**Architecture:** 採用純現代標準前端技術棧（HTML5、ES6 模組化架構、Tailwind CSS、LocalStorage 狀態管理、內建瀏覽器單元測試組），確保教師或使用者在無 Node.js/Python 的純乾淨 Windows 環境下，直接點擊即可雙擊執行並重現所有交易閉環。

**Tech Stack:** 
- 前端：HTML5, CSS3, Tailwind CSS (CDN), Vanilla JavaScript (ES6 Modules)
- 狀態儲存：LocalStorage + 內建模擬資料庫 (Store Pattern)
- 測試體系：內建輕量化瀏覽器端自動化測試套件 (`test.html`)，點擊即跑自動化斷言

**Spec:** [PRD.md](file:///c:/HOMEWORK1109/PRD.md) 及 [UIUX.md](file:///c:/HOMEWORK1109/UIUX.md)

## Global Constraints
- 零環境安裝門檻：禁止依賴外部未安裝的 npm / node / python 套件伺服器，雙擊 `index.html` 即可立即運作。
- 完整包含作業規定的 1~10 入門功能、11~20 中階功能、4 大 AI 智慧功能。
- 所有 AI 數值與估算標註「✨ 系統估算值，僅供參考」。
- 全面支援手機與電腦螢幕 RWD 自適應。

## Review Focus
1. **價格合理性防呆**：最高價格小於最低價格時，搜尋引擎應阻斷或自動防呆修正，不可崩潰。
2. **交易狀態一致性**：當商品狀態從「上架中」變更為「已預約」或「交易完成」時，其他買家不能重複提出購買申請。
3. **以物易物差價計算**：當商品標註接受交換且補差價時，差價若為負數或零時能正確解析並提示。
4. **校園信箱格式檢驗**：非 `.edu.tw` 結尾之信箱必須被註冊機制擋下並顯示提示。
5. **公開問答個資保護**：提問內容中若包含手機格式（如 0912-345-678）時，提示警示訊息保護隱私。

---

### Task 1: 資料層與狀態管理模組 (Data Store & State Management)

**Files:**
- Create: `js/store.js`
- Create: `js/seed-data.js`
- Test: `tests/store.test.js`

**Interfaces:**
- Consumes: LocalStorage API
- Produces: `Store` 物件（包含 `getItems()`, `getItemById(id)`, `saveItem(item)`, `updateItemStatus(id, status)`, `addReview(sellerId, review)`, `toggleWishlist(id)` 等方法）

- [ ] **Step 1: 撰寫資料層測試斷言**
  在 `tests/store.test.js` 撰寫檢查新增商品、狀態變更（上架中 $\rightarrow$ 已預約 $\rightarrow$ 完成）、收藏清單之測試案例。
- [ ] **Step 2: 執行測試確認失敗**
- [ ] **Step 3: 實作 `js/seed-data.js` 與 `js/store.js`**
  提供預載的 8~12 筆逼真大學生商品（微積分課本、普物、iPad、Sony耳機、小電鍋、免費課外書等），包含學校、新舊、交易模式、面交地點與賣家資料。
- [ ] **Step 4: 執行測試確認全數通過**
- [ ] **Step 5: 版本控制登記存檔**

---

### Task 2: 篩選、排序與搜尋核心引擎 (Search, Filter & Sorting Engine)

**Files:**
- Create: `js/filter-engine.js`
- Modify: `tests/filter.test.js`

**Interfaces:**
- Consumes: `Store.getItems()`
- Produces: `filterItems(items, criteria)` 回傳過濾並排序後的商品陣列

- [ ] **Step 1: 撰寫篩選與排序測試案例**
  測試分類膠囊、關鍵字模糊搜尋、價格區間防呆（最低~最高）、同校面交優先、交易模式（買賣/交換/贈送）過濾。
- [ ] **Step 2: 執行測試確認失敗**
- [ ] **Step 3: 實作 `js/filter-engine.js`**
  精確支援多維度條件組合與排序演算法。
- [ ] **Step 4: 執行測試確認全部通過**
- [ ] **Step 5: 版本控制登記存檔**

---

### Task 3: 4 大 AI 智慧運算模組 (AI Simulation Engines)

**Files:**
- Create: `js/ai-engine.js`
- Test: `tests/ai.test.js`

**Interfaces:**
- Produces:
  - `parseNaturalQuery(queryStr)`: 自然語言問答搜尋解析（提取預算、關鍵字、品項）
  - `autoAnalyzePhoto(photoType)`: 拍照自動辨識上架模擬（產生物品名、分類、新舊與標題）
  - `estimatePrice(category, condition, originalPrice)`: AI 合理價格與二手折舊區間估算
  - `getPersonalizedRecommendations(userProfile, allItems)`: 個人化推薦演算法

- [ ] **Step 1: 撰寫 AI 智慧模組測試案例**
  驗證「找 3000 元以下二手平板」能解析出 `maxPrice: 3000` 與 `category: '3C電子'`。
- [ ] **Step 2: 執行測試確認失敗**
- [ ] **Step 3: 實作 `js/ai-engine.js`**
- [ ] **Step 4: 執行測試確認全部通過**
- [ ] **Step 5: 版本控制登記存檔**

---

### Task 4: 主頁面與 RWD 響應式介面外殼 (UI Shell & Components)

**Files:**
- Create: `index.html`
- Create: `js/components/navbar.js`
- Create: `js/components/hero-ai.js`
- Create: `js/components/product-card.js`
- Create: `js/components/gamification.js`

**Interfaces:**
- Consumes: `Store`, `filterEngine`, `AIEngine`
- Produces: 完整渲染的首頁、AI 購物搜尋區塊、小動物吉祥物導覽、校園冒險 EXP 等級條、每日好物抽盲盒按鈕、商品卡片網格與手機底部導覽列

- [ ] **Step 1: 建立 `index.html` 基本結構與 Tailwind CDN 配置**
- [ ] **Step 2: 實作頂部 Navbar（學校小動物吉祥物切換、EXP 冒險經驗值、通知、會員切換）**
- [ ] **Step 3: 實作 AI 智慧問答 Hero 搜尋橫幅與熱門膠囊點擊互動**
- [ ] **Step 4: 實作小動物萌寵系統與每日好物抽盲盒 (Daily Lucky Drop) 互動**
- [ ] **Step 5: 實作商品卡片元件（含買賣/交換/贈送標籤、EDU 認證徽章、面交地標）**
- [ ] **Step 6: 驗證 RWD 手機版自適應顯示**

---

### Task 5: 商品詳情、以物易物與面交地圖互動模組 (Product Detail & Trading Modals)

**Files:**
- Create: `js/components/product-modal.js`
- Create: `js/components/meetup-map.js`
- Create: `js/components/qa-board.js`

**Interfaces:**
- Consumes: `Store`, `itemData`
- Produces: 詳細彈窗、多圖展示、交換意向與差價試算、校園面交地圖示意、公開問答留言互動

- [ ] **Step 1: 實作商品詳情互動視窗（展示 AI 定價區間、新舊度、賣家評價）**
- [ ] **Step 2: 實作校園面交建議地標模組（總圖、學餐、宿舍等打卡點）**
- [ ] **Step 3: 實作公開問答留言板（支援買家發問、賣家回覆、個資安全過濾）**
- [ ] **Step 4: 實作【出價購買】與【申請以物易物】表單彈窗**

---

### Task 6: 商品刊登與 AI 一鍵拍照辨識上架流程 (Listing & AI Auto-fill)

**Files:**
- Create: `js/components/post-modal.js`

**Interfaces:**
- Consumes: `AIEngine.autoAnalyzePhoto`, `Store.saveItem`
- Produces: 刊登商品表單、相片上傳預覽、AI 自動填表觸發器、必填欄位驗證

- [ ] **Step 1: 建立刊登商品表單（包含名稱、分類、價格、新舊、交易模式、面交地點）**
- [ ] **Step 2: 實作「📸 AI 拍照辨識範例」按鈕，點擊後自動代入辨識結果與定價建議**
- [ ] **Step 3: 實作表單防呆驗證並儲存進 `Store`，成功後即時刷新列表**

---

### Task 7: 會員中心、交易狀態追蹤與管理員後台 (User Center & Admin Console)

**Files:**
- Create: `js/components/user-center.js`
- Create: `js/components/admin-modal.js`

**Interfaces:**
- Consumes: `Store`
- Produces: 個人檔案賣場、商品狀態切換器（上架中/已預約/交易完成）、評價打星、檢舉審核後台

- [ ] **Step 1: 實作個人賣場（可切換上架中/已預約/已完成，支援下架）**
- [ ] **Step 2: 實作交易完成互評機制（累積星級與評論紀錄）**
- [ ] **Step 3: 實作管理員審查後台（檢視檢舉案件、一鍵下架違規商品）**

---

### Task 8: 內建驗證測試頁面與專題展示腳本 (Test Suite & 3-Min Demo Script)

**Files:**
- Create: `test.html`
- Create: `README.md`
- Create: `3MIN_DEMO.md`
- Create: `AI_REFLECTION.md`

**Interfaces:**
- Produces: 一鍵執行驗收測試的網頁、專題啟動說明文件、3分鐘口頭展示逐字稿、AI協作反思報告

- [ ] **Step 1: 實作 `test.html` 視覺化測試運行器（點擊即可在瀏覽器內驗證所有功能點）**
- [ ] **Step 2: 撰寫 `README.md`（啟動說明、測試帳號、功能對照表）**
- [ ] **Step 3: 撰寫 `3MIN_DEMO.md`（完整示範使用者流程與評審報告逐字腳本）**
- [ ] **Step 4: 撰寫 `AI_REFLECTION.md`（提示詞清單、AI 解決問題過程與學習心得）**
