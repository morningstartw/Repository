// tests/store.test.js - Unit tests for Data Store & State Management
export function runStoreTests(Store) {
  const results = [];
  function assert(name, condition, message = '') {
    if (condition) {
      results.push({ name, passed: true });
    } else {
      results.push({ name, passed: false, error: message || 'Assertion failed' });
    }
  }

  try {
    // Test 1: Initial seed items loading
    Store.resetToSeed();
    const items = Store.getItems();
    assert('Store loads seed items', Array.isArray(items) && items.length >= 6, `Expected >= 6 items, got ${items.length}`);

    // Test 2: Get item by ID
    const firstItem = items[0];
    const retrieved = Store.getItemById(firstItem.id);
    assert('Store retrieves item by id', retrieved && retrieved.id === firstItem.id, 'Item retrieval mismatch');

    // Test 3: Add new item
    const newItem = {
      title: '測試用全新計算機',
      category: '3C電子',
      price: 250,
      condition: '全新',
      tradeType: '買賣',
      school: '國立臺灣大學',
      meetupLocation: '台大總圖門口',
      seller: { name: '測試者', email: 'test@ntu.edu.tw', school: '國立臺灣大學' },
      status: '上架中'
    };
    const saved = Store.saveItem(newItem);
    assert('Store creates new item with id', saved && saved.id && saved.title === newItem.title, 'Failed to create item');

    // Test 4: Update item status (上架中 -> 已預約 -> 交易完成)
    const updatedStatus = Store.updateItemStatus(saved.id, '已預約');
    assert('Store updates item status to 已預約', updatedStatus && updatedStatus.status === '已預約', 'Status update failed');

    // Test 5: Wishlist toggle
    const isWishlistedInitially = Store.isWishlisted(saved.id);
    Store.toggleWishlist(saved.id);
    const isWishlistedAfter = Store.isWishlisted(saved.id);
    assert('Store toggles wishlist on', !isWishlistedInitially && isWishlistedAfter, 'Wishlist toggle on failed');
    Store.toggleWishlist(saved.id);
    assert('Store toggles wishlist off', !Store.isWishlisted(saved.id), 'Wishlist toggle off failed');

    // Test 6: Gamification EXP gain
    const initialExp = Store.getUserProfile().exp;
    Store.addExp(50);
    const newExp = Store.getUserProfile().exp;
    assert('Store increments gamification EXP', newExp === initialExp + 50, `Expected ${initialExp + 50}, got ${newExp}`);

    // Test 7: Q&A Question & Answer
    Store.addQuestion(saved.id, { author: '王學弟', text: '請問有附電池嗎？' });
    let itemWithQA = Store.getItemById(saved.id);
    assert('Store adds public question', itemWithQA.questions && itemWithQA.questions.length === 1, 'Failed to add question');

  } catch (err) {
    results.push({ name: 'Store test suite fatal exception', passed: false, error: err.message });
  }

  return results;
}
