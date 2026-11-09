// tests/filter.test.js - Unit tests for Search, Filter & Sorting Engine
export function runFilterTests(filterItems, mockItems) {
  const results = [];
  function assert(name, condition, message = '') {
    if (condition) {
      results.push({ name, passed: true });
    } else {
      results.push({ name, passed: false, error: message || 'Assertion failed' });
    }
  }

  try {
    // Test 1: Category filter
    const books = filterItems(mockItems, { category: '課本教材' });
    assert('Filter by category returns only books', books.length > 0 && books.every(i => i.category === '課本教材'), 'Category filter failed');

    // Test 2: Keyword search
    const searchResults = filterItems(mockItems, { keyword: '微積分' });
    assert('Keyword search finds Calculus book', searchResults.length >= 1 && searchResults[0].title.includes('微積分'), 'Keyword search failed');

    // Test 3: Price range filter (minPrice=0, maxPrice=500)
    const cheapItems = filterItems(mockItems, { minPrice: 0, maxPrice: 500 });
    assert('Price range filter restricts price <= 500', cheapItems.length > 0 && cheapItems.every(i => i.price <= 500), 'Price filter failed');

    // Test 4: Price range validation (minPrice > maxPrice should auto-swap or normalize)
    const invertedPrice = filterItems(mockItems, { minPrice: 500, maxPrice: 100 });
    assert('Inverted price range is handled gracefully without error', Array.isArray(invertedPrice), 'Inverted price range failed');

    // Test 5: Trade type filter (免費贈送)
    const freeItems = filterItems(mockItems, { tradeType: '免費贈送' });
    assert('Trade type filter finds free items', freeItems.length >= 1 && freeItems.every(i => i.tradeType.includes('免費贈送') || i.price === 0), 'Trade type filter failed');

    // Test 6: School preference filter (同校優先)
    const ntuItems = filterItems(mockItems, { school: '國立臺灣大學', schoolOnly: true });
    assert('School filter restricts to NTU', ntuItems.every(i => i.school === '國立臺灣大學'), 'School filter failed');

    // Test 7: Sorting price ascending
    const sortedAsc = filterItems(mockItems, { sort: 'price-asc' });
    let isAsc = true;
    for (let i = 0; i < sortedAsc.length - 1; i++) {
      if (sortedAsc[i].price > sortedAsc[i + 1].price) isAsc = false;
    }
    assert('Sorting price ascending works', isAsc, 'Price asc sorting failed');

    // Test 8: Empty search returns empty array gracefully
    const noResults = filterItems(mockItems, { keyword: 'XYZ完全不存在的商品999' });
    assert('No matches returns empty array', Array.isArray(noResults) && noResults.length === 0, 'Empty search mismatch');

  } catch (err) {
    results.push({ name: 'Filter test suite exception', passed: false, error: err.message });
  }

  return results;
}
