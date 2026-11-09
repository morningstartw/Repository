// tests/ai.test.js - Unit tests for 4 AI Smart Modules
export function runAITests(AIEngine, mockItems) {
  const results = [];
  function assert(name, condition, message = '') {
    if (condition) {
      results.push({ name, passed: true });
    } else {
      results.push({ name, passed: false, error: message || 'Assertion failed' });
    }
  }

  try {
    // Test 1: Natural Language Query Parsing - Budget and keyword
    const parsed1 = AIEngine.parseNaturalQuery('找 3000 元以下適合上課的二手平板或 iPad');
    assert('NLP extracts maxPrice 3000 and 3C category', parsed1.maxPrice === 3000 && (parsed1.category === '3C電子' || parsed1.keyword.includes('平板') || parsed1.keyword.includes('iPad')), 'NLP price parsing failed');

    // Test 2: Natural Language Query Parsing - Free giveaway
    const parsed2 = AIEngine.parseNaturalQuery('有沒有免費的課外書可以索取');
    assert('NLP recognizes free giveaway intent', parsed2.tradeType === '免費贈送' && parsed2.maxPrice === 0, 'NLP free trade recognition failed');

    // Test 3: Natural Language Query Parsing - Barter / Exchange
    const parsed3 = AIEngine.parseNaturalQuery('我想用微積分換線性代數課本');
    assert('NLP recognizes barter/exchange intent', parsed3.tradeType === '交換' || parsed3.keyword.includes('代數') || parsed3.category === '課本教材', 'NLP barter parsing failed');

    // Test 4: AI Photo Recognition Simulation
    const analysis = AIEngine.autoAnalyzePhoto('book_calculus');
    assert('Photo analysis identifies textbook details', analysis && analysis.title.includes('微積分') && analysis.category === '課本教材' && analysis.suggestedPrice > 0, 'Photo analysis failed');

    // Test 5: AI Price Estimation Algorithm
    const estimate = AIEngine.estimatePrice('3C電子', '8成新', 10000);
    assert('Price estimator generates low and high bounds', estimate && estimate.low > 0 && estimate.high >= estimate.low && estimate.high < 10000, 'Price estimation bounds invalid');

    // Test 6: AI Price Estimation includes official disclaimer note
    assert('Price estimator includes disclaimer', estimate.disclaimer && estimate.disclaimer.includes('估算值'), 'Disclaimer missing');

    // Test 7: Personalized Recommendation
    const userProfile = { school: '國立臺灣大學', department: '資訊工程系', wishlistIds: ['prod-001'] };
    const recs = AIEngine.getPersonalizedRecommendations(userProfile, mockItems);
    assert('Recommender returns prioritized list', Array.isArray(recs) && recs.length > 0, 'Recommendation engine failed');

  } catch (err) {
    results.push({ name: 'AI test suite exception', passed: false, error: err.message });
  }

  return results;
}
