// js/filter-engine.js - 多維度商品搜尋、篩選與排序核心引擎

export function filterItems(items = [], criteria = {}) {
  let result = [...items];

  // 1. 關鍵字搜尋 (支援標題、描述、賣家、學校)
  if (criteria.keyword && criteria.keyword.trim() !== '') {
    const kw = criteria.keyword.trim().toLowerCase();
    result = result.filter(item => {
      const titleMatch = (item.title || '').toLowerCase().includes(kw);
      const descMatch = (item.description || '').toLowerCase().includes(kw);
      const schoolMatch = (item.school || '').toLowerCase().includes(kw);
      const sellerMatch = item.seller ? (item.seller.name || '').toLowerCase().includes(kw) : false;
      const tagMatch = item.category ? item.category.toLowerCase().includes(kw) : false;
      return titleMatch || descMatch || schoolMatch || sellerMatch || tagMatch;
    });
  }

  // 2. 分類篩選
  if (criteria.category && criteria.category !== '全部') {
    result = result.filter(item => item.category === criteria.category);
  }

  // 3. 交易方式篩選 (買賣 / 交換 / 免費贈送)
  if (criteria.tradeType && criteria.tradeType !== '全部') {
    if (criteria.tradeType === '免費贈送') {
      result = result.filter(item => item.tradeType.includes('贈送') || item.price === 0);
    } else if (criteria.tradeType === '交換' || criteria.tradeType === '以物易物') {
      result = result.filter(item => item.tradeType.includes('交換') || item.exchangeWish);
    } else if (criteria.tradeType === '買賣') {
      result = result.filter(item => item.tradeType.includes('買賣') && item.price > 0);
    }
  }

  // 4. 價格區間篩選與防呆
  let min = criteria.minPrice !== undefined && criteria.minPrice !== '' ? Number(criteria.minPrice) : null;
  let max = criteria.maxPrice !== undefined && criteria.maxPrice !== '' ? Number(criteria.maxPrice) : null;

  if (min !== null && max !== null && min > max) {
    // 價格顛倒防呆：自動對調
    const temp = min;
    min = max;
    max = temp;
  }

  if (min !== null && !isNaN(min)) {
    result = result.filter(item => item.price >= min);
  }
  if (max !== null && !isNaN(max)) {
    result = result.filter(item => item.price <= max);
  }

  // 5. 學校與同校面交篩選
  if (criteria.school && criteria.schoolOnly) {
    result = result.filter(item => item.school === criteria.school);
  }

  // 6. 僅看收藏 (Wishlist Only)
  if (criteria.wishlistOnly && Array.isArray(criteria.wishlistIds)) {
    result = result.filter(item => criteria.wishlistIds.includes(item.id));
  }

  // 7. 排序處理
  const sortType = criteria.sort || 'newest';
  if (sortType === 'price-asc') {
    result.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortType === 'price-desc') {
    result.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortType === 'school-first' && criteria.school) {
    result.sort((a, b) => {
      const aSame = a.school === criteria.school ? 1 : 0;
      const bSame = b.school === criteria.school ? 1 : 0;
      if (bSame !== aSame) return bSame - aSame;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  } else {
    // 預設最新上架
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return result;
}
