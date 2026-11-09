// js/security.js - 安全性防護與資料校驗核心模組
// 包含：XSS 防禦跳脫、個資 (PII) 隱私防護過濾、校園 Email 網域檢驗、狀態機權限檢查

export const Security = {
  /**
   * 1. XSS 跳脫處理 (HTML Entity Encoding)
   * 避免惡意使用者透過商品標題、說明或留言注入 <script> 或 onerror 腳本
   */
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /**
   * 2. 個資 (PII) 與隱私防護過濾器
   * 檢測是否包含臺灣手機門號 (09xx-xxx-xxx 或 09xxxxxxxx)、LINE ID、市話
   */
  checkPiiLeakage(text = '') {
    const raw = String(text);
    const checks = [];

    // 手機門號檢測 (09xx-xxx-xxx, 09xx xxx xxx, 09xxxxxxxx, +8869xxxxxxxx)
    const phonePattern = /(?:(?:\+?886\s*9|09)\d{2}[-\s]?\d{3}[-\s]?\d{3}|(?:\+?886\s*9|09)\d{8})/;
    if (phonePattern.test(raw)) {
      checks.push({ type: 'PHONE', message: '偵測到疑似臺灣手機門號，禁止公開發布以保護個資安全。' });
    }

    // LINE ID 格式檢測 (例如 "LINE: xxx", "賴我: xxx")
    const linePattern = /(?:line\s*(?:id)?|賴|賴我|加我line)[:：\s]+[a-zA-Z0-9_.-]{4,20}/i;
    if (linePattern.test(raw)) {
      checks.push({ type: 'LINE_ID', message: '偵測到公開通訊軟體帳號，建議改由站內安全聊聊約定。' });
    }

    // 電子郵件洩漏 (非校園官方認證展示之公開欄位)
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (emailPattern.test(raw)) {
      checks.push({ type: 'EMAIL', message: '偵測到公開電子郵件地址，請勿在留言區洩漏。' });
    }

    return {
      hasLeakage: checks.length > 0,
      violations: checks
    };
  },

  /**
   * 3. 校園信箱驗證檢測 (Strict EDU.TW Domain Check)
   * 嚴格確保結尾為 .edu.tw，防止例如 user@fake-edu.tw.attacker.com 繞過
   */
  validateEduEmail(email = '') {
    if (!email || typeof email !== 'string') return false;
    const clean = email.trim().toLowerCase();
    // 嚴格正規表達式：以 .edu.tw 結尾，且前面必須有合法帳號與校園網域名
    const eduTwRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.tw$/;
    return eduTwRegex.test(clean);
  },

  /**
   * 4. 價格數值防呆與邊界檢查
   */
  validatePrice(price) {
    if (price === undefined || price === null || price === '') {
      return { valid: false, error: '價格不可為空' };
    }
    const num = Number(price);
    if (isNaN(num)) {
      return { valid: false, error: '價格必須為有效數字' };
    }
    if (num < 0) {
      return { valid: false, error: '價格不可為負數' };
    }
    if (num > 1000000) {
      return { valid: false, error: '商品單價超過一百萬上限，疑為異常輸入' };
    }
    return { valid: true, value: num };
  },

  /**
   * 5. 交易狀態機權限檢查
   * 上架中 (上架中) -> 已預約 (已預約) -> 交易完成 (交易完成)
   * 不允許直接從已完成跳回已預約，亦不允許非賣家/非管理員下架商品
   */
  validateStatusTransition(currentStatus, targetStatus, operatorRole = 'seller') {
    if (operatorRole === 'admin') return { allowed: true };
    if (operatorRole !== 'seller') {
      return { allowed: false, error: '權限不足：僅賣家或管理員可變更商品交易狀態' };
    }

    const validTransitions = {
      '上架中': ['已預約', '已下架', '交易完成'],
      '已預約': ['上架中', '交易完成', '已下架'],
      '交易完成': [], // 已完成不可隨意重開
      '已下架': ['上架中']
    };

    const allowed = (validTransitions[currentStatus] || []).includes(targetStatus);
    return {
      allowed,
      error: allowed ? null : `狀態機非法變更：不可從【${currentStatus}】直接切換為【${targetStatus}】`
    };
  }
};
