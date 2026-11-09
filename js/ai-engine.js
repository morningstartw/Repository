// js/ai-engine.js - 4 大 AI 智慧運算引擎
// 1. AI 購物問答助手 (自然語言查詢解析)
// 2. AI 拍照自動上架 (物件辨識與表單自動填寫)
// 3. AI 二手商品價格建議 (合理定價區間模型)
// 4. AI 個人化商品推薦 (關聯性與偏好加權)

export const AIEngine = {
  /**
   * 1. 自然語言查詢解析器 (AI 購物問答助手)
   * 例句：「找 3,000 元以下適合上課的二手平板」、「免費課外書」、「用微積分換線性代數」
   */
  parseNaturalQuery(queryStr = '') {
    const raw = queryStr.trim();
    if (!raw) return { keyword: '', category: '全部', tradeType: '全部', minPrice: null, maxPrice: null };

    let category = '全部';
    let tradeType = '全部';
    let minPrice = null;
    let maxPrice = null;
    let keyword = raw;

    // 解析預算價格：如 "3000元以下"、"3000以內"、"3000 元"
    const priceMatch = raw.match(/(\d+[\d,]*)\s*(?:元|塊)?\s*(?:以?下|以?內|左右)/);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    }

    // 解析免費/贈送意圖
    if (/免費|零元|0元|索取|送我|贈送/.test(raw)) {
      tradeType = '免費贈送';
      maxPrice = 0;
    } else if (/換|交換|以物易物|互換/.test(raw)) {
      tradeType = '交換';
    }

    // 解析商品品類
    if (/課本|教材|書|微積分|原文書|代數|物理|講義/.test(raw)) {
      category = '課本教材';
    } else if (/ipad|平板|耳機|滑鼠|筆電|鍵盤|手機|3c|電器|3C/.test(raw)) {
      category = '3C電子';
    } else if (/電鍋|烤箱|書桌|椅子|檯燈|微波爐|家具|生活/.test(raw)) {
      category = '家具生活';
    } else if (/外套|衣服|褲子|帽子|包包|飾品/.test(raw)) {
      category = '服飾配件';
    }

    // 提取精簡關鍵字（剔除助詞與意圖詞）
    const cleanKw = raw
      .replace(/找|尋找|想要|有沒有|請問|求|適合|二手|的大學|學生/g, '')
      .replace(/(\d+[\d,]*)\s*(?:元|塊)?\s*(?:以?下|以?內|左右)?/g, '')
      .replace(/免費|零元|索取|交換|換/g, '')
      .trim();

    return {
      rawQuery: raw,
      keyword: cleanKw || raw,
      category,
      tradeType,
      minPrice,
      maxPrice,
      summary: `AI 已解析：關鍵字「${cleanKw || '綜合'}」· 分類「${category}」· 交易「${tradeType}」${maxPrice !== null ? ` · 預算上限 $${maxPrice}` : ''}`
    };
  },

  /**
   * 2. AI 拍照自動上架辨識模組
   * 模擬學生拍攝教科書、3C、生活家電照片，AI 多模態辨識並自動生成標題、分類、建議價格與描述
   */
  autoAnalyzePhoto(photoKey = 'book_calculus') {
    const photoDatabase = {
      book_calculus: {
        title: '微積分 Calculus (Stewart 第9版 原文書)',
        category: '課本教材',
        condition: '9成新',
        suggestedPrice: 450,
        originalPrice: 1350,
        suggestedTradeType: '交換/買賣',
        images: ['📚', '📖'],
        description: '【AI 辨識生成】書籍封面完整，內頁微劃記無缺頁。適合大一微積分課程，附贈期中期末考筆記。',
        ecoExp: 35,
        carbonKg: 2.5
      },
      ipad: {
        title: 'Apple iPad 10.2吋 64GB WiFi 太空灰',
        category: '3C電子',
        condition: '85成新',
        suggestedPrice: 3100,
        originalPrice: 10900,
        suggestedTradeType: '買賣',
        images: ['📱', '📦'],
        description: '【AI 辨識生成】金屬機身邊角無撞傷，螢幕顯示正常。附保護套，適合學生遠距上課與做筆記。',
        ecoExp: 50,
        carbonKg: 8.5
      },
      cooker: {
        title: '大同 6人份全不鏽鋼小電鍋',
        category: '家具生活',
        condition: '8成新',
        suggestedPrice: 0,
        originalPrice: 2800,
        suggestedTradeType: '免費贈送',
        images: ['🎁', '🍲'],
        description: '【AI 辨識生成】經典耐用款，加熱開關與指示燈正常。建議免費贈送或以甜甜價出清給同校學弟妹。',
        ecoExp: 100,
        carbonKg: 18.2
      },
      headphones: {
        title: 'Sony 藍牙主動降噪全罩耳機 WH-1000XM4',
        category: '3C電子',
        condition: '9成新',
        suggestedPrice: 4300,
        originalPrice: 9900,
        suggestedTradeType: '買賣',
        images: ['🎧', '🎵'],
        description: '【AI 辨識生成】降噪效能完好，皮革耳罩無龜裂。附便攜收納盒與音源線，圖書館自習專用神物。',
        ecoExp: 45,
        carbonKg: 5.0
      }
    };

    return photoDatabase[photoKey] || photoDatabase.book_calculus;
  },

  /**
   * 3. AI 二手商品價格建議 (合理售價區間模型)
   * 依據品類、新舊程度與原價，計算二手折舊率與建議售價
   */
  estimatePrice(category = '課本教材', condition = '8成新', originalPrice = 1000) {
    if (!originalPrice || originalPrice <= 0) {
      return { low: 0, high: 0, disclaimer: '✨ 系統估算值，僅供參考' };
    }

    // 新舊折舊係數
    const conditionRateMap = {
      '全新': 0.75,
      '95成新': 0.60,
      '9成新': 0.50,
      '85成新': 0.40,
      '8成新': 0.32,
      '75成新': 0.25,
      '7成新': 0.18
    };

    // 品類保值修正
    const categoryFactor = {
      '3C電子': 1.1,
      '課本教材': 0.9,
      '服飾配件': 0.7,
      '家具生活': 0.8
    }[category] || 1.0;

    const baseRate = (conditionRateMap[condition] || 0.35) * categoryFactor;
    const midPrice = Math.round(originalPrice * baseRate);
    const low = Math.max(50, Math.round(midPrice * 0.85 / 10) * 10);
    const high = Math.min(originalPrice, Math.round(midPrice * 1.15 / 10) * 10);

    return {
      low,
      high,
      mid: midPrice,
      disclaimer: '✨ 系統估算值，僅供參考（考量歷史行情、新舊度與品牌折舊）'
    };
  },

  /**
   * 4. AI 個人化商品推薦演算法
   * 依據使用者的所屬學校、科系、收藏清單與品類偏好，為每件商品計算關聯度分數
   */
  getPersonalizedRecommendations(userProfile = {}, allItems = []) {
    if (!allItems || allItems.length === 0) return [];

    const userSchool = userProfile.school || '';
    const userDept = userProfile.department || '';
    const wishlistIds = userProfile.wishlistIds || [];

    // 計算關聯加權分數
    const scoredItems = allItems.map(item => {
      let score = 0;

      // 同校面交大幅加分
      if (item.school === userSchool) score += 35;

      // 已在收藏清單加分
      if (wishlistIds.includes(item.id)) score += 20;

      // 科系匹配
      if (userDept.includes('資工') || userDept.includes('電機')) {
        if (item.category === '3C電子' || item.title.includes('微積分') || item.title.includes('物理') || item.title.includes('代數')) {
          score += 25;
        }
      } else if (userDept.includes('商') || userDept.includes('管') || userDept.includes('文')) {
        if (item.category === '服飾配件' || item.title.includes('習慣') || item.title.includes('勇氣')) {
          score += 25;
        }
      }

      // 高信用賣家加分
      if (item.seller && item.seller.rating >= 4.8) score += 10;
      if (item.seller && item.seller.verifiedEdu) score += 10;

      // 免費贈送與高環保價值推薦
      if (item.price === 0 || item.tradeType.includes('贈送')) score += 15;

      return { ...item, _matchScore: score };
    });

    // 由高至低排序
    scoredItems.sort((a, b) => b._matchScore - a._matchScore);
    return scoredItems;
  }
};
