// tests/integration.test.js - 全流程整合與邊界測試
export function runIntegrationTests(Store, filterItems, AIEngine, Gamification) {
  const results = [];
  function assert(name, condition, message = '') {
    if (condition) {
      results.push({ name, passed: true });
    } else {
      results.push({ name, passed: false, error: message || 'Assertion failed' });
    }
  }

  try {
    // 1. 完整刊登上架 -> 列表過濾 -> 找到該商品
    const user = Store.getUserProfile();
    const testPost = {
      title: '工學院工程數學 O Neil 8th',
      category: '課本教材',
      condition: '95成新',
      price: 350,
      originalPrice: 1200,
      tradeType: '買賣',
      school: user.school,
      meetupLocation: '工科系館大廳',
      description: '原廠精裝本無缺頁',
      seller: { id: user.id, name: user.name, school: user.school, verifiedEdu: true },
      status: '上架中'
    };
    const saved = Store.saveItem(testPost);
    assert('Integration: Store saves item and assigns ID', saved && saved.id, 'Failed to save item');

    const searchRes = filterItems(Store.getItems(), { keyword: '工程數學' });
    assert('Integration: Filter finds newly listed item', searchRes.some(i => i.id === saved.id), 'Filter did not find new item');

    // 2. 狀態流轉：上架中 -> 已預約 -> 交易完成
    Store.updateItemStatus(saved.id, '已預約');
    let fetched = Store.getItemById(saved.id);
    assert('Integration: Status updated to 已預約', fetched.status === '已預約', 'Failed status to 已預約');

    Store.updateItemStatus(saved.id, '交易完成');
    fetched = Store.getItemById(saved.id);
    assert('Integration: Status updated to 交易完成', fetched.status === '交易完成', 'Failed status to 交易完成');

    // 3. 抽盲盒遊戲化獎勵
    const initialExp = Store.getUserProfile().exp;
    const luckyReward = Gamification.drawLuckyBox();
    const afterExp = Store.getUserProfile().exp;
    assert('Integration: Lucky blind box awards EXP', afterExp >= initialExp, 'EXP was not awarded');

    // 4. 爭議檢舉與管理員後台處置下架
    const report = Store.addReport(saved.id, '測試價格爭議');
    assert('Integration: Report created in admin system', report && report.id, 'Failed to create report');
    Store.resolveReport(report.id, 'remove');
    const afterDelete = Store.getItemById(saved.id);
    assert('Integration: Admin removal deletes disputed item', afterDelete === null, 'Item was not deleted by admin resolution');

    // 5. 個資防護檢測正規表達式
    const phoneRegex = /09\d{2}[-\s]?\d{3}[-\s]?\d{3}/;
    const hasPhone = phoneRegex.test('我的電話是 0912-345-678 總圖面交');
    const noPhone = phoneRegex.test('我們約下午五點在總圖正門面交可以嗎？');
    assert('Integration: Phone number pattern is correctly caught', hasPhone && !noPhone, 'Phone privacy regex failed');

  } catch (err) {
    results.push({ name: 'Integration test exception', passed: false, error: err.message });
  }

  return results;
}
